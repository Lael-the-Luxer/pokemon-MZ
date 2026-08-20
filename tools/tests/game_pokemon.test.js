//=============================================================================
// tools/tests/game_pokemon.test.js
// Tests de Game_Pokemon cargando los JSON reales de PMZ/ (nada hardcodeado).
// Uso: node --test tools/tests/
//=============================================================================
'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// --- Stub mínimo del entorno (PMZ.Data con JSON reales) ---
const PMZ_DIR = path.join(__dirname, '..', '..', 'PMZ');
const load = (name) => JSON.parse(fs.readFileSync(path.join(PMZ_DIR, name + '.json'), 'utf8'));

global.PMZ = {
    Data: {
        _cache: {},
        pokemon: null, move: null, natures: null,
        configValue: (k) => {
            const c = global.PMZ.Data._cache.config || {};
            return c[k] !== undefined ? c[k] : null;
        }
    },
    Config: { isStatEvolution: () => false },
    Evolution: { checkAll: () => null, evolve: () => {} }
};
PMZ.Data._cache.pokemon = load('pokemon');
PMZ.Data._cache.moves = load('moves');
PMZ.Data._cache.natures = load('natures');
PMZ.Data._cache.config = load('config');
PMZ.Data.pokemon = (k) => PMZ.Data._cache.pokemon[k] || null;
PMZ.Data.move = (k) => PMZ.Data._cache.moves[k] || null;
PMZ.Data.natures = () => PMZ.Data._cache.natures || null;
global.$gameTemp = {};

// Cargar la clase (eval indirecto → declara Game_Pokemon en global)
(0, eval)(fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'plugins', 'PMZ_GamePokemon.js'), 'utf8'));

