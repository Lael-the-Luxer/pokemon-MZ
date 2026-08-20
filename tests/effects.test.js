// Tests de PMZ.Effects + PMZ.Status a traves del pipeline de batalla real
// (executeMove -> applyMoveEffects -> registry).
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadPMZ, makeMoveEntry, startWild } = require('./harness');

const pmz = loadPMZ({ seed: 777 });
const PMZ = pmz.PMZ;
const core = PMZ.BattleCore;

function move(key) { return makeMoveEntry(pmz, key); }

function battle(party, wildSpecies, wildLevel) {
    const res = startWild(pmz, wildSpecies || 'rattata', wildLevel || 10, {
        party: party || [{ species: 'pikachu', level: 25 }]
    });
    return res;
}

function withRandom(fn, value) {
    const prev = pmz.Math.random;
    pmz.Math.random = () => value;
    try { return fn(); } finally { pmz.Math.random = prev; }
}

test('thunderwave: paraliza y reduce la velocidad', () => {
    const { player, wild } = battle();
    withRandom(() => {
        const res = core.executeMove(player, wild, move('thunderwave'));
        assert.equal(wild.status, 'paralyze');
        assert.equal(PMZ.Status.speedMod(wild), 0.5);
        assert.ok(/paraliz/.test(res.msg));
    }, 0.9);
});

test('growl: baja Ataque -1 del rival', () => {
    const { player, wild } = battle();
    withRandom(() => {
        core.executeMove(player, wild, move('growl'));
        assert.equal(PMZ.Battle.getStatStage(wild, 'attack'), -1);
        assert.equal(PMZ.Battle.statMultiplier(-1), 2 / 3);
    }, 0.9);
});

test('swords dance: sube Ataque +2 de si mismo', () => {
    const { player, wild } = battle();
    withRandom(() => {
        const res = core.executeMove(player, wild, move('swordsdance'));
        assert.equal(PMZ.Battle.getStatStage(player, 'attack'), 2);
        assert.equal(PMZ.Battle.statMultiplier(2), 2);
        assert.ok(/subio|Ataque/.test(res.msg));
    }, 0.9);
});

test('dragon rage: dano fijo de 40 sin importar tipos', () => {
    const { player, wild } = battle();
    wild.types = ['rock'];
    withRandom(() => {
        const res = core.executeMove(player, wild, move('dragonrage'));
        assert.equal(res.damage, 40);
        assert.equal(wild.currentHp, Math.max(0, wild.maxHp - 40));
    }, 0.9);
});

test('fissure (OHKO): falla si el atacante es de menor nivel', () => {
    const { player, wild } = battle([{ species: 'pikachu', level: 5 }], 'rattata', 60);
    const fissure = move('fissure');
    fissure.accuracy = 100; // aislar la precision del mechanic OHKO
    withRandom(() => {
        const res = core.executeMove(player, wild, fissure);
        assert.equal(res.ohkoFailed, true);
        assert.equal(res.damage, 0);
        assert.equal(res.msg, 'Fallo!');
        assert.equal(wild.currentHp, wild.maxHp);
    }, 0.9);
});

test('fissure (OHKO): contra nivel menor, KOs de una vez', () => {
    const { player, wild } = battle([{ species: 'pikachu', level: 100 }], 'rattata', 5);
    const fissure = move('fissure');
    fissure.accuracy = 100;
    withRandom(() => {
        const res = core.executeMove(player, wild, fissure);
        assert.equal(res.ohkoFailed, false);
        assert.equal(res.damage, wild.maxHp);
        assert.equal(PMZ.Pokemon.isFainted(wild), true);
    }, 0.9);
});

test('rest: cura PS completos y se duerme', () => {
    const { player, wild } = battle();
    player.currentHp = 10;
    withRandom(() => {
        const res = core.executeMove(player, wild, move('rest'));
        assert.equal(player.currentHp, player.maxHp);
        assert.equal(player.status, 'sleep');
        assert.equal(PMZ.Status.canAct(player), false);
        assert.ok(res.msg.length > 0);
    }, 0.9);
});

test('mega drain: drena el 50% del dano causado', () => {
    const { player, wild } = battle();
    player.currentHp = Math.floor(player.maxHp / 2);
    withRandom(() => {
        const before = player.currentHp;
        const res = core.executeMove(player, wild, move('megadrain'));
        assert.ok(res.damage > 0, 'mega drain no debe fallar');
        const heal = Math.floor(res.damage * 0.5);
        assert.equal(player.currentHp, before + heal);
        assert.ok(/absorbe|recupero/.test(res.msg));
    }, 0.9);
});

