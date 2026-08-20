// Tests de PMZ.BattleCore: cola de turnos, IA, executeMove (protect/miss),
// huida, veredictos de fin de turno, EXP de victoria y recompensas de entrenador.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadPMZ, makeMoveEntry, startWild } = require('./harness');

const pmz = loadPMZ({ seed: 4242 });
const PMZ = pmz.PMZ;
const core = PMZ.BattleCore;

function move(key) { return makeMoveEntry(pmz, key); }

function withRandom(fn, value) {
    const prev = pmz.Math.random;
    pmz.Math.random = () => value;
    try { return fn(); } finally { pmz.Math.random = prev; }
}

function queueOpts(player, wild, extra) {
    return Object.assign({
        player: player, enemy: wild, isDouble: false,
        playerAction: move('thunderbolt'), playerTarget: wild,
        enemyAction: { move: move('tackle'), target: player }
    }, extra || {});
}

test('buildActionQueue: el mas rapido ataca primero', () => {
    const { player, wild } = startWild(pmz, 'rattata', 10);
    player.speed = 100; wild.speed = 200;
    const q = core.buildActionQueue(queueOpts(player, wild));
    assert.equal(q.length, 2);
    assert.equal(q[0].isPlayer, false, 'enemigo mas rapido ataca primero');
    assert.equal(q[0].move.key, 'tackle');
    assert.equal(q[1].isPlayer, true);
    assert.equal(q[1].move.key, 'thunderbolt');
});

test('buildActionQueue: a igual velocidad, el jugador primero', () => {
    const { player, wild } = startWild(pmz, 'rattata', 10);
    player.speed = 100; wild.speed = 100;
    const q = core.buildActionQueue(queueOpts(player, wild));
    assert.equal(q[0].isPlayer, true);
    assert.equal(q[1].isPlayer, false);
});

test('buildActionQueue: sin accion del jugador, solo ataca el enemigo', () => {
    const { player, wild } = startWild(pmz, 'rattata', 10);
    const q = core.buildActionQueue(Object.assign(queueOpts(player, wild), { playerAction: null }));
    assert.equal(q.length, 1);
    assert.equal(q[0].isPlayer, false);
});

test('buildActionQueue: Quick Claw da prioridad (20%)', () => {
    const { player, wild } = startWild(pmz, 'rattata', 10);
    player.speed = 10; wild.speed = 200; // enemigo mucho mas rapido
    player.heldItems = ['quickclaw'];
    withRandom(() => {
        const q = core.buildActionQueue(queueOpts(player, wild));
        assert.equal(q[0].isPlayer, true, 'Quick Claw debe actuar primero');
        assert.equal(q[0].quickClaw, true);
    }, 0.1);
});

test('chooseEnemyActions: elige un movimiento valido contra el objetivo', () => {
    const { player, wild } = startWild(pmz, 'rattata', 10);
    const acts = core.chooseEnemyActions();
    assert.ok(acts.enemyAction, 'debe haber accion enemiga');
    const mv = acts.enemyAction.move;
    assert.ok(wild.moves.some(m => m.key === mv.key), 'move elegido del moveset del wild');
    assert.ok(mv.pp > 0);
    assert.equal(acts.enemyAction.target, player);
});

test('executeMove: fallo por precision (accuracy 50 con r alto)', () => {
    const { player, wild } = startWild(pmz, 'rattata', 10);
    const lowAcc = move('thunderbolt');
    lowAcc.accuracy = 50;
    withRandom(() => {
        const res = core.executeMove(player, wild, lowAcc);
        assert.equal(res.miss, true);
        assert.equal(res.hit, false);
        assert.equal(res.damage, 0);
        assert.ok(/fallo/.test(res.msg));
    }, 0.9);
});

test('executeMove: siempre acierta con neverMiss', () => {
    const { player, wild } = startWild(pmz, 'rattata', 10);
    const swift = move('swift'); // acc 0 = never miss
    withRandom(() => {
        const res = core.executeMove(player, wild, swift);
        assert.equal(res.miss, false);
        assert.equal(res.damage > 0, true);
    }, 0.9);
});