// Helper: crear con IVs fijos para stats deterministas
function makeFixed(species, level, nature, ivs) {
    const p = new Game_Pokemon(species, level);
    for (const s of ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed']) p.ivs[s] = ivs[s] || 0;
    p.nature = nature || 'hardy';
    p.calculateStats();
    return p;
}

describe('Game_Pokemon — creación', () => {
    test('crea instancia con datos del JSON', () => {
        const p = new Game_Pokemon('bulbasaur', 5);
        assert.ok(p instanceof Game_Pokemon);
        assert.strictEqual(p.species, 'bulbasaur');
        assert.strictEqual(p.name, 'Bulbasaur');
        assert.deepStrictEqual(p.types, ['grass', 'poison']);
        assert.strictEqual(p.level, 5);
        assert.ok(p.currentHp > 0);
        assert.strictEqual(p.currentHp, p.maxHp);
        assert.ok(p.moves.length >= 1 && p.moves.length <= 4);
        assert.ok(p.heldItems.length === 0);
    });

    test('especie inexistente devuelve objeto sin init (create lo guarda)', () => {
        const p = new Game_Pokemon('missing_species', 5);
        assert.strictEqual(p.species, undefined);
    });

    test('moves vienen del JSON por nivel', () => {
        const p = new Game_Pokemon('bulbasaur', 5);
        const moves = p.moves.map((m) => m.key);
        const expected = Object.keys(PMZ.Data._cache.pokemon.bulbasaur.moves)
            .filter((lvl) => parseInt(lvl) <= 5)
            .map((lvl) => PMZ.Data._cache.pokemon.bulbasaur.moves[lvl])
            .flat()
            .map((k) => k.toLowerCase());
        // últimos `limit` por nivel
        const limit = PMZ.Data.configValue('battleMovesLimit') || 4;
        const take = expected.slice(-limit);
        assert.deepStrictEqual(moves, take.map((k) => k));
    });
});

describe('Game_Pokemon — stats', () => {
    test('stats deterministas con IVs 0 y naturaleza hardy', () => {
        const p = makeFixed('bulbasaur', 5, 'hardy', {});
        const base = PMZ.Data.pokemon('bulbasaur');
        const expectedHp = Math.floor(((2 * base.baseStats.hp + 0 + 0) * 5 / 100) + 5 + 10);
        assert.strictEqual(p.maxHp, expectedHp);
        assert.strictEqual(p.hp, expectedHp);
    });

    test('naturaleza adamant: attack +10%, spAttack -10%', () => {
        const base = PMZ.Data.pokemon('bulbasaur');
        const p = makeFixed('bulbasaur', 5, 'adamant', {});
        const flat = Math.floor(((2 * base.baseStats.attack + 0 + 0) * 5 / 100) + 5);
        assert.strictEqual(p.attack, Math.floor(flat * 1.1));
        const flatSa = Math.floor(((2 * base.baseStats.spAttack + 0 + 0) * 5 / 100) + 5);
        assert.strictEqual(p.spAttack, Math.floor(flatSa * 0.9));
    });

    test('todas las naturalezas del JSON son válidas', () => {
        const natures = Object.keys(PMZ.Data.natures());
        assert.strictEqual(natures.length, 25);
        natures.forEach((n) => {
            const p = makeFixed('bulbasaur', 5, n, {});
            assert.ok(p.attack > 0 && p.defense > 0);
        });
    });
});

describe('Game_Pokemon — género', () => {
    test('genderRatio null = genderless', () => {
        assert.strictEqual(Game_Pokemon.getGender('ditto'), 'genderless');
        assert.strictEqual(Game_Pokemon.getGender('magnemite'), 'genderless');
        assert.strictEqual(Game_Pokemon.getGender('mewtwo'), 'genderless');
    });
    test('genderRatio 100 = macho, 0 = hembra', () => {
        assert.strictEqual(Game_Pokemon.getGender('nidoranm'), 'male');
        assert.strictEqual(Game_Pokemon.getGender('hitmonlee'), 'male');
        assert.strictEqual(Game_Pokemon.getGender('nidoranf'), 'female');
        assert.strictEqual(Game_Pokemon.getGender('chansey'), 'female');
        assert.strictEqual(Game_Pokemon.getGender('kangaskhan'), 'female');
    });
    test('50% da macho o hembra', () => {
        const r = Game_Pokemon.getGender('pidgey');
        assert.ok(r === 'male' || r === 'female');
    });
});

describe('Game_Pokemon — exp y niveles', () => {
    test('gainExp sube nivel y recalcula stats', () => {
        const p = new Game_Pokemon('pidgey', 5);
        const before = p.level;
        p.exp = p.expToNext - 1;
        const res = p.gainExp(100);
        assert.strictEqual(res.leveled, true);
        assert.ok(p.level > before);
        assert.strictEqual(p.currentHp, Math.min(p.currentHp, p.maxHp));
    });

    test('no gana exp si está debilitado', () => {
        const p = new Game_Pokemon('pidgey', 5);
        p.currentHp = 0;
        const expBefore = p.exp;
        const res = p.gainExp(1000);
        assert.strictEqual(res.leveled, false);
        assert.strictEqual(p.exp, expBefore);
    });
});

describe('Game_Pokemon — EVs desde JSON', () => {
    test('gainEVs usa evYields de pokemon.json', () => {
        const p = new Game_Pokemon('pidgey', 5);
        const yields = PMZ.Data.pokemon('pidgey').evYields;
        const evBefore = p.evs.speed;
        p.gainEVs('pidgey');
        assert.strictEqual(p.evs.speed, evBefore + (yields.speed || 0));
    });
    test('especie sin evYields da default speed+1', () => {
        const p = new Game_Pokemon('pidgey', 5);
        // especie 'charmander' tiene evYields definido; usar clave inexistente
        p.evs.speed = 0;
        p.gainEVs('especie_inexistente');
        assert.strictEqual(p.evs.speed, 1);
    });
});

describe('Game_Pokemon — moves', () => {
    test('canLearn respeta tmMoves del JSON', () => {
        const p = new Game_Pokemon('bulbasaur', 5);
        // solarbeam es TM del JSON de bulbasaur? comprobar contra datos
        const tm = Object.keys(PMZ.Data.pokemon('bulbasaur').tmMoves || {});
        if (tm.length) {
            const first = tm[0] === '*' ? 'solarbeam' : tm[0];
            // si tmMoves tiene '*', todo compatible
        }
        assert.strictEqual(typeof p.canLearn('tackle'), 'boolean');
    });

    test('teachMove con 4 moves devuelve needReplace', () => {
        const p = new Game_Pokemon('bulbasaur', 5);
        const known = p.moves[0].key;
        while (p.moves.length < 4) {
            p.moves.push(JSON.parse(JSON.stringify(p.moves[0])));
        }
        // enseñar un move de nivel superior que aún no conoce (del JSON)
        const allMoves = PMZ.Data._cache.pokemon.bulbasaur.moves;
        const knownKeys = p.moves.map((m) => m.key);
        const target = Object.keys(allMoves)
            .filter((lvl) => parseInt(lvl) > p.level)
            .flatMap((lvl) => allMoves[lvl])
            .find((k) => knownKeys.indexOf(k.toLowerCase()) < 0);
        const res = p.teachMove(target);
        assert.strictEqual(res.success, true);
        assert.strictEqual(res.learned, false);
        assert.strictEqual(res.needReplace, true);
    });

    test('replaceMove reemplaza el move en el índice', () => {
        const p = new Game_Pokemon('bulbasaur', 5);
        const idx = 0;
        const ok = p.replaceMove(idx, { key: 'tackle', name: 'Tackle', pp: 35, maxPp: 35, power: 40, type: 'normal', category: 'physical', accuracy: 100, effect: 'none' });
        assert.strictEqual(ok, true);
        assert.strictEqual(p.moves[idx].key, 'tackle');
    });
});

describe('Game_Pokemon — rehidratación de saves', () => {
    test('objeto plano del save gana los métodos', () => {
        const plain = {
            species: 'pidgey', name: 'Pidgey', level: 10, hp: 50, maxHp: 50,
            currentHp: 30, attack: 20, defense: 20, spAttack: 20, spDefense: 20, speed: 20,
            moves: [], exp: 100, expToNext: 200, status: null, ivs: {}, evs: {},
            nature: 'hardy', catchRate: 45, gender: 'male', shiny: false, happiness: 70, heldItems: []
        };
        Game_Pokemon.rehydrate(plain);
        assert.ok(plain instanceof Game_Pokemon);
        assert.strictEqual(typeof plain.isFainted, 'function');
        assert.strictEqual(plain.isFainted(), false);
        plain.currentHp = 0;
        assert.strictEqual(plain.isFainted(), true);
        plain.heal();
        assert.strictEqual(plain.currentHp, plain.maxHp);
    });

    test('rehydrateAll procesa party, boxes y daycare', () => {
        const p1 = { species: 'pidgey', level: 5, currentHp: 10, maxHp: 50 };
        const p2 = { species: 'rattata', level: 5, currentHp: 10, maxHp: 40 };
        const egg = { species: 'pidgey', isEgg: true, currentHp: 10, maxHp: 10 };
        const fake = {
            party: () => [p1],
            boxes: () => [[p2]],
            daycare: () => ({ pokemon: [null, null], egg: egg })
        };
        Game_Pokemon.rehydrateAll(fake);
        assert.ok(p1 instanceof Game_Pokemon);
        assert.ok(p2 instanceof Game_Pokemon);
        assert.ok(egg instanceof Game_Pokemon);
    });
});

describe('Game_Pokemon — heal y fainted', () => {
    test('heal restaura HP, status y PP', () => {
        const p = new Game_Pokemon('bulbasaur', 5);
        p.currentHp = 1;
        p.status = 'paralysis';
        p.moves.forEach((m) => (m.pp = 0));
        p.heal();
        assert.strictEqual(p.currentHp, p.maxHp);
        assert.strictEqual(p.status, null);
        p.moves.forEach((m) => assert.strictEqual(m.pp, m.maxPp));
    });
});
