//=============================================================================
// PMZ_GamePokemon.js
// FASE 3: Game_Pokemon — objeto Pokémon real (clase con métodos)
//
// - PMZ.Pokemon.create delega en esta clase (misma serialización de datos)
// - Métodos de instancia: calculateStats, assignMoves, heal, gainExp, etc.
// - PMZ.Pokemon.* (namespace) queda como delegados de 1 línea en PMZ_Core
// - Saves viejos (objetos planos) se rehidratan con Object.setPrototypeOf
//=============================================================================

/*:
 * @plugindesc v1.0 PMZ Game_Pokemon — objeto Pokémon real (FASE 3)
 * @author PMZ
 * @help
 * Clase Game_Pokemon: encapsula el estado y el comportamiento de un Pokémon.
 * Compatible con saves existentes (rehidratación automática en load).
 */

var PMZ = PMZ || {};

//=============================================================================
// Game_Pokemon
//=============================================================================

function Game_Pokemon(speciesKey, level) {
    this.initialize(speciesKey, level);
}

Game_Pokemon.prototype.initialize = function(speciesKey, level) {
    level = level || 5;
    var base = PMZ.Data.pokemon(speciesKey);
    if (!base) return;

    this.id = base.id;
    this.species = speciesKey.toLowerCase();
    this.name = base.name;
    this.types = base.types.slice();
    this.level = level;
    this.hp = 0; this.maxHp = 0;
    this.attack = 0; this.defense = 0;
    this.spAttack = 0; this.spDefense = 0;
    this.speed = 0;
    this.moves = [];
    this.exp = 0; this.expToNext = 0;
    this.status = null;
    this.currentHp = 0;
    this.ivs = this.generateIVs();
    this.evs = { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 };
    this.nature = this.randomNature();
    this.catchRate = base.catchRate || 45;
    this.gender = this.getGender();
    this.shiny = false;
    this.happiness = 70;
    this.heldItems = [];

    this.calculateStats();
    this.assignMoves();

    this.currentHp = this.maxHp;
    this.exp = this.calcExp(level, base.expRate);
    this.expToNext = this.calcExp(level + 1, base.expRate) - this.exp;
};

// ----------------------------------------------------------------------------
// Stats y naturaleza
// ----------------------------------------------------------------------------

Game_Pokemon.prototype.generateIVs = function() {
    var ivs = {};
    ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'].forEach(function(s) {
        ivs[s] = Math.floor(Math.random() * 32);
    });
    return ivs;
};

Game_Pokemon.prototype.randomNature = function() {
    var data = PMZ.Data.natures();
    var names = data ? Object.keys(data) : [];
    if (names.length === 0) return 'hardy';
    return names[Math.floor(Math.random() * names.length)];
};

Game_Pokemon.natureModifier = function(nature, stat) {
    var data = PMZ.Data.natures();
    var mods = (data && (data[nature] || data['hardy'])) || { up: null, down: null };
    if (mods.up === stat) return 1.1;
    if (mods.down === stat) return 0.9;
    return 1.0;
};

Game_Pokemon.prototype.natureModifier = function(stat) {
    return Game_Pokemon.natureModifier(this.nature, stat);
};

Game_Pokemon.natureUpDown = function(nature) {
    var data = PMZ.Data.natures();
    var mods = (data && (data[nature] || data['hardy'])) || { up: null, down: null };
    return { up: mods.up, down: mods.down };
};

Game_Pokemon.prototype.natureUpDown = function() {
    return Game_Pokemon.natureUpDown(this.nature);
};

Game_Pokemon.getGender = function(species) {
    var base = PMZ.Data.pokemon(species);
    var ratio = base ? base.genderRatio : undefined;
    if (ratio === undefined) ratio = 50;
    if (ratio === null) return 'genderless';
    if (ratio === 0) return 'female';
    if (ratio === 100) return 'male';
    return Math.random() * 100 < ratio ? 'male' : 'female';
};

Game_Pokemon.prototype.getGender = function() {
    return Game_Pokemon.getGender(this.species);
};

// ----------------------------------------------------------------------------
// Stats
// ----------------------------------------------------------------------------

