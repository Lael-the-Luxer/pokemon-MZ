/*:
 * @plugindesc v1.0 PMZ BattleCore - Logica pura del motor de batalla (sin graficos)
 * @author PMZ
 * @help
 * Modulo de logica del motor de batalla, separado de la escena grafica
 * (Scene_PMZ_Battle). Toda funcion aqui es pura o opera sobre estado de
 * PMZ.Battle, sin tocar windows, sprites ni SceneManager.
 *
 * Cubre: construccion de cola de turnos, resolucion de ataques, efectos
 * de fin de turno (clima, drenaje, ataduras, bide), captura, huida,
 * distribucion de EXP y recompensas de entrenador.
 *
 * Cargar DESPUES de PMZ_Core y PMZ_GamePokemon, ANTES de PMZ_Battle.
 */

var PMZ = PMZ || {};

PMZ.BattleCore = PMZ.BattleCore || {

    // Ultimo dano registrado por executeMove (usado por counter/mirrorcoat)
    _lastDamageTaken: 0,

    // Turnos de sueno (los efectos como Rest escriben aqui; PMZ.Status.tick
    // lee PMZ.Status._sleepTurns, por lo que esta tabla es solo informativa)
    _sleepTurns: {},

    // Confusion autoinfligida por efectos type self_status (outrage, thrash, etc.)
    _confusedUser: {},

    // ==========================================================================
    // Cola de turnos (doble batalla + orden por velocidad)
    // ==========================================================================
    // acts: { player, player2, enemy, enemy2, isDouble,
    //         playerAction, playerTarget, playerAction2, playerTarget2,
    //         enemyAction, enemyAction2 }
    // Devuelve la cola ordenada: [{ attacker, target, move, isPlayer, slot, _speed, quickClaw }]
    buildActionQueue: function(acts) {
        var queue = [];
        if (!acts) return queue;
        var pp = acts.player, pp2 = acts.player2;
        var wp = acts.enemy, wp2 = acts.enemy2;
        var isDouble = acts.isDouble;

        if (pp && acts.playerAction && !acts.playerAction._mechanic) {
            queue.push({ attacker: pp, target: acts.playerTarget || wp, move: acts.playerAction, isPlayer: true, slot: 1 });
        }
        if (isDouble && pp2 && acts.playerAction2 && !acts.playerAction2._mechanic) {
            queue.push({ attacker: pp2, target: acts.playerTarget2 || wp2 || wp, move: acts.playerAction2, isPlayer: true, slot: 2 });
        }
        if (wp && acts.enemyAction) {
            queue.push({ attacker: wp, target: acts.enemyAction.target || pp, move: acts.enemyAction.move, isPlayer: false, slot: 1 });
        }
        if (isDouble && wp2 && acts.enemyAction2) {
            queue.push({ attacker: wp2, target: acts.enemyAction2.target || pp2 || pp, move: acts.enemyAction2.move, isPlayer: false, slot: 2 });
        }

        // Quick Claw: 20% de probabilidad (o la de items.json) de atacar primero
        for (var qi = 0; qi < queue.length; qi++) {
            if (PMZ.HoldItems.hasItem(queue[qi].attacker, 'quickclaw')) {
                var ch = (PMZ.Data.item('quickclaw') || {}).chance || 0.2;
                if (Math.random() < ch) queue[qi].quickClaw = true;
            }
        }

        // Ordenar por velocidad (desc). Quick Claw va primero; empate -> jugador.
        queue.forEach(function(q) {
            q._speed = Math.floor(q.attacker.speed * PMZ.Status.speedMod(q.attacker) *
                PMZ.HoldItems.speedMultiplier(q.attacker) * PMZ.Abilities.weatherSpeedMult(q.attacker));
        });
        queue.sort(function(a, b) {
            if (a.quickClaw && !b.quickClaw) return -1;
            if (b.quickClaw && !a.quickClaw) return 1;
            if (a._speed !== b._speed) return b._speed - a._speed;
            if (a.isPlayer && !b.isPlayer) return -1;
            if (!a.isPlayer && b.isPlayer) return 1;
            return 0;
        });

        return queue;
    },

    // ==========================================================================
    // Acciones de IA enemigas (selecciona movimiento y objetivo)
    // ==========================================================================
    chooseEnemyActions: function() {
        var b = PMZ.Battle;
        var out = { enemyAction: null, enemyAction2: null };
        var wp = b._wildPokemon, wp2 = b._wildPokemon2;
        var pp = b._playerPokemon, pp2 = b._playerPokemon2;

        if (wp) {
            var target = pp;
            if (PMZ.Pokemon.isFainted(pp) && pp2 && !PMZ.Pokemon.isFainted(pp2)) target = pp2;
            out.enemyAction = { move: PMZ.AI.chooseMove(wp, target, wp.moves), target: target };
        }
        if (wp2) {
            var target2 = pp2 || pp;
            if (PMZ.Pokemon.isFainted(target2) && pp && !PMZ.Pokemon.isFainted(pp)) target2 = pp;
            out.enemyAction2 = { move: PMZ.AI.chooseMove(wp2, target2, wp2.moves), target: target2 };
        }
        return out;
    },

    // ==========================================================================
    // Resolucion de un ataque (golpe, dano, efectos, objetos)
    // ==========================================================================
    // opts.verbose: mensajes de efectividad de tipos (true = jugador)
    // opts.skipAccuracyIfStatus: no checkear precision en moves de estado (true = enemigo)
    // Devuelve: { protected, hit, miss, ohkoFailed, damage, msg, typeEff,
    //            surviveKO, flinched, lastDamageTaken }
    executeMove: function(attacker, target, moveData, opts) {
        var b = PMZ.Battle;
        opts = opts || {};
        var res = {
            protected: false, hit: false, miss: false, ohkoFailed: false,
            damage: 0, msg: '', typeEff: 1, surviveKO: false, flinched: false,
            lastDamageTaken: 0
        };
        if (!moveData || !target || PMZ.Pokemon.isFainted(target)) return res;

        // Protect (solo el jugador lo evalua al atacar; el enemigo no)
        if (opts.checkProtect !== false) {
            var tId = target._battleId;
            if (b._protect && b._protect[tId] && b._protect[tId].success) {
                res.protected = true;
                res.msg = 'Protegio!';
                b._protect[tId].turns--;
                if (b._protect[tId].turns <= 0) delete b._protect[tId];
                this.applyMoveEffects(attacker, target, moveData, 0);
                return res;
            }
        }

        // Chequeo de precision (los movimientos de estado enemigos no fallan)
        var isStatus = moveData.category === 'status';
        if (!(opts.skipAccuracyIfStatus && isStatus) && !b.checkHit(attacker, target, moveData)) {
            res.miss = true;
            res.msg = attacker.name + ' fallo el ataque!';
            return res;
        }

        res.hit = true;

        // Dano via EffectRegistry (fixed_damage, psywave, ohko)
        var damage = PMZ.Effects.computeDamage(moveData.effect, attacker, target);
        if (damage === null) {
            damage = b.calcDamage(attacker, target, moveData);
        } else if (damage === -1) {
            res.ohkoFailed = true;
            damage = 0;
        }
        res.damage = damage;

        if (res.ohkoFailed) {
            res.msg = 'Fallo!';
        } else if (damage > 0) {
            var wasFullHp = target.currentHp >= target.maxHp;
            target.currentHp = Math.max(0, target.currentHp - damage);
            res.typeEff = b.typeEffectiveness(moveData.type, target.types);
            if (opts.verbose === true) {
                if (res.typeEff === 0) {
                    res.msg = 'No afecta a ' + target.name + '...';
                } else if (res.typeEff > 1) {
                    res.msg = 'Es muy efectivo!';
                } else if (res.typeEff < 1) {
                    res.msg = 'No es muy efectivo...';
                } else {
                    res.msg = target.name + ' recibio ' + damage + ' de dano!';
                }
            } else {
                res.msg = target.name + ' recibio ' + damage + ' de dano!';
            }
            // Focus Band / Sturdy: sobrevivir al golpe de KO
            if (target.currentHp <= 0 && PMZ.HoldItems.surviveKO(target)) {
                res.surviveKO = true;
                res.msg = target.name + ' aguanto gracias a su objeto!';
            }
            if (target.currentHp <= 0 && PMZ.Abilities.preventKO(target, wasFullHp)) {
                res.surviveKO = true;
                res.msg = target.name + ' aguanto gracias a Sturdy!';
            }
        } else {
            // Movimiento de estado sin efecto: mensaje vacio (la escena lo
            // sustituye por su texto propio). Movimiento de dano -> 'No afecta'
            if (!(opts.skipAccuracyIfStatus && isStatus)) {
                res.msg = 'No afecta a ' + target.name + '...';
            }
        }

        // Efectos del movimiento (estado, stats, sustituto, bide, etc.)
        var effMsg = this.applyMoveEffects(attacker, target, moveData, damage);
        if (effMsg) res.msg = effMsg;

        // King's Rock / Razor Fang: flinch al golpear
        if (target.currentHp > 0 && PMZ.HoldItems.tryFlinchOnHit(attacker)) {
            if (!PMZ.Pokemon.isFainted(target)) {
                PMZ.Status.setFlinch(target);
                res.flinched = true;
            }
        }

        // Recoil de Life Orb
        PMZ.HoldItems.afterAttack(attacker);

        // Registro de dano para counter/mirrorcoat (el enemigo lo resetea a 0)
        if (opts.trackLastDamage === false) {
            this._lastDamageTaken = 0;
        } else {
            this._lastDamageTaken = damage;
        }
        res.lastDamageTaken = this._lastDamageTaken;
        return res;
    },

    // ==========================================================================
    // Efectos de movimiento (estados, stats, sustituto, pantallas, bide)
    // ==========================================================================
    applyMoveEffects: function(attacker, defender, moveData, damage) {
        if (!moveData || !defender || PMZ.Pokemon.isFainted(defender)) return '';
        var b = PMZ.Battle;
        var id = function(pk) { return pk._battleId; };
        var msg = '';

        // Registrar ultimo movimiento usado (para disable/mimic)
        b._lastMoveUsed[id(attacker)] = moveData.key;

        // Dispatch via EffectRegistry (b = BattleCore para counter/mirrorcoat)
        msg = PMZ.Effects.run(moveData.effect, attacker, defender, moveData, damage, this);

        // Sustituto: absorbe el dano (universal)
        if (damage > 0 && b._substitute && b._substitute[id(defender)] > 0) {
            b._substitute[id(defender)] = Math.max(0, b._substitute[id(defender)] - damage);
            if (b._substitute[id(defender)] <= 0) {
                msg = (msg ? msg + ' ' : '') + 'El sustituto de ' + defender.name + ' se rompio!';
            } else {
                msg = (msg ? msg + ' ' : '') + 'El sustituto absorbe el dano!';
            }
        }

        // Mist guard (universal)
        if (defender._guardSpec > 0) defender._guardSpec--;
        var mistSide = defender === b._playerPokemon ? 'player' : 'enemy';
        if (b._mist[mistSide] > 0) b._mist[mistSide]--;

        // Acumulacion de dano de Bide (universal)
        if (damage > 0 && b._bide && b._bide[id(defender)]) {
            b._bide[id(defender)].damage += damage;
        }

        return msg || '';
    },

    // ==========================================================================
    // Autogolpe por confusion (33% del maxHp/10)
    // ==========================================================================
    checkConfusionHit: function(pokemon) {
        if (!pokemon || pokemon.status !== 'confusion') return false;
        if (Math.random() < 0.33) {
            var dmg = Math.max(1, Math.floor(pokemon.maxHp * 0.1));
            pokemon.currentHp = Math.max(0, pokemon.currentHp - dmg);
            return dmg;
        }
        return false;
    },

    // ==========================================================================
    // Huida: chance segun velocidad / 128 + 30 (formula Pokemon)
    // ==========================================================================
    computeFlee: function(player, wild) {
        var playerSpeed = player ? Math.floor(player.speed * PMZ.Status.speedMod(player) *
            PMZ.HoldItems.speedMultiplier(player) * PMZ.Abilities.weatherSpeedMult(player)) : 1;
        var wildSpeed = wild ? Math.floor(wild.speed * PMZ.Status.speedMod(wild) *
            PMZ.HoldItems.speedMultiplier(wild) * PMZ.Abilities.weatherSpeedMult(wild)) : 1;
        var chance = Math.floor((playerSpeed * 128) / Math.max(1, wildSpeed) + 30);
        return {
            playerSpeed: playerSpeed,
            wildSpeed: wildSpeed,
            chance: chance,
            success: Math.random() * 256 < chance
        };
    },

    // ==========================================================================
    // Captura
    // ==========================================================================
    // Calcula el resultado (inicia la animacion). Escena usa result.shakes
    // para animar y result.captured para decidir.
    beginCapture: function(itemData, wild) {
        return PMZ.Battle.calcCapture(wild, itemData.captureRate || 1);
    },

    // Registra la captura (pokedex, equipo/PC, resultado de batalla).
    // Devuelve 'party' | 'pc'.
    registerCaptured: function(pokemon) {
        if (!pokemon) return null;
        PMZ.Pokedex.registerCaught(pokemon.species);
        var dest;
        if (!PMZ.Party.add(pokemon)) {
            PMZ.PC.deposit(pokemon);
            dest = 'pc';
        } else {
            dest = 'party';
        }
        PMZ.Battle.setResultOutcome('caught', {
            capturedSpecies: pokemon.species,
            species: PMZ.Battle._battleInitialSpecies
        });
        return dest;
    },

    // ==========================================================================
    // Estado del combate (veredictos fin de turno)
    // ==========================================================================
    allPokemonList: function() {
        var b = PMZ.Battle;
        var list = [];
        if (b._playerPokemon) list.push(b._playerPokemon);
        if (b._playerPokemon2) list.push(b._playerPokemon2);
        if (b._wildPokemon) list.push(b._wildPokemon);
        if (b._wildPokemon2) list.push(b._wildPokemon2);
        return list;
    },

    allEnemiesFainted: function() {
        var wp = PMZ.Battle._wildPokemon;
        var wp2 = PMZ.Battle._wildPokemon2;
        if (wp && !PMZ.Pokemon.isFainted(wp)) return false;
        if (PMZ.Battle._doubleBattle && wp2 && !PMZ.Pokemon.isFainted(wp2)) return false;
        return true;
    },

    // Veredicto tras efectos de fin de turno:
    // 'trainerSendOut' | 'victory' | 'defeat' | 'playerCommand'
    resolveEndTurn: function() {
        var b = PMZ.Battle;
        var pl1 = b._playerPokemon, pl2 = b._playerPokemon2;
        var pl1F = pl1 ? PMZ.Pokemon.isFainted(pl1) : true;
        var pl2F = pl2 ? PMZ.Pokemon.isFainted(pl2) : true;

        if (this.allEnemiesFainted()) {
            return b.isTrainerBattle() ? 'trainerSendOut' : 'victory';
        }
        if (pl1F) return 'defeat';
        if (pl2F && pl2 && pl1F) return 'defeat';
        return 'playerCommand';
    },

    // Resolucion de derrota / reemplazo de Pokemon del jugador.
    // Devuelve { defeated } o { defeated:false, next }.
    resolveDefeat: function() {
        if (PMZ.Party.allFainted()) return { defeated: true };
        var aliveIndex = PMZ.Party.firstAliveIndex();
        if (aliveIndex >= 0) {
            PMZ.Battle._activePlayerIndex = aliveIndex;
            PMZ.Battle._playerPokemon = PMZ.Party.get(aliveIndex);
            PMZ.Battle.addParticipant(PMZ.Battle._playerPokemon);
            return { defeated: false, next: PMZ.Battle._playerPokemon };
        }
        return { defeated: true };
    },

    // ==========================================================================
    // Efectos de fin de turno (clima, drenaje, ataduras, bide)
    // Cada uno devuelve el mensaje a mostrar (o '').
    // ==========================================================================
    weatherDamage: function(allPoke) {
        if (!PMZ.Weather || PMZ.Weather._weather === 'none') return '';
        var w = PMZ.Weather._weather;
        var msg = '';
        if (!allPoke) allPoke = this.allPokemonList();
        if (w === 'sandstorm' || w === 'hail') {
            var types = w === 'sandstorm' ? ['rock', 'ground', 'steel'] : ['ice'];
            for (var i = 0; i < allPoke.length; i++) {
                var p = allPoke[i];
                if (!p || PMZ.Pokemon.isFainted(p)) continue;
                if (PMZ.Abilities && PMZ.Abilities.cloudNine(p)) continue;
                if (PMZ.Abilities && PMZ.Abilities.immuneIndirect(p)) continue;
                var hasGoggles = false;
                if (p.heldItems) {
                    for (var g = 0; g < p.heldItems.length; g++) {
                        if (PMZ.HoldItems._itemEffect && PMZ.HoldItems._itemEffect(p.heldItems[g]) === 'safety_goggles') {
                            hasGoggles = true; break;
                        }
                    }
                }
                if (hasGoggles) continue;
                var immune = false;
                for (var j = 0; j < p.types.length; j++) {
                    if (types.indexOf(p.types[j]) >= 0) { immune = true; break; }
                }
                if (PMZ.Abilities.hasEffect(p, 'overcoat')) immune = true;
                if (!immune) {
                    var pDmg = Math.max(1, Math.floor(p.maxHp * 1 / 16));
                    p.currentHp = Math.max(0, p.currentHp - pDmg);
                    msg += p.name + ' recibe dano de la ' +
                        (w === 'sandstorm' ? 'tormenta de arena' : 'granizo') + '! ';
                }
            }
        }
        return msg;
    },

    leechSeed: function(allPoke) {
        var msg = '';
        var b = PMZ.Battle;
        if (!allPoke) allPoke = this.allPokemonList();

        var pokeById = {};
        for (var pi = 0; pi < allPoke.length; pi++) {
            pokeById[allPoke[pi]._battleId] = allPoke[pi];
        }

        for (var i = 0; i < allPoke.length; i++) {
            var p = allPoke[i];
            if (PMZ.Pokemon.isFainted(p)) continue;
            if (PMZ.Abilities && PMZ.Abilities.immuneIndirect(p)) {
                delete b._leechSeed[p._battleId];
                continue;
            }
            var attackerId = b._leechSeed[p._battleId];
            if (!attackerId) continue;
            var dmg = Math.max(1, Math.floor(p.maxHp * 0.125));
            p.currentHp = Math.max(0, p.currentHp - dmg);
            var attacker = pokeById[attackerId];
            if (attacker && !PMZ.Pokemon.isFainted(attacker)) {
                attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + dmg);
            }
            msg += p.name + ' pierde PS por Semilla! ';
        }
        for (var k = 0; k < allPoke.length; k++) {
            if (PMZ.Pokemon.isFainted(allPoke[k])) delete b._leechSeed[allPoke[k]._battleId];
        }
        return msg;
    },

    bindDamage: function(allPoke) {
        var msg = '';
        var b = PMZ.Battle;
        if (!allPoke) allPoke = this.allPokemonList();

        for (var i = 0; i < allPoke.length; i++) {
            var p = allPoke[i];
            if (PMZ.Pokemon.isFainted(p)) continue;
            if (PMZ.Abilities && PMZ.Abilities.immuneIndirect(p)) {
                delete b._bind[p._battleId];
                continue;
            }
            var bindData = b._bind[p._battleId];
            if (!bindData) continue;
            var dmg = Math.max(1, Math.floor(p.maxHp * 0.0625));
            p.currentHp = Math.max(0, p.currentHp - dmg);
            bindData.turns--;
            if (bindData.turns <= 0) {
                delete b._bind[p._battleId];
                msg += p.name + ' se libero! ';
            } else {
                msg += p.name + ' esta atrapado! ';
            }
        }
        return msg;
    },

    bide: function(allPoke) {
        var msg = '';
        var b = PMZ.Battle;
        if (!allPoke) allPoke = this.allPokemonList();

        for (var i = 0; i < allPoke.length; i++) {
            var p = allPoke[i];
            if (PMZ.Pokemon.isFainted(p)) continue;
            var bideData = b._bide[p._battleId];
            if (!bideData) continue;
            bideData.turns--;
            if (bideData.turns <= 0) {
                var releaseDmg = Math.max(1, bideData.damage * 2);
                var opponents = allPoke.filter(function(op) {
                    return op !== p && !PMZ.Pokemon.isFainted(op);
                });
                if (opponents.length > 0) {
                    var target = opponents[Math.floor(Math.random() * opponents.length)];
                    target.currentHp = Math.max(0, target.currentHp - releaseDmg);
                    msg += p.name + ' libera energia acumulada! ' +
                        target.name + ' recibe ' + releaseDmg + ' de dano! ';
                }
                delete b._bide[p._battleId];
            }
        }
        return msg;
    },

    // ==========================================================================
    // EXP de victoria (participantes vivos, killer 1.0x, resto 0.5x)
    // Devuelve { expResults, pendingMoveLearns, msg }
    // ==========================================================================
    distributeVictoryExp: function() {
        var b = PMZ.Battle;
        var wild = b._wildPokemon;
        var killer = b._playerPokemon;
        var out = { expResults: [], pendingMoveLearns: [], msg: '' };
        if (!wild) return out;

        var participants = b.getParticipants();
        var alive = [];
        for (var pi = 0; pi < participants.length; pi++) {
            if (!PMZ.Pokemon.isFainted(participants[pi])) alive.push(participants[pi]);
        }
        if (b._doubleBattle && b._playerPokemon2 && !PMZ.Pokemon.isFainted(b._playerPokemon2)) {
            if (alive.indexOf(b._playerPokemon2) < 0) alive.push(b._playerPokemon2);
        }
        if (alive.length === 0 || !killer) return out;

        var baseExp = Math.floor((wild.exp || 100) / 7) || 10;
        var expResults = [];
        for (var ai = 0; ai < alive.length; ai++) {
            var pm = alive[ai];
            var share = (pm === killer) ? 1.0 : 0.5;
            var amount = Math.max(1, Math.floor(baseExp * share));
            var result = PMZ.Pokemon.gainExp(pm, amount);
            if (pm === killer) PMZ.Pokemon.gainEVs(pm, wild.species);
            expResults.push({ pokemon: pm, amount: amount, result: result, isKiller: (pm === killer) });
        }
        out.expResults = expResults;

        var msg = '';
        for (var mi = 0; mi < expResults.length; mi++) {
            var er = expResults[mi];
            if (mi > 0) msg += ' ';
            msg += er.pokemon.name + ' gano ' + er.amount + ' EXP!';
            if (er.result.leveled) msg += ' Subio a Lv' + er.pokemon.level + '!';
            if (er.result.evolved) msg += ' Evoluciono!';
        }
        out.msg = msg;

        // Movimientos pendientes de aprender (secuenciales, con reemplazo)
        for (var qi = 0; qi < expResults.length; qi++) {
            var er2 = expResults[qi];
            if (er2.result.pendingMoves && er2.result.pendingMoves.length > 0) {
                for (var nj = 0; nj < er2.result.pendingMoves.length; nj++) {
                    out.pendingMoveLearns.push({ pokemon: er2.pokemon, newMove: er2.result.pendingMoves[nj] });
                }
            }
        }
        return out;
    },

    // ==========================================================================
    // Recompensas de entrenador (dinero + medalla). Aplica los efectos.
    // Devuelve { money, badge, badgeName }
    // ==========================================================================
    trainerVictoryRewards: function() {
        var tData = PMZ.Battle._enemyTrainer;
        if (!tData) return { money: 0, badge: null, badgeName: null };
        var money = tData.money || 0;
        if ($gamePMZ) $gamePMZ.addMoney(money);
        var badge = (tData.badge && $gamePMZ && !$gamePMZ.hasBadge(tData.badge)) ? tData.badge : null;
        var badgeName = badge;
        if (badge) {
            var badgeData = PMZ.Data.badges();
            if (badgeData && badgeData.badges) {
                for (var bi = 0; bi < badgeData.badges.length; bi++) {
                    if (badgeData.badges[bi].key === badge) {
                        badgeName = badgeData.badges[bi].name;
                        break;
                    }
                }
            }
            $gamePMZ.giveBadge(badge);
        }
        return { money: money, badge: badge, badgeName: badgeName };
    }
};

if (typeof PluginManager !== 'undefined') {
    PluginManager.registerCommand('PMZ_BattleCore', '_noop', function() {});
}

console.log('[PMZ] Plugin loaded: PMZ_BattleCore v1.0');