test('confuse ray: confunde y el tick puede autogolpear', () => {
    const { player, wild } = battle();
    withRandom(() => {
        core.executeMove(player, wild, move('confuseray'));
        assert.equal(wild.status, 'confusion');
        assert.equal(PMZ.Status.canAct(wild), true);
    }, 0.9);

    const hpBefore = wild.currentHp;
    withRandom(() => {
        const tick = PMZ.Status.tick(wild);
        assert.equal(tick.confusedHit, true);
        assert.equal(tick.damaged, true);
        assert.equal(wild.currentHp, hpBefore - Math.max(1, Math.floor(wild.maxHp / 10)));
    }, 0.01);
});

test('toxic: envenena y el tick hace dano', () => {
    const { player, wild } = battle();
    withRandom(() => {
        core.executeMove(player, wild, move('toxic')); // acc 85: con r bajo acierta
        assert.equal(wild.status, 'toxic');
        const maxHp = wild.maxHp;
        const tick = PMZ.Status.tick(wild);
        assert.equal(tick.damaged, true);
        assert.equal(wild.currentHp, maxHp - Math.max(1, Math.floor(maxHp / 8)));
    }, 0.01);
});

test('leech seed: siembra y el drenaje de fin de turno cura al usuario', () => {
    const { player, wild } = battle();
    withRandom(() => {
        core.executeMove(player, wild, move('leechseed')); // acc 90
        assert.equal(PMZ.Battle._leechSeed[wild._battleId], player._battleId);
    }, 0.01);

    player.currentHp = Math.floor(player.maxHp / 2);
    const drain = Math.max(1, Math.floor(wild.maxHp * 0.125));
    const hpWild = wild.currentHp;
    const hpPlayer = player.currentHp;
    const msg = core.leechSeed();
    assert.equal(wild.currentHp, hpWild - drain);
    assert.equal(player.currentHp, hpPlayer + drain);
    assert.ok(/Semilla/.test(msg));
});

test('protect: bloquea el proximo ataque sin recibir dano', () => {
    const { player, wild } = battle();
    // Success del protect: r < 0.5
    withRandom(() => {
        core.executeMove(player, wild, move('protect'));
        assert.equal(PMZ.Battle._protect[player._battleId].success, true);
    }, 0.01);

    withRandom(() => {
        const res = core.executeMove(wild, player, move('thunderbolt'));
        assert.equal(res.protected, true);
        assert.equal(res.msg, 'Protegio!');
        assert.equal(res.damage, 0);
        assert.equal(player.currentHp, player.maxHp);
        // El protect se consume
        assert.equal(PMZ.Battle._protect[player._battleId], undefined);
    }, 0.9);
});

test('sandstorm: dano de clima 1/16 para los no inmunes', () => {
    const { player, wild } = battle(undefined, 'geodude', 10); // geodude: rock/ground inmune
    PMZ.Weather.set('sandstorm', 5);
    const wildHp = wild.currentHp;
    const playerHp = player.currentHp;
    const msg = core.weatherDamage();
    assert.ok(msg.length > 0, 'el clima debe hacer dano');
    assert.equal(wild.currentHp, wildHp, 'rock/ground inmune a sandstorm');
    assert.equal(player.currentHp, playerHp - Math.max(1, Math.floor(player.maxHp / 16)));
    PMZ.Weather.set('none', 0);
});

test('sin clima activo, weatherDamage no hace nada', () => {
    const { player, wild } = battle();
    PMZ.Weather.set('none', 0);
    const hp = player.currentHp;
    assert.equal(core.weatherDamage(), '');
    assert.equal(player.currentHp, hp);
});

test('statMultiplier + checkHit: stage de evasion evita golpes', () => {
    const { player, wild } = battle();
    withRandom(() => {
        // +2 evasion del defensor: accMult 1 / evaMult 2 -> 50% final con acc 100
        PMZ.Battle.boostStat(wild, 'evasion', 2);
        // r=0.9 -> 90 no < 50 -> falla
        assert.equal(PMZ.Battle.checkHit(player, wild, move('quickattack')), false);
        // r=0.01 -> acierta
        pmz.Math.random = () => 0.01;
        assert.equal(PMZ.Battle.checkHit(player, wild, move('quickattack')), true);
    }, 0.9);
});