Game_Pokemon.prototype.calculateStats = function(base) {
    base = base || PMZ.Data.pokemon(this.species);
    if (!base) return;
    var stats = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];

    stats.forEach(function(stat) {
        var baseVal = base.baseStats[stat] || 50;
        var iv = this.ivs[stat] || 0;
        var ev = this.evs[stat] || 0;
        var natureMult = (stat === 'hp') ? 1.0 : this.natureModifier(stat);

        if (stat === 'hp') {
            this[stat] = Math.floor(((2 * baseVal + iv + Math.floor(ev / 4)) * this.level / 100) + this.level + 10);
        } else {
            this[stat] = Math.max(1, Math.floor((Math.floor(((2 * baseVal + iv + Math.floor(ev / 4)) * this.level / 100) + 5)) * natureMult));
        }
    }, this);

    this.maxHp = this.hp;
};

// ----------------------------------------------------------------------------
// Moves
// ----------------------------------------------------------------------------

Game_Pokemon.prototype.assignMoves = function(base) {
    base = base || PMZ.Data.pokemon(this.species);
    if (!base) return;
    var limit = Game_Pokemon.moveLimit();
    var moves = base.moves || {};

    if (typeof moves === 'object' && !Array.isArray(moves)) {
        var learned = [];

        for (var lvl in moves) {
            if (moves.hasOwnProperty(lvl) && parseInt(lvl) <= this.level) {
                var moveNames = Array.isArray(moves[lvl]) ? moves[lvl] : [moves[lvl]];
                moveNames.forEach(function(mn) {
                    learned.push({ level: parseInt(lvl), name: mn });
                });
            }
        }

        learned.sort(function(a, b) { return a.level - b.level; });

        var take = learned.slice(-limit);
        take.forEach(function(m) {
            var md = PMZ.Data.move(m.name);
            if (md) {
                var alreadyHas = false;
                for (var j = 0; j < this.moves.length; j++) {
                    if (this.moves[j].key === m.name.toLowerCase()) { alreadyHas = true; break; }
                }
                if (!alreadyHas) {
                    this.moves.push({
                        key: m.name.toLowerCase(),
                        name: md.name,
                        pp: md.pp || 5,
                        maxPp: md.pp || 5,
                        power: md.power || 0,
                        type: md.type || 'normal',
                        category: md.category || 'physical',
                        accuracy: md.accuracy !== undefined ? md.accuracy : 100,
                        neverMiss: !!md.neverMiss,
                        effect: md.effect || 'none'
                    });
                }
            }
        }, this);
    } else if (Array.isArray(moves)) {
        var limit2 = Math.min(limit, moves.length);
        for (var i = 0; i < limit2; i++) {
            var md2 = PMZ.Data.move(moves[i]);
            if (md2) {
                var alreadyHas2 = false;
                for (var j2 = 0; j2 < this.moves.length; j2++) {
                    if (this.moves[j2].key === moves[i].toLowerCase()) { alreadyHas2 = true; break; }
                }
                if (!alreadyHas2) {
                    this.moves.push({
                        key: moves[i].toLowerCase(),
                        name: md2.name,
                        pp: md2.pp || 5,
                        maxPp: md2.pp || 5,
                        power: md2.power || 0,
                        type: md2.type || 'normal',
                        category: md2.category || 'physical',
                        accuracy: md2.accuracy !== undefined ? md2.accuracy : 100,
                        neverMiss: !!md2.neverMiss,
                        effect: md2.effect || 'none'
                    });
                }
            }
        }
    }
};

Game_Pokemon.prototype.canLearn = function(moveKey) {
    if (!this.species || !moveKey) return false;
    var base = PMZ.Data.pokemon(this.species);
    if (!base) return false;
    if (this.moves) {
        for (var i = 0; i < this.moves.length; i++) {
            if (this.moves[i].name === moveKey || this.moves[i].key === moveKey) return false;
        }
    }
    if (base.moves) {
        for (var lvl in base.moves) {
            if (!base.moves.hasOwnProperty(lvl)) continue;
            var list = base.moves[lvl];
            if (Array.isArray(list)) {
                if (list.indexOf(moveKey) >= 0) return true;
            } else if (list === moveKey) {
                return true;
            }
        }
    }
    if (base.eggMoves && base.eggMoves.indexOf(moveKey) >= 0) return true;
    if (base.tmMoves && base.tmMoves.length > 0) {
        if (base.tmMoves.indexOf('*') >= 0) return true;
        if (base.tmMoves.indexOf(moveKey) >= 0) return true;
        return false;
    }
    var moveData = PMZ.Data.move(moveKey);
    if (moveData && moveData.type) {
        if (this.types && this.types.indexOf(moveData.type) >= 0) return true;
    }
    return true;
};