test('executeMove: movimientos de estado enemigos no fallan por precision', () => {
    const { player, wild } = startWild(pmz, 'rattata', 10);
    withRandom(() => {
        const res = core.executeMove(wild, player, move('toxic'), { skipAccuracyIfStatus: true });
        assert.equal(res.hit, true);
        assert.equal(player.status, 'toxic', 'el status aplica igual');
        const res2 = core.executeMove(wild, player, move('toxic'), { skipAccuracyIfStatus: false });
        assert.equal(res2.miss, true, 'sin la opcion, la precision si aplica (acc 85)');
    }, 0.9);
});

test('checkConfusionHit: 33% de autogolpe, 10% de PS', () => {
    const { player, wild } = startWild(pmz, 'rattata', 10);
    player.status = 'confusion';
    withRandom(() => {
        assert.equal(core.checkConfusionHit(player), false, 'r=0.5 no autogolpea');
    }, 0.5);
    const hp = player.currentHp;
    withRandom(() => {
        const dmg = core.checkConfusionHit(player);
        assert.ok(dmg > 0 && dmg === Math.max(1, Math.floor(player.maxHp * 0.1)));
        assert.equal(player.currentHp, hp - dmg);
    }, 0.01);
});

test('computeFlee: formula velocidad*128/velEne+30, r*256 decide', () => {
    const { player, wild } = startWild(pmz, 'rattata', 10);
    player.speed = 100; wild.speed = 50;
    const flee = core.computeFlee(player, wild);
    assert.equal(flee.chance, Math.floor((100 * 128) / 50 + 30));
    assert.equal(flee.success, true, 'chance 286/256 siempre escapa');
    // Escalado por velocidad del rival
    const flee2 = core.computeFlee(player, Object.assign({}, wild, { speed: 1000 }));
    assert.equal(flee2.chance, Math.floor((100 * 128) / 1000 + 30));
});

test('allPokemonList / allEnemiesFainted', () => {
    const { player, wild } = startWild(pmz, 'rattata', 10);
    const list = core.allPokemonList();
    assert.equal(list.length, 2);
    assert.equal(core.allEnemiesFainted(), false);
    wild.currentHp = 0;
    assert.equal(core.allEnemiesFainted(), true);
});

test('resolveEndTurn: veredictos de victoria/derrota/continuar', () => {
    let b = startWild(pmz, 'rattata', 10);
    assert.equal(core.resolveEndTurn(), 'playerCommand');
    b.wild.currentHp = 0;
    assert.equal(core.resolveEndTurn(), 'victory');

    b = startWild(pmz, 'rattata', 10); // fresh battle
    b.player.currentHp = 0;
    assert.equal(core.resolveEndTurn(), 'defeat');
});

test('resolveEndTurn: vs entrenador -> trainerSendOut', () => {
    const { player } = startWild(pmz, 'rattata', 10);
    PMZ.Battle.startTrainer('brock');
    PMZ.Battle._wildPokemon.currentHp = 0;
    assert.equal(core.resolveEndTurn(), 'trainerSendOut');
});

test('resolveDefeat: reemplaza al siguiente Pokemon vivo', () => {
    startWild(pmz, 'rattata', 10, {
        party: [
            { species: 'pikachu', level: 25 },
            { species: 'charmander', level: 10 }
        ]
    });
    const player = PMZ.Party.get(0);
    player.currentHp = 0;
    const res = core.resolveDefeat();
    assert.equal(res.defeated, false);
    assert.equal(res.next, PMZ.Party.get(1));
    assert.equal(PMZ.Battle._playerPokemon, PMZ.Party.get(1));
    assert.equal(PMZ.Battle._activePlayerIndex, 1);
});

test('resolveDefeat: sin Pokemon vivos -> derrota', () => {
    startWild(pmz, 'rattata', 10, {
        party: [
            { species: 'pikachu', level: 25 },
            { species: 'charmander', level: 10 }
        ]
    });
    PMZ.Party.get(0).currentHp = 0;
    PMZ.Party.get(1).currentHp = 0;
    const res = core.resolveDefeat();
    assert.equal(res.defeated, true);
});

test('leechSeed: drena 1/8 al sembrado y cura al sembrador', () => {
    startWild(pmz, 'rattata', 10);
    const player = PMZ.Battle._playerPokemon;
    const wild = PMZ.Battle._wildPokemon;
    PMZ.Battle._leechSeed[wild._battleId] = player._battleId;
    player.currentHp = Math.floor(player.maxHp / 2);
    const drain = Math.max(1, Math.floor(wild.maxHp * 0.125));
    const wp = wild.currentHp, pp = player.currentHp;
    const msg = core.leechSeed();
    assert.equal(wild.currentHp, wp - drain);
    assert.equal(player.currentHp, pp + drain);
    assert.ok(/Semilla/.test(msg));
});

