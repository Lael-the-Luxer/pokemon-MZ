// Smoke test: carga los plugins en el sandbox, crea una batalla y ejecuta un turno.
// Uso: node tests/_smoke.js
const path = require('path');
const { loadPMZ, makeMoveEntry, startWild } = require('./harness');

const pmz = loadPMZ({ seed: 42 });

const b = pmz.PMZ.Battle;
const core = pmz.PMZ.BattleCore;

const { player, wild } = startWild(pmz, 'rattata', 12);

const tmb = makeMoveEntry(pmz, 'thunderbolt');
const tackle = makeMoveEntry(pmz, 'tackle');

const res = core.executeMove(player, b._wildPokemon, tmb);
console.log('executeMove(thunderbolt) ->', res.msg, 'dmg=' + (res.damage || 0));
const res2 = core.executeMove(b._wildPokemon, player, tackle);
console.log('executeMove(tackle)     ->', res2.msg, 'dmg=' + (res2.damage || 0));

const queue = core.buildActionQueue({
    player: player, enemy: b._wildPokemon, isDouble: false,
    playerAction: tmb, playerTarget: b._wildPokemon,
    enemyAction: { move: tackle, target: player }
});
console.log('queue ->', queue.map(a => (a.isPlayer ? 'P' : 'E') + ':' + a.move.key).join(', '));

const flee = core.computeFlee(player, b._wildPokemon);
console.log('flee  -> chance=' + flee.chance + ' success=' + flee.success);

const cap = pmz.PMZ.Battle.calcCapture(b._wildPokemon, 1);
console.log('capture -> rate=' + cap.rate + ' shakes=' + cap.shakes + ' captured=' + cap.captured);

console.log('wild moves ->', wild.moves.map(m => m.name).join(', '));

console.log('SMOKE OK');