Game_Pokemon.prototype._pushMove = function(moveKey, moveData) {
    var md = moveData || PMZ.Data.move(moveKey);
    this.moves.push({
        name: moveKey,
        key: moveKey,
        pp: md.pp || 10,
        maxPp: md.pp || 10,
        id: md.id,
        type: md.type,
        power: md.power,
        accuracy: md.accuracy !== undefined ? md.accuracy : 100,
        neverMiss: !!md.neverMiss,
        category: md.category,
        effect: md.effect,
        recoil: md.recoil,
        isSound: md.isSound,
        isPunch: md.isPunch,
        drainRatio: md.drainRatio,
        priority: md.priority,
        description: md.description
    });
};

Game_Pokemon.prototype.teachMove = function(moveKey) {
    if (!this.species || !moveKey) return { success: false, msg: 'Invalid' };
    if (!this.canLearn(moveKey)) return { success: false, msg: this.name + ' no puede aprender este movimiento.' };
    var moveData = PMZ.Data.move(moveKey);
    if (!moveData) return { success: false, msg: 'Move not found' };
    var limit = Game_Pokemon.moveLimit();
    if (this.moves.length < limit) {
        this._pushMove(moveKey, moveData);
        return { success: true, learned: true, msg: this.name + ' aprendio ' + moveData.name + '!' };
    }
    $gameTemp._pmzMoveLearn = { pokemon: this, newMove: moveKey };
    return { success: true, learned: false, needReplace: true, msg: this.name + ' debe olvidar un movimiento para aprender ' + moveData.name };
};

Game_Pokemon.prototype.replaceMove = function(index, newMove) {
    if (index < 0 || index >= this.moves.length) return false;
    this.moves[index] = {
        key: newMove.key || newMove.name.toLowerCase().replace(/[^a-z]/g, ''),
        name: newMove.name,
        pp: newMove.pp || 5,
        maxPp: newMove.pp || 5,
        power: newMove.power || 0,
        type: newMove.type || 'normal',
        category: newMove.category || 'physical',
        accuracy: newMove.accuracy !== undefined ? newMove.accuracy : 100,
        neverMiss: !!newMove.neverMiss,
        effect: newMove.effect || 'none'
    };
    return true;
};

Game_Pokemon.prototype.learnNewMoves = function(base) {
    var learned = [];
    var pending = [];
    base = base || PMZ.Data.pokemon(this.species);
    if (!base) return { learned: learned, pending: pending };
    var moves = base.moves || {};
    if (typeof moves !== 'object' || Array.isArray(moves)) return { learned: learned, pending: pending };
    var limit = Game_Pokemon.moveLimit();
    for (var lvl in moves) {
        if (moves.hasOwnProperty(lvl) && parseInt(lvl) === this.level) {
            var moveNames = Array.isArray(moves[lvl]) ? moves[lvl] : [moves[lvl]];
            for (var i = 0; i < moveNames.length; i++) {
                var md = PMZ.Data.move(moveNames[i]);
                if (md) {
                    var alreadyHas = false;
                    for (var j = 0; j < this.moves.length; j++) {
                        if (this.moves[j].key === moveNames[i].toLowerCase()) { alreadyHas = true; break; }
                    }
                    if (!alreadyHas) {
                        var moveObj = {
                            key: moveNames[i].toLowerCase(),
                            name: md.name,
                            pp: md.pp || 5,
                            maxPp: md.pp || 5,
                            power: md.power || 0,
                            type: md.type || 'normal',
                            category: md.category || 'physical',
                            accuracy: md.accuracy !== undefined ? md.accuracy : 100,
                            neverMiss: !!md.neverMiss,
                            effect: md.effect || 'none'
                        };
                        if (this.moves.length < limit) {
                            this.moves.push(moveObj);
                            learned.push(md.name);
                        } else {
                            pending.push(moveObj);
                        }
                    }
                }
            }
        }
    }
    return { learned: learned, pending: pending };
};

Game_Pokemon.moveLimit = function() {
    return PMZ.Data.configValue('battleMovesLimit') || 4;
};

// ----------------------------------------------------------------------------
// Exp, EVs y curación
// ----------------------------------------------------------------------------

Game_Pokemon.prototype.calcExp = function(level, rate) {
    if (level <= 0) return 0;
    var lv3 = level * level * level;
    var lv2 = level * level;
    var rates = {
        'fast': Math.floor(4 * lv3 / 5),
        'medium': Math.floor(lv3),
        'slow': Math.floor(5 * lv3 / 4),
        'medium_slow': Math.floor(6 * lv3 / 5 - 15 * lv2 + 100 * level - 140),
        'erratic': 0,
        'fluctuating': 0
    };
    return rates[rate] || rates['medium'];
};

