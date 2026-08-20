// Tests de logica de batalla pura (PMZ.Battle): tabla de tipos, calculo de
// dano (STAB/critico/clima), captura y stat stages. Sin graficos ni Scene.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadPMZ, makeMoveEntry } = require('./harness');

const pmz = loadPMZ({ seed: 12345 });
const PMZ = pmz.PMZ;

function fighter(species, level, types) {
    const p = PMZ.Pokemon.create(species, level);
    p.level = level;
    if (types) p.types = types.slice();
    PMZ.Battle.initStatStages(p);
    return p;
}

function withStats(p, s) {
    for (const k in s) p[k] = s[k];
    return p;
}

function move(key) {
    return makeMoveEntry(pmz, key);
}

function customMove(key, o) {
    const m = {
        key: key, name: key, pp: 10, maxPp: 10, power: 60,
        type: 'normal', category: 'physical', accuracy: 100, neverMiss: false,
        effect: { type: 'none' }
    };
    for (const k in (o || {})) m[k] = o[k];
    return m;
}

test('typeEffectiveness sigue la tabla real de PMZ/types.json', () => {
    assert.equal(PMZ.Battle.typeEffectiveness('water', ['fire']), 2);      // agua > fuego
    assert.equal(PMZ.Battle.typeEffectiveness('fire', ['grass']), 2);      // fuego > planta
    assert.equal(PMZ.Battle.typeEffectiveness('electric', ['ground']), 0); // inmune
    assert.equal(PMZ.Battle.typeEffectiveness('normal', ['ghost']), 0);    // inmune
    assert.equal(PMZ.Battle.typeEffectiveness('normal', ['rock']), 0.5);   // resistido
    assert.equal(PMZ.Battle.typeEffectiveness('fire', ['fire']), 0.5);     // propio tipo
    assert.equal(PMZ.Battle.typeEffectiveness('normal', ['normal']), 1);   // neutral
    // Doble tipo: 2 x 2 = 4x (agua vs vuelo/roca no; fuego vs planta/veneno -> 4x)
    assert.equal(PMZ.Battle.typeEffectiveness('fire', ['grass', 'bug']), 4);
});

test('calcDamage: STAB 1.5x solo para tipo propio', () => {
    pmz.Math.random = () => 0.9; // sin critico, dano maximo
    const atk = withStats(fighter('rattata', 50), { attack: 100, spAttack: 100 });
    const def = withStats(fighter('rattata', 50), { defense: 100, spDefense: 100 });
    def.types = ['water']; // neutral frente a normal y fighting

    atk.types = ['normal'];
    const stab = PMZ.Battle.calcDamage(atk, def, customMove('x', { type: 'normal' }));
    atk.types = ['fighting'];
    const nonStab = PMZ.Battle.calcDamage(atk, def, customMove('x', { type: 'normal' }));
    assert.ok(stab > nonStab * 1.4 && stab < nonStab * 1.6,
        'Stab x1.5 dentro de rango: stab=' + stab + ' nonStab=' + nonStab);
});

test('calcDamage: efectividad multiplica el dano (2x / 0.5x / 0)', () => {
    pmz.Math.random = () => 0.9;
    const atk = withStats(fighter('rattata', 50), { attack: 100 });
    const def = withStats(fighter('rattata', 50), { defense: 100 });
    atk.types = ['electric'];

    const neutral = PMZ.Battle.calcDamage(atk, def, customMove('x', { type: 'electric' }));
    def.types = ['water'];
    const superEf = PMZ.Battle.calcDamage(atk, def, customMove('x', { type: 'electric' }));
    def.types = ['grass'];
    const resisted = PMZ.Battle.calcDamage(atk, def, customMove('x', { type: 'electric' }));
    def.types = ['ground'];
    const immune = PMZ.Battle.calcDamage(atk, def, customMove('x', { type: 'electric' }));

    assert.ok(superEf > neutral * 1.9 && superEf < neutral * 2.1, '2x: ' + superEf + ' vs ' + neutral);
    assert.ok(resisted < neutral * 0.6, '0.5x: ' + resisted + ' vs ' + neutral);
    assert.equal(immune, 0);
});

test('calcDamage: nunca baja de 1 (salvo inmunidad)', () => {
    pmz.Math.random = () => 0.9;
    const atk = withStats(fighter('rattata', 1), { attack: 1 });
    const def = withStats(fighter('dragonite', 100), { defense: 999 });
    const weak = customMove('x', { power: 1, type: 'normal' });
    assert.ok(PMZ.Battle.calcDamage(atk, def, weak) >= 1);
});

test('calcDamage: escala con el nivel', () => {
    pmz.Math.random = () => 0.9;
    const def = withStats(fighter('rattata', 50), { defense: 100 });
    const low = withStats(fighter('rattata', 25), { attack: 100 });
    const high = withStats(fighter('rattata', 100), { attack: 100 });
    const dmgLow = PMZ.Battle.calcDamage(low, def, customMove('x', { type: 'normal' }));
    const dmgHigh = PMZ.Battle.calcDamage(high, def, customMove('x', { type: 'normal' }));
    assert.ok(dmgHigh > dmgLow, 'nivel alto debe hacer mas dano');
});

