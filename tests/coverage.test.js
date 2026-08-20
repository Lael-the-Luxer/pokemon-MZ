// coverage.test.js — Barrido de cobertura: TODOS los movimientos del
// moves.json (316) y TODAS las habilidades del abilities.json (113) se
// ejecutan al menos una vez en una interaccion de batalla real, sin
// excepciones. Detector de movimientos/habilidades que rompen el motor.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadPMZ, makeMoveEntry, startWild } = require('./harness');

const ROOT = path.join(__dirname, '..');
function keysOf(file) {
    return Object.keys(JSON.parse(fs.readFileSync(path.join(ROOT, 'PMZ', file), 'utf8')))
        .filter(k => !k.startsWith('_'));
}
const ALL_MOVES = keysOf('moves.json');
const ALL_ABILITIES = keysOf('abilities.json');
const HOOKS = ['onDamageCalc', 'onStatusCheck', 'onCritCheck', 'onWeather',
    'onAccuracy', 'onEntry', 'onContact', 'onTurnEnd', 'onSecondaryEffect',
    'onPreventFlinch', 'onOverride'];

const pmz = loadPMZ({ seed: 991 });
const PMZ = pmz.PMZ;
const core = PMZ.BattleCore;

// Baseline de batalla: inicializa contadores y tablas de estado (initBattleTracking)
startWild(pmz, 'rattata', 10);

// Stub de UI: el handler 'weather' de PMZ.Effects aplica el clima al Scene
// (b._msgWindow.setText); aqui no hay Scene, solo logica.
core._msgWindow = { setText: function() { return true; } };

function freshPair(aSpecies, bSpecies) {
    const a = PMZ.Pokemon.create(aSpecies || 'pikachu', 50);
    const b = PMZ.Pokemon.create(bSpecies || 'rattata', 50);
    a._battleId = ++PMZ.Battle._battleIdCounter;
    b._battleId = ++PMZ.Battle._battleIdCounter;
    PMZ.Battle.initStatStages(a);
    PMZ.Battle.initStatStages(b);
    return { a: a, b: b };
}

function resetWeather() {
    PMZ.Weather.set('none', 0);
}

test('cobertura: TODOS los movimientos se ejecutan sin excepciones (' + ALL_MOVES.length + ')', async (t) => {
    for (const key of ALL_MOVES) {
        await t.test(key, () => {
            resetWeather();
            const { a, b } = freshPair();
            const entry = makeMoveEntry(pmz, key);
            a.moves = [entry];
            const res = core.executeMove(a, b, entry);
            assert.ok(res && typeof res === 'object', 'debe devolver resultado');
            assert.ok(res.damage >= 0, 'damage no negativo: ' + res.damage);
            assert.equal(typeof res.msg, 'string', 'mensaje de texto');
            assert.ok(res.hit || res.miss || res.ohkoFailed,
                'estado coherente: hit/miss/ohkoFailed');
            // El mismo movimiento contra el otro lado (defensor con PP y status)
            const res2 = core.executeMove(b, a, entry);
            assert.ok(res2 && typeof res2 === 'object');
        });
    }
});

test('cobertura: TODAS las habilidades no rompen la batalla (' + ALL_ABILITIES.length + ')', async (t) => {
    const cache = PMZ.Data._cache;
    for (const key of ALL_ABILITIES) {
        await t.test(key, () => {
            const saved = cache.pokemon.pikachu.abilities;
            cache.pokemon.pikachu.abilities = [key];
            try {
                resetWeather();
                const { a, b } = freshPair();
                const tackle = makeMoveEntry(pmz, 'tackle');
                const thunderbolt = makeMoveEntry(pmz, 'thunderbolt');
                a.moves = [tackle, thunderbolt];
                b.moves = [tackle, thunderbolt];

                // Bateria de interacciones de combate
                const r1 = core.executeMove(a, b, tackle);
                assert.equal(typeof r1.msg, 'string');
                core.executeMove(b, a, thunderbolt);
                PMZ.Status.tick(a);
                PMZ.Status.tick(b);
                core.weatherDamage();

                // Cualquier hook declarado en abilities.json debe tolerar el ctx
                const ctx = { attacker: a, defender: b, pokemon: a, move: tackle, damage: 10 };
                for (const h of HOOKS) {
                    PMZ.Abilities.triggerHook(h, ctx);
                }

                // Climas con la habilidad activa
                ['sun', 'rain', 'sandstorm', 'hail'].forEach((w) => {
                    PMZ.Weather.set(w, 5);
                    core.weatherDamage();
                    core.executeMove(a, b, tackle);
                });
                resetWeather();
            } finally {
                cache.pokemon.pikachu.abilities = saved;
            }
        });
    }
});