Game_Pokemon.prototype.heal = function() {
    this.currentHp = this.maxHp;
    this.status = null;
    if (this.moves) this.moves.forEach(function(m) { m.pp = m.maxPp; });
};

Game_Pokemon.prototype.isFainted = function() {
    return this.currentHp <= 0;
};

Game_Pokemon.prototype.gainEVs = function(defeatedSpecies) {
    var base = PMZ.Data.pokemon(defeatedSpecies);
    var yields = (base && base.evYields) || { speed: 1 };
    for (var stat in yields) {
        if (yields.hasOwnProperty(stat)) {
            this.evs[stat] = Math.min(255, (this.evs[stat] || 0) + yields[stat]);
        }
    }
    var totalEv = 0;
    for (var s in this.evs) { if (this.evs.hasOwnProperty(s)) totalEv += this.evs[s]; }
    if (totalEv > 510) {
        var factor = 510 / totalEv;
        for (var s2 in this.evs) { if (this.evs.hasOwnProperty(s2)) this.evs[s2] = Math.floor(this.evs[s2] * factor); }
    }
    this.calculateStats();
    if (PMZ.Config.isStatEvolution()) {
        var evo = PMZ.Evolution.checkAll(this);
        if (evo) {
            PMZ.Evolution.evolve(this, evo);
        }
    }
};

Game_Pokemon.prototype.gainExp = function(amount) {
    if (!this.species || this.isFainted()) return { leveled: false, evolved: false, newMoves: [], pendingMoves: [] };
    this.exp += amount;
    var result = { leveled: false, evolved: false, newMoves: [], pendingMoves: [] };
    var tries = 0;
    var base = PMZ.Data.pokemon(this.species);
    while (this.expToNext > 0 && this.exp >= this.expToNext && tries < 100) {
        tries++;
        this.exp -= this.expToNext;
        this.level++;
        result.leveled = true;
        if (base) {
            this.calculateStats();
            this.maxHp = this.hp;
            this.currentHp = Math.min(this.currentHp, this.maxHp);
            var expNext = this.calcExp(this.level + 1, base.expRate);
            var expCur = this.calcExp(this.level, base.expRate);
            this.expToNext = expNext - expCur;
            if (this.expToNext <= 0) this.expToNext = 100;
            var learnResult = this.learnNewMoves(base);
            if (learnResult.learned.length > 0) result.newMoves = result.newMoves.concat(learnResult.learned);
            if (learnResult.pending.length > 0) result.pendingMoves = result.pendingMoves.concat(learnResult.pending);
            var evo = PMZ.Evolution.checkAll(this);
            if (evo) {
                PMZ.Evolution.evolve(this, evo);
                base = PMZ.Data.pokemon(this.species);
                result.evolved = true;
                break;
            }
        }
    }
    return result;
};

// ----------------------------------------------------------------------------
// Rehidratación de saves (objetos planos → instancias)
// ----------------------------------------------------------------------------

Game_Pokemon.rehydrate = function(obj) {
    if (obj && typeof obj === 'object' && !(obj instanceof Game_Pokemon)) {
        Object.setPrototypeOf(obj, Game_Pokemon.prototype);
    }
    return obj;
};

Game_Pokemon.rehydrateAll = function(gamePMZ) {
    if (!gamePMZ || typeof Game_Pokemon === 'undefined') return;
    if (gamePMZ.party) {
        var party = gamePMZ.party();
        for (var i = 0; i < party.length; i++) Game_Pokemon.rehydrate(party[i]);
    }
    if (gamePMZ.boxes) {
        var boxes = gamePMZ.boxes();
        for (var b = 0; b < boxes.length; b++) {
            for (var s = 0; s < boxes[b].length; s++) Game_Pokemon.rehydrate(boxes[b][s]);
        }
    }
    if (gamePMZ.daycare) {
        var dc = gamePMZ.daycare();
        Game_Pokemon.rehydrate(dc.pokemon[0]);
        Game_Pokemon.rehydrate(dc.pokemon[1]);
        Game_Pokemon.rehydrate(dc.egg);
    }
};

// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Hook de load: rehidratar Pokémon tras cargar partida
// ----------------------------------------------------------------------------

if (typeof DataManager !== 'undefined') {
    (function() {
        var aliasExtract = DataManager.extractSaveContents;
        DataManager.extractSaveContents = function(contents) {
            aliasExtract.call(this, contents);
            if (typeof $gamePMZ !== 'undefined') {
                Game_Pokemon.rehydrateAll($gamePMZ);
            }
        };
    })();
}