test('calcDamage: critico (Focus Energy) hace mas dano', () => {
    const atk = withStats(fighter('rattata', 50), { attack: 100 });
    const def = withStats(fighter('rattata', 50), { defense: 100 });
    const mv = customMove('x', { type: 'normal' });
    PMZ.Battle._focusEnergy = {};
    PMZ.Battle._focusEnergy[atk._battleId] = true; // 12.5% de critico

    const noCrit = (() => { pmz.Math.random = () => 0.9; return PMZ.Battle.calcDamage(atk, def, mv); })();
    const crit = (() => { pmz.Math.random = () => 0.1; return PMZ.Battle.calcDamage(atk, def, mv); })();
    assert.ok(crit > noCrit, 'el critico debe aumentar el dano');
});

test('calcCapture: con rate>=255 se cortocircuita a captura garantizada (4 shakes)', () => {
    const rattata = fighter('rattata', 12); // catchRate 255 -> a plena HP rate = 85
    const r = PMZ.Battle.calcCapture(rattata, 10); // ball x10 -> rate >= 255
    assert.ok(r.rate >= 255);
    assert.equal(r.shakes, 4);
    assert.equal(r.captured, true);
});

test('calcCapture: el estado dormido multiplica el rate x2.5', () => {
    const dragonite = fighter('dragonite', 50); // catchRate 45
    const awake = PMZ.Battle.calcCapture(dragonite, 1);
    dragonite.status = 'sleep';
    const asleep = PMZ.Battle.calcCapture(dragonite, 1);
    assert.equal(asleep.rate, Math.floor(awake.rate * 2.5));
    assert.ok(asleep.rate > awake.rate * 2, 'dormido da rate mucho mayor');
});

test('calcCapture: con rate bajo el resultado depende de los shakes (RNG)', () => {
    const articuno = fighter('articuno', 50); // catchRate 3
    articuno.currentHp = 1;

    pmz.Math.random = () => 0; // todos los shakes caen
    const r0 = PMZ.Battle.calcCapture(articuno, 1);
    assert.equal(r0.shakes, 4);
    assert.equal(r0.captured, true);

    pmz.Math.random = () => 0.99999; // ningun shake cae
    const r1 = PMZ.Battle.calcCapture(articuno, 1);
    assert.equal(r1.shakes, 0);
    assert.equal(r1.captured, false);

    assert.ok(r1.rate <= r0.rate && r0.rate < 15, 'rate bajo en articuno');
});

test('calcCapture: beginCapture (BattleCore) delega y respeta el multiplicador', () => {
    const dragonite = fighter('dragonite', 50);
    const direct = PMZ.Battle.calcCapture(dragonite, 2);
    const viaCore = PMZ.BattleCore.beginCapture({ captureRate: 2 }, dragonite);
    assert.deepEqual(viaCore, direct);
    // Formula canonica: floor(((3*maxHp - 2*curHp) * catchRate * mul) / (3*maxHp))
    const m = dragonite.maxHp, c = dragonite.currentHp;
    const expected = Math.floor(((3 * m - 2 * c) * 45 * 2) / (3 * m));
    assert.equal(viaCore.rate, expected, 'rate con ball x2');
});

test('calcCapture: el rate sube cuanto menos HP tenga el objetivo', () => {
    const dragonite = fighter('dragonite', 50);
    const full = PMZ.Battle.calcCapture(dragonite, 1).rate;
    dragonite.currentHp = 1;
    const low = PMZ.Battle.calcCapture(dragonite, 1).rate;
    assert.ok(low > full, 'a 1 HP el rate debe ser mayor');
});

test('statMultiplier: tabla +6..-6 correcta', () => {
    assert.equal(PMZ.Battle.statMultiplier(0), 1);
    assert.equal(PMZ.Battle.statMultiplier(1), 1.5);
    assert.equal(PMZ.Battle.statMultiplier(2), 2);
    assert.equal(PMZ.Battle.statMultiplier(6), 4);
    assert.equal(PMZ.Battle.statMultiplier(-1), 2 / 3);
    assert.equal(PMZ.Battle.statMultiplier(-6), 2 / 8);
});

test('boostStat: limita a +6/-6 y devuelve el cambio real', () => {
    const p = fighter('rattata', 10);
    assert.equal(PMZ.Battle.boostStat(p, 'attack', 3), 3);
    assert.equal(PMZ.Battle.getStatStage(p, 'attack'), 3);
    assert.equal(PMZ.Battle.boostStat(p, 'attack', 5), 3, 'choca con el techo +6');
    assert.equal(PMZ.Battle.getStatStage(p, 'attack'), 6);
    assert.equal(PMZ.Battle.boostStat(p, 'attack', -20), -12, 'se clampa en -6');
    assert.equal(PMZ.Battle.getStatStage(p, 'attack'), -6);
});

test('checkHit: precision, evasion y neverMiss', () => {
    const atk = fighter('rattata', 10);
    const def = fighter('rattata', 10);
    pmz.Math.random = () => 0.9; // 90 -> falla con 50%, acierta con 100%+

    assert.equal(PMZ.Battle.checkHit(atk, def, customMove('x', { accuracy: 100 })), true);
    assert.equal(PMZ.Battle.checkHit(atk, def, customMove('x', { accuracy: 50 })), false);
    assert.equal(PMZ.Battle.checkHit(atk, def, customMove('x', { accuracy: 50, neverMiss: true })), true);

    pmz.Math.random = () => 0.01;
    assert.equal(PMZ.Battle.checkHit(atk, def, customMove('x', { accuracy: 50 })), true);
});