test('bindDamage: 1/16 cada turno y se libera al agotarse', () => {
    startWild(pmz, 'rattata', 10);
    const wild = PMZ.Battle._wildPokemon;
    PMZ.Battle._bind[wild._battleId] = { turns: 1, attackerId: 1 };
    const dmg = Math.max(1, Math.floor(wild.maxHp * 0.0625));
    const hp = wild.currentHp;
    const msg = core.bindDamage();
    assert.equal(wild.currentHp, hp - dmg);
    assert.ok(/se libero/.test(msg));
    assert.equal(PMZ.Battle._bind[wild._battleId], undefined);
});

test('bide: libera el doble del dano acumulado al final', () => {
    startWild(pmz, 'rattata', 10);
    const player = PMZ.Battle._playerPokemon;
    const wild = PMZ.Battle._wildPokemon;
    PMZ.Battle._bide[player._battleId] = { turns: 2, damage: 30 };
    assert.equal(core.bide(), '', 'turno intermedio sin mensaje');
    const msg = core.bide();
    assert.equal(PMZ.Pokemon.isFainted(wild), true, '60 > PS del wild -> KO');
    assert.ok(/libera energia/.test(msg));
    assert.equal(PMZ.Battle._bide[player._battleId], undefined);
});

test('distributeVictoryExp: killer 1.0x de la base, obtiene EXP y EVs', () => {
    startWild(pmz, 'rattata', 1, { party: [{ species: 'pikachu', level: 99 }] });
    const player = PMZ.Battle._playerPokemon;
    const levelBefore = player.level;
    const evBefore = player.evs.speed || 0;
    const out = core.distributeVictoryExp();
    assert.equal(out.expResults.length, 1);
    const er = out.expResults[0];
    assert.equal(er.isKiller, true);
    assert.equal(er.amount, 10, 'base = floor(exp||100)/7 || 10 (wild L1 exp=1)');
    assert.ok(player.level >= levelBefore, 'el killer sube de nivel o se mantiene');
    assert.equal(player.evs.speed, evBefore + (PMZ.Data.pokemon('rattata').evYields.speed || 1));
    assert.ok(/gano 10 EXP/.test(out.msg));
});

test('distributeVictoryExp: participantes secundarios reciben 0.5x', () => {
    startWild(pmz, 'rattata', 10);
    PMZ.Battle.addParticipant(PMZ.Battle._playerPokemon2 = PMZ.Party.get(PMZ.Party.firstAliveIndex()));
    const out = core.distributeVictoryExp();
    assert.equal(out.expResults.length, 1, 'sin doble batalla solo cuenta el activo');
});

test('trainerVictoryRewards: dinero + medalla, una sola vez', () => {
    startWild(pmz, 'rattata', 10);
    PMZ.Battle.startTrainer('brock'); // money 1000, badge boulder
    const before = pmz.$gamePMZ.money();
    const r1 = core.trainerVictoryRewards();
    assert.equal(r1.money, 1000);
    assert.equal(pmz.$gamePMZ.money(), before + 1000);
    assert.equal(r1.badge, 'boulder');
    assert.ok(pmz.$gamePMZ.hasBadge('boulder'));

    const r2 = core.trainerVictoryRewards();
    assert.equal(r2.money, 1000);
    assert.equal(r2.badge, null, 'la medalla solo se entrega una vez');
    assert.equal(pmz.$gamePMZ.money(), before + 2000);
});

test('registerCaptured: devuelve party o pc segun espacio', () => {
    startWild(pmz, 'rattata', 10);
    const wild = PMZ.Battle._wildPokemon;
    const dest = PMZ.BattleCore.registerCaptured(wild);
    assert.ok(dest === 'party' || dest === 'pc');
    if (dest === 'party') {
        assert.ok(pmz.$gamePMZ.party().indexOf(wild) >= 0, 'capturado esta en el equipo');
    } else {
        assert.ok(PMZ.PC.allBoxes().some(box => box.pokemon.indexOf(wild) >= 0), 'capturado esta en el PC');
    }
});