//=============================================================================
// PMZ_Battle.js
// Pokemon MZ Essential - Battle & Capture System v0.1.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Pokemon MZ Essential - Battle & Capture System
 * @author PMZ Team
 * @url
 * @help
 * ============================================================================
 * PMZ Battle - Sistema de combate y captura Pokemon.
 * Dependencia: PMZ_Core.js
 * ============================================================================
 * 
 * @command startBattle
 * @text Start Battle
 * @desc Inicia un combate Pokemon. Activa switches al finalizar.
 * @arg species
 * @text Wild Species
 * @desc Especie del Pokemon salvaje
 * @type string
 * @default pikachu
 * @arg level
 * @text Level
 * @desc Nivel del Pokemon salvaje
 * @type number
 * @default 10
 * @arg winSwitch
 * @text Win Switch
 * @desc Switch ON si ganas. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg loseSwitch
 * @text Lose Switch
 * @desc Switch ON si pierdes. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg fleeSwitch
 * @text Flee Switch
 * @desc Switch ON si huyes. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg catchSwitch
 * @text Catch Switch
 * @desc Switch ON si capturas. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg defeatSwitch
 * @text Defeat Switch
 * @desc Switch ON si derrotas a la especie objetivo. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg defeatTarget
 * @text Defeat Target
 * @desc Especie objetivo (e.g. mewtwo). Vacio = deshabilitado.
 * @type string
 * @default
 *
 * @command startDoubleWild
 * @text Start Double Wild Battle
 * @desc Inicia combate doble contra dos Pokemon salvajes. Activa switches al finalizar.
 * @arg species1
 * @text Species 1
 * @desc Primera especie
 * @type string
 * @default zubat
 * @arg level1
 * @text Level 1
 * @desc Nivel de la primera especie
 * @type number
 * @default 10
 * @arg species2
 * @text Species 2
 * @desc Segunda especie
 * @type string
 * @default geodude
 * @arg level2
 * @text Level 2
 * @desc Nivel de la segunda especie
 * @type number
 * @default 10
 * @arg winSwitch
 * @text Win Switch
 * @desc Switch ON si ganas. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg loseSwitch
 * @text Lose Switch
 * @desc Switch ON si pierdes. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg fleeSwitch
 * @text Flee Switch
 * @desc Switch ON si huyes. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg catchSwitch
 * @text Catch Switch
 * @desc Switch ON si capturas. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg defeatSwitch
 * @text Defeat Switch
 * @desc Switch ON si derrotas a la especie objetivo. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg defeatTarget
 * @text Defeat Target
 * @desc Especie objetivo (e.g. zubat). Vacio = deshabilitado.
 * @type string
 * @default
 *
 * @command startTrainer
 * @text Start Trainer Battle
 * @desc Inicia combate contra un entrenador. Activa switches al finalizar.
 * @arg trainer
 * @text Trainer Key
 * @desc Key del entrenador en trainers.json
 * @type string
 * @default youngster
 * @arg winSwitch
 * @text Win Switch
 * @desc Switch ON si ganas. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg loseSwitch
 * @text Lose Switch
 * @desc Switch ON si pierdes. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg fleeSwitch
 * @text Flee Switch
 * @desc Switch ON si huyes. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg catchSwitch
 * @text Catch Switch
 * @desc Switch ON si capturas. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg defeatSwitch
 * @text Defeat Switch
 * @desc Switch ON si derrotas a la especie objetivo. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg defeatTarget
 * @text Defeat Target
 * @desc Especie objetivo (e.g. charizard). Vacio = deshabilitado.
 * @type string
 * @default
 *
 * @command startDoubleTrainer
 * @text Start Double Trainer Battle
 * @desc Inicia combate doble contra dos entrenadores. Activa switches al finalizar.
 * @arg trainer1
 * @text Trainer 1 Key
 * @desc Key del primer entrenador
 * @type string
 * @default youngster
 * @arg trainer2
 * @text Trainer 2 Key
 * @desc Key del segundo entrenador
 * @type string
 * @default lass
 * @arg winSwitch
 * @text Win Switch
 * @desc Switch ON si ganas. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg loseSwitch
 * @text Lose Switch
 * @desc Switch ON si pierdes. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg fleeSwitch
 * @text Flee Switch
 * @desc Switch ON si huyes. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg catchSwitch
 * @text Catch Switch
 * @desc Switch ON si capturas. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg defeatSwitch
 * @text Defeat Switch
 * @desc Switch ON si derrotas a la especie objetivo. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg defeatTarget
 * @text Defeat Target
 * @desc Especie objetivo. Vacio = deshabilitado.
 * @type string
 * @default
 *
 * @command resetBattleResult
 * @text Reset Battle Result
 * @desc Limpia el estado del ultimo combate (outcome + switches).
 *
 * @command wildEncounterList
 * @text Wild Encounter List
 * @desc Combate wild con lista de probabilidades (1-12 pokemon). Activa switches al finalizar.
 * 
 * @arg species1
 * @text Species 1
 * @desc Especie del Pokemon 1 (vacio = no usado)
 * @type string
 * @default 
 * @arg levelMin1
 * @text Level Min 1
 * @desc Nivel minimo del Pokemon 1
 * @type number
 * @min 1
 * @max 100
 * @default 1
 * @arg levelMax1
 * @text Level Max 1
 * @desc Nivel maximo del Pokemon 1
 * @type number
 * @min 1
 * @max 100
 * @default 5
 * @arg probability1
 * @text Probability 1 %
 * @desc Probabilidad de aparicion del Pokemon 1
 * @type number
 * @min 0
 * @max 100
 * @default 0
 * 
 * @arg species2
 * @text Species 2
 * @desc Especie del Pokemon 2 (vacio = no usado)
 * @type string
 * @default 
 * @arg levelMin2
 * @text Level Min 2
 * @desc Nivel minimo del Pokemon 2
 * @type number
 * @min 1
 * @max 100
 * @default 1
 * @arg levelMax2
 * @text Level Max 2
 * @desc Nivel maximo del Pokemon 2
 * @type number
 * @min 1
 * @max 100
 * @default 5
 * @arg probability2
 * @text Probability 2 %
 * @desc Probabilidad de aparicion del Pokemon 2
 * @type number
 * @min 0
 * @max 100
 * @default 0
 * 
 * @arg species3
 * @text Species 3
 * @desc Especie del Pokemon 3 (vacio = no usado)
 * @type string
 * @default 
 * @arg levelMin3
 * @text Level Min 3
 * @desc Nivel minimo del Pokemon 3
 * @type number
 * @min 1
 * @max 100
 * @default 1
 * @arg levelMax3
 * @text Level Max 3
 * @desc Nivel maximo del Pokemon 3
 * @type number
 * @min 1
 * @max 100
 * @default 5
 * @arg probability3
 * @text Probability 3 %
 * @desc Probabilidad de aparicion del Pokemon 3
 * @type number
 * @min 0
 * @max 100
 * @default 0
 * 
 * @arg species4
 * @text Species 4
 * @desc Especie del Pokemon 4 (vacio = no usado)
 * @type string
 * @default 
 * @arg levelMin4
 * @text Level Min 4
 * @desc Nivel minimo del Pokemon 4
 * @type number
 * @min 1
 * @max 100
 * @default 1
 * @arg levelMax4
 * @text Level Max 4
 * @desc Nivel maximo del Pokemon 4
 * @type number
 * @min 1
 * @max 100
 * @default 5
 * @arg probability4
 * @text Probability 4 %
 * @desc Probabilidad de aparicion del Pokemon 4
 * @type number
 * @min 0
 * @max 100
 * @default 0
 * 
 * @arg species5
 * @text Species 5
 * @desc Especie del Pokemon 5 (vacio = no usado)
 * @type string
 * @default 
 * @arg levelMin5
 * @text Level Min 5
 * @desc Nivel minimo del Pokemon 5
 * @type number
 * @min 1
 * @max 100
 * @default 1
 * @arg levelMax5
 * @text Level Max 5
 * @desc Nivel maximo del Pokemon 5
 * @type number
 * @min 1
 * @max 100
 * @default 5
 * @arg probability5
 * @text Probability 5 %
 * @desc Probabilidad de aparicion del Pokemon 5
 * @type number
 * @min 0
 * @max 100
 * @default 0
 * 
 * @arg species6
 * @text Species 6
 * @desc Especie del Pokemon 6 (vacio = no usado)
 * @type string
 * @default 
 * @arg levelMin6
 * @text Level Min 6
 * @desc Nivel minimo del Pokemon 6
 * @type number
 * @min 1
 * @max 100
 * @default 1
 * @arg levelMax6
 * @text Level Max 6
 * @desc Nivel maximo del Pokemon 6
 * @type number
 * @min 1
 * @max 100
 * @default 5
 * @arg probability6
 * @text Probability 6 %
 * @desc Probabilidad de aparicion del Pokemon 6
 * @type number
 * @min 0
 * @max 100
 * @default 0
 * 
 * @arg species7
 * @text Species 7
 * @desc Especie del Pokemon 7 (vacio = no usado)
 * @type string
 * @default 
 * @arg levelMin7
 * @text Level Min 7
 * @desc Nivel minimo del Pokemon 7
 * @type number
 * @min 1
 * @max 100
 * @default 1
 * @arg levelMax7
 * @text Level Max 7
 * @desc Nivel maximo del Pokemon 7
 * @type number
 * @min 1
 * @max 100
 * @default 5
 * @arg probability7
 * @text Probability 7 %
 * @desc Probabilidad de aparicion del Pokemon 7
 * @type number
 * @min 0
 * @max 100
 * @default 0
 * 
 * @arg species8
 * @text Species 8
 * @desc Especie del Pokemon 8 (vacio = no usado)
 * @type string
 * @default 
 * @arg levelMin8
 * @text Level Min 8
 * @desc Nivel minimo del Pokemon 8
 * @type number
 * @min 1
 * @max 100
 * @default 1
 * @arg levelMax8
 * @text Level Max 8
 * @desc Nivel maximo del Pokemon 8
 * @type number
 * @min 1
 * @max 100
 * @default 5
 * @arg probability8
 * @text Probability 8 %
 * @desc Probabilidad de aparicion del Pokemon 8
 * @type number
 * @min 0
 * @max 100
 * @default 0
 * 
 * @arg species9
 * @text Species 9
 * @desc Especie del Pokemon 9 (vacio = no usado)
 * @type string
 * @default 
 * @arg levelMin9
 * @text Level Min 9
 * @desc Nivel minimo del Pokemon 9
 * @type number
 * @min 1
 * @max 100
 * @default 1
 * @arg levelMax9
 * @text Level Max 9
 * @desc Nivel maximo del Pokemon 9
 * @type number
 * @min 1
 * @max 100
 * @default 5
 * @arg probability9
 * @text Probability 9 %
 * @desc Probabilidad de aparicion del Pokemon 9
 * @type number
 * @min 0
 * @max 100
 * @default 0
 * 
 * @arg species10
 * @text Species 10
 * @desc Especie del Pokemon 10 (vacio = no usado)
 * @type string
 * @default 
 * @arg levelMin10
 * @text Level Min 10
 * @desc Nivel minimo del Pokemon 10
 * @type number
 * @min 1
 * @max 100
 * @default 1
 * @arg levelMax10
 * @text Level Max 10
 * @desc Nivel maximo del Pokemon 10
 * @type number
 * @min 1
 * @max 100
 * @default 5
 * @arg probability10
 * @text Probability 10 %
 * @desc Probabilidad de aparicion del Pokemon 10
 * @type number
 * @min 0
 * @max 100
 * @default 0
 * 
 * @arg species11
 * @text Species 11
 * @desc Especie del Pokemon 11 (vacio = no usado)
 * @type string
 * @default 
 * @arg levelMin11
 * @text Level Min 11
 * @desc Nivel minimo del Pokemon 11
 * @type number
 * @min 1
 * @max 100
 * @default 1
 * @arg levelMax11
 * @text Level Max 11
 * @desc Nivel maximo del Pokemon 11
 * @type number
 * @min 1
 * @max 100
 * @default 5
 * @arg probability11
 * @text Probability 11 %
 * @desc Probabilidad de aparicion del Pokemon 11
 * @type number
 * @min 0
 * @max 100
 * @default 0
 * 
 * @arg species12
 * @text Species 12
 * @desc Especie del Pokemon 12 (vacio = no usado)
 * @type string
 * @default 
 * @arg levelMin12
 * @text Level Min 12
 * @desc Nivel minimo del Pokemon 12
 * @type number
 * @min 1
 * @max 100
 * @default 1
 * @arg levelMax12
 * @text Level Max 12
 * @desc Nivel maximo del Pokemon 12
 * @type number
 * @min 1
 * @max 100
 * @default 5
 * @arg probability12
 * @text Probability 12 %
 * @desc Probabilidad de aparicion del Pokemon 12
 * @type number
 * @min 0
 * @max 100
 * @default 0
 * @arg winSwitch
 * @text Win Switch
 * @desc Switch ON si ganas. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg loseSwitch
 * @text Lose Switch
 * @desc Switch ON si pierdes. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg fleeSwitch
 * @text Flee Switch
 * @desc Switch ON si huyes. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg catchSwitch
 * @text Catch Switch
 * @desc Switch ON si capturas. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg defeatSwitch
 * @text Defeat Switch
 * @desc Switch ON si derrotas a la especie objetivo. 0 = ninguno.
 * @type switch
 * @default 0
 * @arg defeatTarget
 * @text Defeat Target
 * @desc Especie objetivo (e.g. rattata). Vacio = deshabilitado.
 * @type string
 * @default
 */

var PMZ = PMZ || {};
PMZ.Battle = PMZ.Battle || {};

// ============================================================================
// Window_PMZ_BattleHP - Muestra HP de un Pokemon
// ============================================================================
function Window_PMZ_BattleHP() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_BattleHP.prototype = Object.create(Window_Base.prototype);
Window_PMZ_BattleHP.prototype.constructor = Window_PMZ_BattleHP;

Window_PMZ_BattleHP.prototype.initialize = function(x, y, width, height, wild) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._wild = wild;
    this._isStatEvolution = PMZ.Config.isStatEvolution();
};

Window_PMZ_BattleHP.prototype.setPokemon = function(pkmn) {
    this._pkmn = pkmn;
    this._hpShown = null;
    this._hpTarget = null;
    this._hpAnimating = false;
    this.refresh();
};

Window_PMZ_BattleHP.prototype._currentRatio = function() {
    var p = this._pkmn;
    return p && p.maxHp > 0 ? p.currentHp / p.maxHp : 0;
};

// Animacion de barra: suaviza el valor mostrado hacia el real (daño/humo/curas)
Window_PMZ_BattleHP.prototype.animateHp = function() {
    if (!this._pkmn) return;
    this._hpTarget = this._currentRatio();
    if (this._hpShown === null || this._hpShown === undefined) this._hpShown = this._hpTarget;
    this._hpAnimating = true;
};

Window_PMZ_BattleHP.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (!this._hpAnimating || !this._pkmn) return;
    var diff = this._hpTarget - this._hpShown;
    if (Math.abs(diff) < 0.008) {
        this._hpShown = this._hpTarget;
        this._hpAnimating = false;
        this.drawHpContent();
    } else {
        this._hpShown += diff * 0.22;
        this.drawHpContent();
    }
};

Window_PMZ_BattleHP.prototype.refresh = function() {
    this.contents.clear();
    if (!this._pkmn) {
        this._hpShown = null;
        this._hpTarget = null;
        return;
    }
    // Anima desde el valor mostrado anterior hacia el real salvo en el primer dibujo
    var target = this._currentRatio();
    this._hpTarget = target;
    if (this._hpShown === null || this._hpShown === undefined) {
        this._hpShown = target;
        this._hpAnimating = false;
    } else {
        this._hpAnimating = true;
    }
    this.drawHpContent();
};

Window_PMZ_BattleHP.prototype.drawHpContent = function() {
    var p = this._pkmn;
    if (!p) return;
    this.contents.clear();
    var cw = this.contents.width;

    // Line 1: Name
    this.contents.fontSize = 22;
    this.changeTextColor('#ffffff');
    this.drawText(p.name, 12, 6, 180, 'left');

    // Level after name
    this.changeTextColor('#f8d030');
    var lvText = this._isStatEvolution ? '???' : 'Lv' + p.level;
    var nameW = this.contents.measureTextWidth(p.name);
    this.drawText(lvText, 16 + nameW, 6, 60, 'left');
    this.resetTextColor();

    // Status after level
    if (PMZ.Pokemon.isFainted(p)) {
        this.changeTextColor('#f85858');
        this.drawText('FNT', 16 + nameW + 60, 6, 40, 'left');
        this.resetTextColor();
    } else if (p.status) {
        this.changeTextColor('#f8a030');
        this.drawText(String(p.status).toUpperCase(), 16 + nameW + 60, 6, 50, 'left');
        this.resetTextColor();
    }

    // Line 2: HP bar + text
    var barY = 36;
    var barH = 12;

    // HP Bar (usa el valor animado)
    var barX = 12;
    var barW = cw - 120;
    var shownRatio = Math.max(0, Math.min(1, this._hpShown || 0));

    this.contents.fillRect(barX, barY, barW, barH, '#202020');
    var hpColor = shownRatio > 0.5 ? '#48c848' : (shownRatio > 0.25 ? '#f8d030' : '#f85858');
    this.contents.fillRect(barX + 1, barY + 1, Math.max(0, Math.floor((barW - 2) * shownRatio)), barH - 2, hpColor);

    // HP text (big, right side)
    this.contents.fontSize = 20;
    this.changeTextColor('#ffffff');
    var curHp = (typeof p.currentHp === 'number' && !isNaN(p.currentHp)) ? p.currentHp : 0;
    var maxHp = (typeof p.maxHp === 'number' && !isNaN(p.maxHp) && p.maxHp > 0) ? p.maxHp : 1;
    var hpText = curHp + ' / ' + maxHp;
    this.drawText(hpText, cw - 108, barY - 4, 96, 'right');
    this.resetTextColor();
    this.contents.fontSize = 22;
};

// ============================================================================
// Window_PMZ_BattleCommand - 2x2 (Fight, Bag, Pokemon, Run)
// ============================================================================
function Window_PMZ_BattleCommand() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_BattleCommand.prototype = Object.create(Window_Selectable.prototype);
Window_PMZ_BattleCommand.prototype.constructor = Window_PMZ_BattleCommand;

// ============================================================================
// Window_PMZ_SafariCommand - 2x2 comandos de Safari
// ============================================================================
function Window_PMZ_SafariCommand() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_SafariCommand.prototype = Object.create(Window_Selectable.prototype);
Window_PMZ_SafariCommand.prototype.constructor = Window_PMZ_SafariCommand;

Window_PMZ_SafariCommand.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.deactivate();
};

Window_PMZ_SafariCommand.prototype.maxCols = function() { return 2; };
Window_PMZ_SafariCommand.prototype.maxItems = function() { return 4; };
Window_PMZ_SafariCommand.prototype.itemHeight = function() { return 44; };

Window_PMZ_SafariCommand.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    var commands = ['Ball', 'Cebo', 'Piedra', 'Huir'];
    this.contents.fontSize = 24;
    this.drawText(commands[index] || '---', rect.x + 12, rect.y + 10, rect.width - 24, 'left');
    this.contents.fontSize = 22;
};

Window_PMZ_SafariCommand.prototype.refresh = function() {
    this.contents.clear();
    this.drawAllItems();
};

// ============================================================================
// Window_PMZ_TargetSelect - Selection de objetivo en doble batalla
// ============================================================================
function Window_PMZ_TargetSelect() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_TargetSelect.prototype = Object.create(Window_Selectable.prototype);
Window_PMZ_TargetSelect.prototype.constructor = Window_PMZ_TargetSelect;

Window_PMZ_TargetSelect.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
};

Window_PMZ_TargetSelect.prototype.setTargets = function(targets) {
    this._targets = targets || [];
    this.refresh();
};

Window_PMZ_TargetSelect.prototype.maxItems = function() { return this._targets ? this._targets.length : 0; };
Window_PMZ_TargetSelect.prototype.itemHeight = function() { return 40; };
Window_PMZ_TargetSelect.prototype.drawItem = function(index) {
    var t = this._targets[index];
    if (!t) return;
    this.drawText(t.name + ' Lv' + t.level, this.itemRect(index).x + 10, this.itemRect(index).y + 10, this.itemWidth() - 20, 'left');
};
Window_PMZ_TargetSelect.prototype.selectedTarget = function() {
    return this._targets ? this._targets[this.index()] : null;
};
Window_PMZ_TargetSelect.prototype.refresh = function() {
    this.contents.clear();
    this.drawAllItems();
};

Window_PMZ_BattleCommand.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._showCapture = false;
    this.refresh();
    this.deactivate();
};

Window_PMZ_BattleCommand.prototype.maxCols = function() { return 2; };
Window_PMZ_BattleCommand.prototype.maxItems = function() { return this._showCapture ? 5 : 4; };
Window_PMZ_BattleCommand.prototype.itemHeight = function() { return 44; };

Window_PMZ_BattleCommand.prototype.setShowCapture = function(val) {
    this._showCapture = val;
    this.refresh();
};

Window_PMZ_BattleCommand.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    var commands = this._showCapture ? ['Luchar', 'Bolsa', 'Pokemon', 'Ball', 'Huir'] : ['Luchar', 'Bolsa', 'Pokemon', 'Huir'];

    this.contents.fontSize = 24;
    this.drawText(commands[index] || '---', rect.x + 12, rect.y + 10, rect.width - 24, 'left');
    this.contents.fontSize = 22;
};

Window_PMZ_BattleCommand.prototype.refresh = function() {
    this.contents.clear();
    this.drawAllItems();
};

// ============================================================================
// Window_PMZ_BattleFight - 2x2 moves
// ============================================================================
function Window_PMZ_BattleFight() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_BattleFight.prototype = Object.create(Window_Selectable.prototype);
Window_PMZ_BattleFight.prototype.constructor = Window_PMZ_BattleFight;

Window_PMZ_BattleFight.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._moves = [];
    this._mechanics = [];
    this.refresh();
    this.deactivate();
};

Window_PMZ_BattleFight.prototype.setMoves = function(moves, pkmn) {
    this._moves = moves || [];
    this._mechanics = [];
    if (pkmn) {
        var list = PMZ.Battle.Mechanics.list();
        for (var i = 0; i < list.length; i++) {
            if (PMZ.Battle.Mechanics.canActivate(pkmn, list[i].key)) {
                this._mechanics.push(list[i]);
            }
        }
    }
    this.refresh();
    this.select(0);
};

Window_PMZ_BattleFight.prototype.maxCols = function() { return 2; };
Window_PMZ_BattleFight.prototype.maxItems = function() {
    return Math.max(4, this._moves.length + this._mechanics.length);
};
Window_PMZ_BattleFight.prototype.itemHeight = function() { return 48; };

Window_PMZ_BattleFight.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    var mechIdx = index - this._moves.length;
    var isMechanic = mechIdx >= 0 && mechIdx < this._mechanics.length;

    if (isMechanic) {
        var mech = this._mechanics[mechIdx];
        this.contents.fontSize = 20;
        this.changeTextColor('#f8d030');
        this.drawText(mech.name, rect.x + 10, rect.y + 14, rect.width - 20, 'center');
        this.resetTextColor();
        this.contents.fontSize = 22;
        return;
    }

    var m = this._moves[index];
    if (!m) {
        this.contents.fontSize = 20;
        this.drawText('---', rect.x + 10, rect.y + 14, rect.width - 20, 'center');
        this.contents.fontSize = 22;
        return;
    }

    // Move name
    this.contents.fontSize = 22;
    this.changeTextColor('#ffffff');
    this.drawText(m.name || '???', rect.x + 10, rect.y + 6, rect.width - 20, 'left');

    // Type badge
    PMZ.Utils.drawTypeBadge(this.contents, m.type || 'normal', rect.x + 10, rect.y + 26, 56, 18);

    // PP
    this.contents.fontSize = 14;
    this.changeTextColor('#cccccc');
    var ppText = 'PP ' + m.pp + '/' + m.maxPp;
    this.drawText(ppText, rect.x + 10, rect.y + 28, rect.width - 20, 'right');

    this.resetTextColor();
    this.contents.fontSize = 22;
};

Window_PMZ_BattleFight.prototype.getMove = function() {
    var idx = this.index();
    if (idx < this._moves.length) return this._moves[idx] || null;
    return null;
};

Window_PMZ_BattleFight.prototype.getSelectedMechanic = function() {
    var idx = this.index();
    var mechIdx = idx - this._moves.length;
    if (mechIdx >= 0 && mechIdx < this._mechanics.length) {
        return this._mechanics[mechIdx];
    }
    return null;
};

Window_PMZ_BattleFight.prototype.refresh = function() {
    this.contents.clear();
    this.drawAllItems();
};

// ============================================================================
// Window_PMZ_BattleMessage
// ============================================================================
function Window_PMZ_BattleMessage() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_BattleMessage.prototype = Object.create(Window_Base.prototype);
Window_PMZ_BattleMessage.prototype.constructor = Window_PMZ_BattleMessage;

Window_PMZ_BattleMessage.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._text = '';
};

Window_PMZ_BattleMessage.prototype.setText = function(text) {
    this._text = text || '';
    this.refresh();
};

Window_PMZ_BattleMessage.prototype.refresh = function() {
    this.contents.clear();
    if (this._text) {
        this.contents.fontSize = 22;
        this.changeTextColor('#ffffff');
        this.drawText(this._text, 16, 12, this.width - 32, 'left');
        this.resetTextColor();
    }
};

// ============================================================================
// Window_PMZ_BattleBag - Quick item selection
// ============================================================================
function Window_PMZ_BattleBag() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_BattleBag.prototype = Object.create(Window_Selectable.prototype);
Window_PMZ_BattleBag.prototype.constructor = Window_PMZ_BattleBag;

Window_PMZ_BattleBag.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._items = [];
    this.refresh();
    this.deactivate();
};

Window_PMZ_BattleBag.prototype.setItems = function(items) {
    this._items = items || [];
    this.refresh();
    this.select(0);
};

Window_PMZ_BattleBag.prototype.maxItems = function() { return this._items.length || 1; };
Window_PMZ_BattleBag.prototype.itemHeight = function() { return 32; };

Window_PMZ_BattleBag.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    var item = this._items[index];

    if (!item) {
        this.contents.fontSize = 20;
        this.drawText('(Sin objetos)', rect.x + 10, rect.y + 6, rect.width - 20, 'left');
        this.contents.fontSize = 22;
        return;
    }

    var itemData = PMZ.Data.item(item.key);
    var name = itemData ? itemData.name : item.key;

    // Icono del item (si tiene icono conocido o es una ball)
    if (PMZ.ItemIcons) {
        var iconName = PMZ.ItemIcons.iconName(item.key, itemData);
        if (iconName) {
            PMZ.ItemIcons.drawIcon(this.contents, item.key, itemData, rect.x + 6, rect.y + 4, 24, 24,
                this.refresh.bind(this));
        }
    }

    // Item name
    this.contents.fontSize = 22;
    this.drawText(name, rect.x + 38, rect.y + 6, 160, 'left');

    // Quantity
    this.changeTextColor('#f8d030');
    this.drawText('x' + item.count, rect.x + 180, rect.y + 6, 60, 'left');
    this.resetTextColor();

    // Description snippet
    if (itemData && itemData.desc) {
        this.contents.fontSize = 14;
        this.changeTextColor('#aaaaaa');
        this.drawText(itemData.desc, rect.x + 250, rect.y + 8, rect.width - 260, 'left');
        this.resetTextColor();
    }
    this.contents.fontSize = 22;
};

Window_PMZ_BattleBag.prototype.getSelected = function() {
    return this._items[this.index()] || null;
};

Window_PMZ_BattleBag.prototype.refresh = function() {
    this.contents.clear();
    this.drawAllItems();
};

// ============================================================================
// Window_PMZ_BattleParty - Quick party switch
// ============================================================================
function Window_PMZ_BattleParty() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_BattleParty.prototype = Object.create(Window_Selectable.prototype);
Window_PMZ_BattleParty.prototype.constructor = Window_PMZ_BattleParty;

Window_PMZ_BattleParty.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.deactivate();
};

Window_PMZ_BattleParty.prototype.maxItems = function() { return Math.max(6, $gamePMZ.party().length); };
Window_PMZ_BattleParty.prototype.itemHeight = function() { return 40; };

Window_PMZ_BattleParty.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    var pkmn = $gamePMZ.party()[index];

    if (!pkmn) {
        this.contents.fontSize = 20;
        this.drawText('---', rect.x + 10, rect.y + 10, rect.width - 20, 'center');
        this.contents.fontSize = 22;
        return;
    }

    var isFnt = PMZ.Pokemon.isFainted(pkmn);

    // Name
    this.contents.fontSize = 22;
    if (isFnt) {
        this.changeTextColor('#f85858');
    } else {
        this.changeTextColor('#ffffff');
    }
    this.drawText(pkmn.name, rect.x + 10, rect.y + 6, 140, 'left');

    // Level
    this.changeTextColor('#f8d030');
    this.drawText('Lv' + pkmn.level, rect.x + 150, rect.y + 6, 50, 'left');

    // HP
    this.contents.fontSize = 16;
    if (isFnt) {
        this.changeTextColor('#f85858');
        this.drawText('FNT', rect.x + 10, rect.y + 24, 60, 'left');
    } else {
        this.changeTextColor('#cccccc');
        var hpText = pkmn.currentHp + ' / ' + pkmn.maxHp;
        this.drawText(hpText, rect.x + 10, rect.y + 24, 120, 'left');

        // Mini HP bar
        var barX = rect.x + 130;
        var barY = rect.y + 26;
        var barW = 80;
        var barH = 8;
        var ratio = pkmn.maxHp > 0 ? pkmn.currentHp / pkmn.maxHp : 0;
        this.contents.fillRect(barX, barY, barW, barH, '#303030');
        var c = ratio > 0.5 ? '#48c848' : (ratio > 0.25 ? '#f8d030' : '#f85858');
        this.contents.fillRect(barX + 1, barY + 1, Math.max(0, Math.floor((barW - 2) * ratio)), barH - 2, c);
    }

    this.resetTextColor();
    this.contents.fontSize = 22;
};

Window_PMZ_BattleParty.prototype.refresh = function() {
    this.contents.clear();
    this.drawAllItems();
};

// ============================================================================
// ============================================================================
// Scene_PMZ_Battle - Pantalla de combate
// ============================================================================
// Scene_PMZ_Battle
// ============================================================================
function Scene_PMZ_Battle() {
    this.initialize.apply(this, arguments);
}

Scene_PMZ_Battle.prototype = Object.create(Scene_Base.prototype);
Scene_PMZ_Battle.prototype.constructor = Scene_PMZ_Battle;

Scene_PMZ_Battle.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    // La ball y el flash se crean primero: si cualquier createX posterior
    // lanza, no pueden quedarse sin sprite (que congelaba el juego al lanzar
    // una Pokebola por setear .visible sobre undefined).
    try {
        this.createCaptureSprite();
    } catch (e) {
        console.error('[PMZ] Battle capture sprite create error:', e.message, e.stack);
    }
    try {
        this.createBackground();
        this.createPokemonSprites();
        this.createWindowLayer();
        this.createHPWindows();
        this.createMessageWindow();
        this.createCommandWindow();
        this.createSafariWindow();
        this.createFightWindow();
        this.createBagWindow();
        this.createPartyWindow();
        this.updateBackground();
        this._state = 'transition';
        this._transitionTimer = 20;
        this._flashSprite.opacity = 255;
        // La ball y el flash se crearon primero (fix crash); subirlos al frente
        // para que el fondo, los sprites y las ventanas no los tapen.
        try {
            if (this._ballSprite) this.setChildIndex(this._ballSprite, this.children.length - 1);
            if (this._flashSprite) this.setChildIndex(this._flashSprite, this.children.length - 1);
        } catch (e) {
            console.error('[PMZ] Battle z-order fix error:', e.message);
        }
    } catch (e) {
        console.error('[PMZ] Battle create error:', e.message, e.stack);
        if ($gameMessage) {
            $gameMessage.add('Error en batalla: ' + e.message);
        }
    }
};

Scene_PMZ_Battle.prototype.createPokemonSprites = function() {
    // Player's Pokemon back sprite (bottom left)
    this._playerSprite = new Sprite_PMZ_Pokemon();
    this._playerSprite.setPokemon(null);
    this._playerSprite.x = 60;
    this._playerSprite.y = Math.floor(Graphics.boxHeight * 0.34) - 40;
    this._playerSprite.scale.x = 1.0;
    this._playerSprite.scale.y = 1.0;
    this.addChild(this._playerSprite);

    // Wild/trainer front sprite (top right)
    this._wildSprite = new Sprite_PMZ_Pokemon();
    this._wildSprite.setPokemon(null);
    this._wildSprite.x = Math.floor(Graphics.boxWidth * 0.52);
    this._wildSprite.y = 100;
    this._wildSprite.scale.x = 1.1;
    this._wildSprite.scale.y = 1.1;
    this.addChild(this._wildSprite);

    // Second wild sprite for double battle
    this._wildSprite2 = new Sprite_PMZ_Pokemon();
    this._wildSprite2.setPokemon(null);
    this._wildSprite2.x = Math.floor(Graphics.boxWidth * 0.22);
    this._wildSprite2.y = 95;
    this._wildSprite2.scale.x = 1.0;
    this._wildSprite2.scale.y = 1.0;
    this._wildSprite2.visible = false;
    this.addChild(this._wildSprite2);

    this._playerSprite2 = new Sprite_PMZ_Pokemon();
    this._playerSprite2.setPokemon(null);
    this._playerSprite2.x = Math.floor(Graphics.boxWidth * 0.50);
    this._playerSprite2.y = Math.floor(Graphics.boxHeight * 0.34) - 35;
    this._playerSprite2.scale.x = 0.9;
    this._playerSprite2.scale.y = 0.9;
    this._playerSprite2.visible = false;
    this.addChild(this._playerSprite2);
};

Scene_PMZ_Battle.prototype.createBackground = function() {
    this._bgSprite = new Sprite();
    this.addChild(this._bgSprite);
    this._loadBattleback('grass');
};

Scene_PMZ_Battle.prototype._bgFRLG = {
    grass: 'BB1 FRLG Grass ',
    water: 'BB1 FRLG Water ',
    cave: 'BB1 FRLG Cave ',
    fire: 'BB1 FRLG Arena1',
    electric: 'BB1 FRLG Arena4',
    forest: 'BB1 FRLG Plain ',
    ice: 'BB1 FRLG Lake'
};

Scene_PMZ_Battle.prototype._loadBattleback = function(type) {
    if (!type) type = 'grass';
    var name = this._bgFRLG[type];
    if (name) {
        this._bgSprite.bitmap = ImageManager.loadBattleback1(name);
    }
};

Scene_PMZ_Battle.prototype.updateBackground = function() {
    this._loadBattleback(this._bgType || 'grass');
};

Scene_PMZ_Battle.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
    this._state = 'init';
    this._waitCount = 0;
    this._messageQueue = [];
    this._bgType = 'grass';
    this._captureShakes = 0;
    this._safariMode = false;
    this._safariBaitCount = 0;
    this._safariRockCount = 0;
};

Scene_PMZ_Battle.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
};

Scene_PMZ_Battle.prototype.isReady = function() {
    return true;
};

Scene_PMZ_Battle.prototype.createHPWindows = function() {
    var w = Graphics.boxWidth;
    var h = Graphics.boxHeight;

    // Wild HP window (top-right)
    var wildHpW = Math.floor(w * 0.42);
    this._wildHP = new Window_PMZ_BattleHP(Math.floor(w * 0.54), 4, wildHpW, 76, true);
    this._wildHP.opacity = 180;
    this.addWindow(this._wildHP);

    // Player HP window (bottom-left, next to player sprite)
    var playerHpW = Math.floor(w * 0.42);
    this._playerHP = new Window_PMZ_BattleHP(4, Math.floor(h * 0.56), playerHpW, 76, false);
    this._playerHP.opacity = 180;
    this.addWindow(this._playerHP);

    // Second HP windows for double battle
    this._wildHP2 = new Window_PMZ_BattleHP(4, 4, Math.floor(w * 0.30), 76, true);
    this._wildHP2.opacity = 140;
    this._wildHP2.visible = false;
    this.addWindow(this._wildHP2);

    this._playerHP2 = new Window_PMZ_BattleHP(Math.floor(w * 0.40), Math.floor(h * 0.56), Math.floor(w * 0.30), 76, false);
    this._playerHP2.opacity = 140;
    this._playerHP2.visible = false;
    this.addWindow(this._playerHP2);
};

Scene_PMZ_Battle.prototype.createMessageWindow = function() {
    var w = Graphics.boxWidth;
    var h = Graphics.boxHeight;
    this._msgWindow = new Window_PMZ_BattleMessage(0, Math.floor(h * 0.74), w, Math.floor(h * 0.26));
    this._msgWindow.opacity = 200;
    this.addWindow(this._msgWindow);
};

Scene_PMZ_Battle.prototype.createCommandWindow = function() {
    var w = Graphics.boxWidth;
    var h = Graphics.boxHeight;
    this._cmdWindow = new Window_PMZ_BattleCommand(0, Math.floor(h * 0.74), w, Math.floor(h * 0.26));
    this._cmdWindow.setHandler('ok', this.onCommandOk.bind(this));
    this._cmdWindow.setHandler('cancel', this.onCommandCancel.bind(this));
    this._cmdWindow.hide();
    this.addWindow(this._cmdWindow);
};

Scene_PMZ_Battle.prototype.createSafariWindow = function() {
    var w = Graphics.boxWidth;
    var h = Graphics.boxHeight;
    this._safariWindow = new Window_PMZ_SafariCommand(0, Math.floor(h * 0.74), w, Math.floor(h * 0.26));
    this._safariWindow.setHandler('ok', this.onSafariOk.bind(this));
    this._safariWindow.setHandler('cancel', this.onSafariCancel.bind(this));
    this._safariWindow.hide();
    this.addWindow(this._safariWindow);
};

Scene_PMZ_Battle.prototype.createFightWindow = function() {
    var w = Graphics.boxWidth;
    var h = Graphics.boxHeight;
    this._fightWindow = new Window_PMZ_BattleFight(0, Math.floor(h * 0.74), w, Math.floor(h * 0.26));
    this._fightWindow.setHandler('ok', this.onFightOk.bind(this));
    this._fightWindow.setHandler('cancel', this.onFightCancel.bind(this));
    this._fightWindow.hide();
    this.addWindow(this._fightWindow);
};

Scene_PMZ_Battle.prototype.createBagWindow = function() {
    var w = Graphics.boxWidth;
    var h = Graphics.boxHeight;
    this._bagWindow = new Window_PMZ_BattleBag(0, Math.floor(h * 0.74), w, Math.floor(h * 0.26));
    this._bagWindow.setHandler('ok', this.onBagOk.bind(this));
    this._bagWindow.setHandler('cancel', this.onBagCancel.bind(this));
    this._bagWindow.hide();
    this.addWindow(this._bagWindow);
};

Scene_PMZ_Battle.prototype.createPartyWindow = function() {
    var w = Graphics.boxWidth;
    var h = Graphics.boxHeight;
    this._partyWindow = new Window_PMZ_BattleParty(0, Math.floor(h * 0.74), w, Math.floor(h * 0.26));
    this._partyWindow.setHandler('ok', this.onPartyOk.bind(this));
    this._partyWindow.setHandler('cancel', this.onPartyCancel.bind(this));
    this._partyWindow.hide();
    this.addWindow(this._partyWindow);
};

Scene_PMZ_Battle.prototype.createCaptureSprite = function() {
    this._ballSprite = new Sprite();
    this._ballSprite.bitmap = new Bitmap(48, 48);
    this._ballSprite.bitmap.fillRect(0, 0, 48, 48, '#ff0000');
    this._ballSprite.bitmap.fillRect(0, 24, 48, 24, '#ffffff');
    this._ballSprite.bitmap.fillRect(20, 0, 8, 48, '#404040');
    this._ballSprite.x = Math.floor(Graphics.boxWidth / 2) - 24;
    this._ballSprite.y = Math.floor(Graphics.boxHeight / 2) - 24;
    this._ballSprite.visible = false;
    this.addChild(this._ballSprite);

    this._flashSprite = new Sprite();
    this._flashSprite.bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
    this._flashSprite.bitmap.fillRect(0, 0, Graphics.boxWidth, Graphics.boxHeight, '#ffffff');
    this._flashSprite.opacity = 0;
    this.addChild(this._flashSprite);
};

Scene_PMZ_Battle.prototype.startBattle = function() {
    var wild = PMZ.Battle._wildPokemon;
    var wild2 = PMZ.Battle._wildPokemon2;
    var player = PMZ.Battle._playerPokemon;
    var player2 = PMZ.Battle._playerPokemon2;
    var isTrainer = PMZ.Battle.isTrainerBattle();
    var isDouble = PMZ.Battle._doubleBattle;
    this._safariMode = $gamePMZ.safariBalls() > 0 && $gamePMZ.safariSteps() > 0 && !isTrainer;

    if (!player && !this._safariMode) {
        this._msgWindow.setText('No tienes Pokemon!');
        this._defeatOccurred = true;
        this._state = 'defeat';
        this._waitCount = 120;
        return;
    }

    PMZ.Battle.initStatStages(player);
    if (player2) PMZ.Battle.initStatStages(player2);
    if (wild) PMZ.Battle.initStatStages(wild);
    if (wild2) PMZ.Battle.initStatStages(wild2);
    PMZ.Status.cleanBattle();

    this._wildHP.setPokemon(wild);
    if (!this._safariMode) {
        this._playerHP.setPokemon(player);
        this._playerSprite.setPokemon(player, true);
    } else {
        this._playerHP.hide();
        this._playerSprite.visible = false;
    }
    this._wildSprite.setPokemon(wild, false);

    // Double battle: second pair
    if (isDouble) {
        this._wildHP2.visible = true;
        this._playerHP2.visible = true;
        this._wildSprite2.visible = true;
        this._playerSprite2.visible = true;
        this._wildHP2.setPokemon(wild2);
        this._playerHP2.setPokemon(player2);
        this._wildSprite2.setPokemon(wild2, false);
        this._playerSprite2.setPokemon(player2, true);
    } else {
        this._wildHP2.visible = false;
        this._playerHP2.visible = false;
        this._wildSprite2.visible = false;
        this._playerSprite2.visible = false;
    }

    if (wild && !isTrainer) {
        PMZ.Pokedex.registerSeen(wild.species);
    }

    // Set background type based on wild Pokemon type
    if (wild && wild.types) {
        var waterTypes = ['water', 'ice'];
        var caveTypes = ['rock', 'ground', 'steel'];
        var fireTypes = ['fire'];
        var grassTypes = ['grass', 'bug'];
        var electricTypes = ['electric'];
        if (waterTypes.indexOf(wild.types[0]) >= 0) this._bgType = 'water';
        else if (caveTypes.indexOf(wild.types[0]) >= 0) this._bgType = 'cave';
        else if (fireTypes.indexOf(wild.types[0]) >= 0) this._bgType = 'fire';
        else if (grassTypes.indexOf(wild.types[0]) >= 0) this._bgType = 'grass';
        else if (electricTypes.indexOf(wild.types[0]) >= 0) this._bgType = 'electric';
        else this._bgType = 'grass';
    }
    this.updateBackground();

    // Play wild Pokémon cry
    if (wild && !isTrainer) {
        this.playCry(wild);
    }

    var msg = '';
    if (this._safariMode) {
        msg = 'Un ' + wild.name + ' salvaje aparecio!';
    } else if (isTrainer) {
        var tData = PMZ.Battle._enemyTrainer;
        msg = tData ? tData.dialogue.intro : 'Entrenador quiere luchar!';
    } else {
        msg = wild ? 'Un ' + wild.name + ' salvaje aparecio!' : 'Comienza el combate!';
    }
    this._msgWindow.setText(msg);
    this._state = 'intro';
    this._waitCount = 90;
};

Scene_PMZ_Battle.prototype.playCry = function(pkmn) {
    if (!pkmn || !pkmn.id) return;
    var id = pkmn.id;
    var pad = id < 10 ? '00' + id : id < 100 ? '0' + id : '' + id;
    AudioManager.playSe({ name: pad + 'Cry', pan: 0, pitch: 100, volume: 90 });
};

Scene_PMZ_Battle.prototype.update = function() {
    if (this._ballSprite) this._ballSprite.update();
    if (this._wildHP) this._wildHP.update();
    if (this._wildHP2) this._wildHP2.update();
    if (this._playerHP) this._playerHP.update();
    if (this._playerHP2) this._playerHP2.update();
    if (this._msgWindow) this._msgWindow.update();
    if (this._cmdWindow && this._cmdWindow.visible) this._cmdWindow.update();
    if (this._fightWindow && this._fightWindow.visible) this._fightWindow.update();
    if (this._bagWindow && this._bagWindow.visible) this._bagWindow.update();
    if (this._partyWindow && this._partyWindow.visible) this._partyWindow.update();
    if (this._targetWindow && this._targetWindow.visible) this._targetWindow.update();
    if (this._currentAnimation) this._currentAnimation.update();
    if (this._tweens || this._fxSprites) this._advanceFX();

    if (this._waitCount > 0) {
        this._waitCount--;
        return;
    }

    if (this._state === 'transition') {
        this._transitionTimer--;
        this._flashSprite.opacity = Math.floor(255 * (this._transitionTimer / 20));
        if (this._transitionTimer <= 0) {
            this._flashSprite.opacity = 0;
            this.startBattle();
        }
    }

    switch (this._state) {
        case 'intro': this.updateIntro(); break;
        case 'showCommand': this.updateShowCommand(); break;
        case 'playerCommand': this.updatePlayerCommand(); break;
        case 'subMenu': break;
        case 'playerTargetSelect': this.updatePlayerTargetSelect(); break;
        case 'executeQueue': this.updateExecuteQueue(); break;
        case 'playerAttack': this.updatePlayerAttack(); break;
        case 'opponentAttack': this.updateOpponentAttack(); break;
        case 'capture': this.updateCapture(); break;
        case 'captured': this.updateCaptured(); break;
        case 'victory': this.updateVictory(); break;
        case 'capturePrompt': this.updateCapturePrompt(); break;
        case 'defeat': this.updateDefeat(); break;
        case 'flee': this.updateFlee(); break;
        case 'trainerSendOut': this.updateTrainerSendOut(); break;
        case 'abilityActivate': this.updateAbilityActivate(); break;
        case 'safariBall': this.updateSafariBall(); break;
        case 'safariBait': this.updateSafariBait(); break;
        case 'safariRock': this.updateSafariRock(); break;
        case 'endBattle': this.updateEndBattle(); break;
    }
};

Scene_PMZ_Battle.prototype.onIntroEnd = function() {
    this._state = 'playerCommand';
    this.showCommandWindow();
};

Scene_PMZ_Battle.prototype.showCommandWindow = function() {
    if (this._safariMode) {
        this._safariWindow.show();
        this._safariWindow.activate();
        this._safariWindow.select(0);
        this._cmdWindow.hide();
        this._cmdWindow.deactivate();
        this._fightWindow.hide();
        this._fightWindow.deactivate();
        this._bagWindow.hide();
        this._bagWindow.deactivate();
        this._partyWindow.hide();
        this._partyWindow.deactivate();
        this._state = 'playerCommand';
        this._msgWindow.setText('Que hara?  (Pasos: ' + $gamePMZ.safariSteps() + '  Balls: ' + $gamePMZ.safariBalls() + ')');
        return;
    }
    this._cmdWindow.show();
    this._cmdWindow.activate();
    this._cmdWindow.select(0);
    this._fightWindow.hide();
    this._fightWindow.deactivate();
    this._bagWindow.hide();
    this._bagWindow.deactivate();
    this._partyWindow.hide();
    this._partyWindow.deactivate();
    this._state = 'playerCommand';
    var pkmn = PMZ.Battle._playerPokemon;

    var wild = PMZ.Battle._wildPokemon;
    var showCapture = !PMZ.Battle.isTrainerBattle() && wild && !PMZ.Pokemon.isFainted(wild) && wild.currentHp < wild.maxHp;
    this._cmdWindow.setShowCapture(showCapture);

    this._msgWindow.setText('Que hara ' + (pkmn ? pkmn.name : '?') + '?');
};

Scene_PMZ_Battle.prototype.onSafariOk = function() {
    var index = this._safariWindow.index();
    switch (index) {
        case 0: this.safariThrowBall(); break;
        case 1: this.safariThrowBait(); break;
        case 2: this.safariThrowRock(); break;
        case 3: this.tryFlee(); break;
    }
};

Scene_PMZ_Battle.prototype.onSafariCancel = function() {
    SoundManager.playBuzzer();
};

Scene_PMZ_Battle.prototype.safariThrowBall = function() {
    if ($gamePMZ.safariBalls() <= 0) {
        this._msgWindow.setText('No te quedan Safari Balls!');
        this._waitCount = 30;
        this.showCommandWindow();
        return;
    }
    $gamePMZ.setSafariBalls($gamePMZ.safariBalls() - 1);
    this._safariWindow.hide();
    this._safariWindow.deactivate();
    this._msgWindow.setText('Lanzaste una Safari Ball!');
    this._waitCount = 30;
    this._captureShakes = 0;
    var wild = PMZ.Battle._wildPokemon;
    var result = PMZ.Safari.calcCapture(wild, this._safariBaitCount, this._safariRockCount);
    this._captureResult = result;
    this._state = 'safariBall';
};

Scene_PMZ_Battle.prototype.updateSafariBall = function() {
    if (!this._captureStep) this._captureStep = 0;
    if (!this._ballSprite) {
        this.createCaptureSprite();
        this._ballSprite.visible = false;
    }
    var ball = this._ballSprite;
    var ws = this._wildSprite;
    if (!ws) this._captureStep = 7;
    if (!this._captureResult) {
        this.afterSafariAction();
        return;
    }
    switch (this._captureStep) {
        case 0:
            var sbmp = PMZ.ItemIcons.getBitmap('safariball', null);
            if (sbmp) ball.bitmap = sbmp;
            ball.scale.x = ball.scale.y = 1;
            ball.anchor.x = 0.5;
            ball.anchor.y = 0.5;
            if (ball.bitmap && ball.bitmap.isReady && ball.bitmap.isReady() && ball.bitmap.width > 0) {
                var s = Math.min(1, 58 / ball.bitmap.width);
                ball.scale.x = ball.scale.y = s;
            }
            ball.rotation = 0;
            ball.opacity = 255;
            ball.x = ws.x + (ws.bitmap ? ws.bitmap.width * ws.scale.x / 2 : 0);
            ball.y = ws.y + (ws.bitmap ? ws.bitmap.height * ws.scale.y / 2 : 0) - 40;
            ball.visible = true;
            this._wildHP.hide();
            this._msgWindow.setText('...');
            this._captureStep = 1; this._captureShakes = 0; this._waitCount = 25;
            break;
        case 1:
            this._resetSprite(ws);
            ws.visible = false;
            ball.y = Math.floor(Graphics.boxHeight * 0.55) - 30;
            this._beginTween(ball, { y: ball.y + 40 }, 14, { easing: 'outBounce' });
            this._captureStep = 2; this._waitCount = 20;
            break;
        case 2:
            this._captureShakes++;
            if (this._captureShakes <= this._captureResult.shakes) {
                this._msgWindow.setText('Shake ' + this._captureShakes + '...');
                ball.rotation = 0;
                this._beginTween(ball, { rotation: this._captureShakes % 2 === 1 ? 0.35 : -0.35 }, 6, {
                    easing: 'outQuad', yoyo: true, duration: 6
                });
                this._waitCount = 26;
            } else { this._captureStep = 3; this._waitCount = 10; }
            break;
        case 3:
            if (this._captureResult.captured) { this._captureStep = 4; this._waitCount = 10; }
            else { this._captureStep = 5; this._waitCount = 10; }
            break;
        case 4:
            this._msgWindow.setText('Atrapado! ' + PMZ.Battle._wildPokemon.name + ' fue capturado!');
            this._spawnImpact(ball, '#f8d030', { cx: ball.x, cy: ball.y });
            this._captureStep = 6; this._waitCount = 50;
            break;
        case 5:
            ball.scale.x = ball.scale.y = 1;
            this._beginTween(ball, { scaleX: 1.6, scaleY: 1.6, opacity: 0 }, 14, { easing: 'outQuad' });
            this._resetSprite(ws);
            ws.visible = true;
            this._wildHP.show();
            this._captureStep = 7;
            this._msgWindow.setText('Oh no! El Pokemon se escapo!');
            this._waitCount = 40;
            break;
        case 6:
            this._captureStep = 0;
            var wild = PMZ.Battle._wildPokemon;
            if (wild) {
                if (!PMZ.Party.add(wild)) PMZ.PC.deposit(wild);
                this._msgWindow.setText(wild.name + ' fue capturado!');
            }
            this._resetSprite(ball);
            ball.visible = false;
            this._waitCount = 50;
            this._state = 'endBattle';
            break;
        case 7:
            this._resetSprite(ball);
            ball.visible = false;
            this._captureStep = 0;
            this.afterSafariAction();
            break;
    }
};

Scene_PMZ_Battle.prototype.safariThrowBait = function() {
    this._safariWindow.hide();
    this._safariWindow.deactivate();
    this._safariBaitCount++;
    this._msgWindow.setText('Lanzaste cebo! El Pokemon se vuelve mas facil de atrapar.');
    this._waitCount = 40;
    this._state = 'safariBait';
};

Scene_PMZ_Battle.prototype.updateSafariBait = function() {
    if (this._waitCount > 0) return;
    this.afterSafariAction();
};

Scene_PMZ_Battle.prototype.safariThrowRock = function() {
    this._safariWindow.hide();
    this._safariWindow.deactivate();
    this._safariRockCount++;
    this._msgWindow.setText('Lanzaste una piedra! El Pokemon se enfurece.');
    this._waitCount = 40;
    this._state = 'safariRock';
};

Scene_PMZ_Battle.prototype.updateSafariRock = function() {
    if (this._waitCount > 0) return;
    this.afterSafariAction();
};

Scene_PMZ_Battle.prototype.afterSafariAction = function() {
    var wild = PMZ.Battle._wildPokemon;
    if (!wild || PMZ.Pokemon.isFainted(wild)) { this._state = 'endBattle'; return; }

    // Check flee
    var flee = Math.random() * 100 < PMZ.Safari.fleeChance(wild, this._safariBaitCount);
    if (flee) {
        this._msgWindow.setText(wild.name + ' huyo!');
        this._waitCount = 40;
        this._state = 'endBattle';
        return;
    }

    // Check steps
    var stepResult = PMZ.Safari.stepCheck();
    if (stepResult.over) {
        this._msgWindow.setText(stepResult.msg);
        this._waitCount = 50;
        this._state = 'endBattle';
        return;
    }

    this.showCommandWindow();
};

// ============================================================================
// Double battle system + speed-based turn order
// ============================================================================
Scene_PMZ_Battle.prototype._buildActionQueue = function() {
    // La logica de orden de turnos vive en PMZ.BattleCore (testeable sin graficos)
    this._actionQueue = PMZ.BattleCore.buildActionQueue({
        player: PMZ.Battle._playerPokemon,
        player2: PMZ.Battle._playerPokemon2,
        enemy: PMZ.Battle._wildPokemon,
        enemy2: PMZ.Battle._wildPokemon2,
        isDouble: PMZ.Battle._doubleBattle,
        playerAction: this._playerAction,
        playerTarget: this._playerTarget,
        playerAction2: this._playerAction2,
        playerTarget2: this._playerTarget2,
        enemyAction: this._enemyAction,
        enemyAction2: this._enemyAction2
    });
    this._actionIndex = 0;
};

Scene_PMZ_Battle.prototype._executeNextAction = function() {
    if (this._actionIndex >= this._actionQueue.length) {
        // Queue done, end-of-turn
        this._state = 'playerCommand';
        this._actionQueue = null;
        this._actionIndex = 0;
        this._playerAction = null;
        this._playerTarget = null;
        this._playerAction2 = null;
        this._playerTarget2 = null;
        this._enemyAction = null;
        this._enemyAction2 = null;
        this._currentAttacker = null;
        this._currentTarget = null;
        this._waitCount = 10;
        return;
    }
    var action = this._actionQueue[this._actionIndex];
    this._actionIndex++;
    if (!action || !action.attacker || PMZ.Pokemon.isFainted(action.attacker)) {
        this._waitCount = 5;
        return;
    }

    // Set up the battle state for this action
    if (action.isPlayer) {
        this._currentAttacker = action.attacker;
        this._playerMoveData = action.move;
        this._moveData = PMZ.Data.move(action.move.key);
        this._currentTarget = action.target;
        this._state = 'playerAttack';
        this._attackStep = 0;
        this._waitCount = 10;
    } else {
        this._currentAttacker = action.attacker;
        this._enemyMoveData = action.move;
        this._currentTarget = action.target;
        this._state = 'opponentAttack';
        this._enemyStep = 0;
        this._waitCount = 10;
    }
};

// Helper: all wild/trainer enemies fainted (respects double battle)
Scene_PMZ_Battle.prototype.allEnemiesFainted = function() {
    var wp = PMZ.Battle._wildPokemon;
    var wp2 = PMZ.Battle._wildPokemon2;
    if (wp && !PMZ.Pokemon.isFainted(wp)) return false;
    if (PMZ.Battle._doubleBattle && wp2 && !PMZ.Pokemon.isFainted(wp2)) return false;
    return true;
};

// Resolve state after end-of-turn effects (weather/leech/bind/bide).
// Checks for faints and routes to victory, trainerSendOut, or playerCommand.
// FIX: previous code only had `break;` after these effects, leaving state as
// 'opponentAttack' with _enemyStep=0, causing the opponent to attack again.
Scene_PMZ_Battle.prototype._resolveEndTurnState = function() {
    // Veredicto de fin de turno calculado en PMZ.BattleCore
    var verdict = PMZ.BattleCore.resolveEndTurn();
    if (verdict === 'defeat') this._defeatOccurred = true;
    if (verdict === 'trainerSendOut') this._waitCount = 30;
    if (verdict === 'playerCommand') this.showCommandWindow();
    console.log('[PMZ][EndTurn] -> ' + verdict);
    return verdict;
};

// Target selection for double battle
Scene_PMZ_Battle.prototype.updatePlayerTargetSelect = function() {
    if (!this._targetSelectStep) this._targetSelectStep = 0;
    switch (this._targetSelectStep) {
        case 0:
            var targets = [];
            if (PMZ.Battle._wildPokemon && !PMZ.Pokemon.isFainted(PMZ.Battle._wildPokemon))
                targets.push(PMZ.Battle._wildPokemon);
            if (PMZ.Battle._wildPokemon2 && !PMZ.Pokemon.isFainted(PMZ.Battle._wildPokemon2))
                targets.push(PMZ.Battle._wildPokemon2);
            if (targets.length === 0) {
                this._playerTarget = PMZ.Battle._wildPokemon;
                this._targetSelectStep = 2;
                break;
            }
            if (!this._targetWindow) {
                this._targetWindow = new Window_PMZ_TargetSelect(0, Math.floor(Graphics.boxHeight * 0.72), Graphics.boxWidth, Math.floor(Graphics.boxHeight * 0.28));
                this._targetWindow.setHandler('ok', this._onTargetSelected.bind(this));
                this._targetWindow.setHandler('cancel', function() {
                    this._targetWindow.hide();
                    this._targetWindow.deactivate();
                    this._targetSelectStep = 0;
                    this._state = 'playerCommand';
                }.bind(this));
                this.addWindow(this._targetWindow);
            }
            this._targetWindow.setTargets(targets);
            this._targetWindow.show();
            this._targetWindow.activate();
            this._targetSelectStep = 1;
            break;
        case 1:
            // Waiting for user to select a target
            break;
    }
};

Scene_PMZ_Battle.prototype._onTargetSelected = function() {
    var target = this._targetWindow.selectedTarget();
    this._targetWindow.hide();
    this._targetWindow.deactivate();
    if (this._targetForSlot === 1) {
        this._playerTarget = target;
        // If double, now ask for second pokemon's action
        if (PMZ.Battle._doubleBattle && !this._playerAction2) {
            this._targetForSlot = 2;
            this._waitCount = 10;
            this._state = 'playerCommand';
            return;
        }
    } else {
        this._playerTarget2 = target;
    }
    // Build queue and execute
    this._aiChooseActions();
    this._buildActionQueue();
    this._state = 'executeQueue';
};

Scene_PMZ_Battle.prototype._aiChooseActions = function() {
    // Logica de seleccion de movimiento/objetivo en PMZ.BattleCore
    var acts = PMZ.BattleCore.chooseEnemyActions();
    this._enemyAction = acts.enemyAction;
    this._enemyAction2 = acts.enemyAction2;
};

Scene_PMZ_Battle.prototype.updateExecuteQueue = function() {
    this._executeNextAction();
};

// End-of-turn weather tick is handled inline in the opponentAttack state case 2.

Scene_PMZ_Battle.prototype.updateIntro = function() {
    if (!this._introStep) this._introStep = 0;

    switch (this._introStep) {
        case 0:
            if (this._safariMode) {
                this._introStep = 2;
                this._waitCount = 10;
                break;
            }
            var player = PMZ.Battle._playerPokemon;
            var wild = PMZ.Battle._wildPokemon;
            var abilityMsg = '';

            // Entry abilities via hook (Intimidate, etc.)
            if (PMZ.Abilities && wild && player) {
                var res = PMZ.Abilities.triggerHook('onEntry', { attacker: wild, defender: player });
                for (var ei = 0; ei < res.length; ei++) {
                    if (res[ei] && res[ei].msg) abilityMsg = res[ei].msg;
                }
                var res2 = PMZ.Abilities.triggerHook('onEntry', { attacker: player, defender: wild });
                for (var ei2 = 0; ei2 < res2.length; ei2++) {
                    if (res2[ei2] && res2[ei2].msg) abilityMsg = (abilityMsg ? abilityMsg + ' ' : '') + res2[ei2].msg;
                }
            }

            this._introAbilityMsg = abilityMsg;
            this._introStep = 1;
            if (abilityMsg) {
                this._msgWindow.setText(abilityMsg);
                this._waitCount = 40;
            } else {
                this._waitCount = 10;
            }
            break;

        case 1:
            if (PMZ.Weather && PMZ.Weather._weather !== 'none') {
                PMZ.Weather.applyToBattleScene(this);
                this._introStep = 2;
                this._waitCount = 40;
            } else {
                this._introStep = 2;
                this._waitCount = 10;
            }
            break;

        case 2:
            this._introStep = 0;
            this._introAbilityMsg = '';
            this.showCommandWindow();
            break;
    }
};

Scene_PMZ_Battle.prototype.updatePlayerCommand = function() {
    if (!this._cmdWindow.visible) {
        this.showCommandWindow();
    }
};

Scene_PMZ_Battle.prototype.updateShowCommand = function() {
    this.showCommandWindow();
};

Scene_PMZ_Battle.prototype.onCommandOk = function() {
    console.log('[PMZ] onCommandOk called, index:', this._cmdWindow.index());
    var index = this._cmdWindow.index();
    var showCapture = this._cmdWindow._showCapture;

    if (showCapture && index === 3) {
        // Ball option - opens bag filtered to balls
        this.showBag('ball');
        return;
    }

    // Adjust index: if showCapture, Ball is at 3, Run at 4
    var adjusted = showCapture ? (index < 3 ? index : (index === 3 ? -1 : 0)) : index;
    // For Ball option, adjusted would be 0 + extra; for Run, 3
    // Let's map them explicitly
    switch (index) {
        case 0: this.showFight(); break;
        case 1: this.showBag(); break;
        case 2: this.showParty(); break;
        case 4: this.tryFlee(); break;
        case 3:
            if (!showCapture) this.tryFlee();
            // else already handled above
            break;
    }
};

Scene_PMZ_Battle.prototype.showBag = function(filter) {
    var bag = $gamePMZ.itemBag();
    var items = [];
    for (var key in bag) {
        if (bag.hasOwnProperty(key)) {
            var iData = PMZ.Data.item(key);
            if (!iData) continue;
            if (filter === 'ball') {
                if (iData.type !== 'ball') continue;
            } else {
                if (iData.type !== 'medicine' && iData.type !== 'battle' && iData.effect !== 'escape') continue;
            }
            items.push({ key: key, count: bag[key] });
        }
    }

    this._bagWindow.setItems(items);
    this._cmdWindow.hide();
    this._cmdWindow.deactivate();
    this._bagWindow.show();
    this._bagWindow.activate();
    this._msgWindow.setText('Que objeto usar?');
    this._state = 'subMenu';
};

Scene_PMZ_Battle.prototype.onCommandCancel = function() {
    SoundManager.playBuzzer();
};

Scene_PMZ_Battle.prototype.showFight = function() {
    var player;
    if (PMZ.Battle._doubleBattle && this._playerAction && !this._playerAction2) {
        player = PMZ.Battle._playerPokemon2 || PMZ.Battle._playerPokemon;
    } else {
        player = PMZ.Battle._playerPokemon;
    }
    this._fightWindow.setMoves(player.moves, player);
    this._cmdWindow.hide();
    this._cmdWindow.deactivate();
    this._fightWindow.show();
    this._fightWindow.activate();
    this._msgWindow.setText('Selecciona un movimiento');
    this._state = 'subMenu';
};

Scene_PMZ_Battle.prototype.onFightOk = function() {
    var mech = this._fightWindow.getSelectedMechanic();
    if (mech) {
        this.activateMechanic(mech);
        return;
    }

    var player;
    if (PMZ.Battle._doubleBattle && this._playerAction && !this._playerAction2) {
        player = PMZ.Battle._playerPokemon2 || PMZ.Battle._playerPokemon;
    } else {
        player = PMZ.Battle._playerPokemon;
    }

    // Obedience check (badge-based level cap)
    if (player && !PMZ.Badges.obeyCheck(player)) {
        if (Math.random() < 0.5) {
            this._fightWindow.hide();
            this._fightWindow.deactivate();
            this._msgWindow.setText(player.name + ' no te obedece!');
            this._waitCount = 40;
            this._state = 'opponentAttack';
            return;
        }
    }

    // Check if player can act due to status
    if (!PMZ.Status.canAct(player)) {
        this._fightWindow.hide();
        this._fightWindow.deactivate();
        var statusMsg = '';
        if (player.status === 'sleep') statusMsg = player.name + ' esta dormido!';
        else if (player.status === 'freeze') statusMsg = player.name + ' esta congelado!';
        else if (player.status === 'paralyze') {
            this._msgWindow.setText(player.name + ' esta paralizado! No puede moverse!');
            this._waitCount = 30;
            this._state = 'opponentAttack';
            return;
        }
        this._msgWindow.setText(statusMsg);
        this._waitCount = 40;
        this._state = 'opponentAttack';
        return;
    }

    // Confusion self-hit check
    var confDmg = this.checkConfusionHit(player);
    if (confDmg) {
        this._fightWindow.hide();
        this._fightWindow.deactivate();
        this._msgWindow.setText(player.name + ' se golpea por confusion!');
        this._getTargetHP(player).refresh();
        this._waitCount = 40;
        this._state = 'opponentAttack';
        return;
    }

    var move = this._fightWindow.getMove();
    if (!move || move.pp <= 0) {
        this._msgWindow.setText('Sin PP!');
        this._waitCount = 30;
        return;
    }

    move.pp--;
    this._moveData = PMZ.Data.move(move.key);
    this._fightWindow.hide();
    this._fightWindow.deactivate();
    this._msgWindow.setText('');

    if (PMZ.Battle._doubleBattle) {
        // Store action for turn queue
        if (!this._playerAction) {
            this._playerAction = move;
            this._targetForSlot = 1;
            this._playerTarget = null;
            this._targetSelectStep = 0;
            this._state = 'playerTargetSelect';
        } else {
            this._playerAction2 = move;
            this._targetForSlot = 2;
            this._playerTarget2 = null;
            this._targetSelectStep = 0;
            this._state = 'playerTargetSelect';
        }
        this._waitCount = 10;
    } else {
        // Single battle: traditional flow with speed order
        this._state = 'playerAttack';
        this._attackStep = 0;
        this._waitCount = 10;
    }
};

Scene_PMZ_Battle.prototype.activateMechanic = function(mech, pkmn) {
    if (!pkmn) {
        if (PMZ.Battle._doubleBattle && this._playerAction && !this._playerAction2) {
            pkmn = PMZ.Battle._playerPokemon2 || PMZ.Battle._playerPokemon;
        } else {
            pkmn = PMZ.Battle._playerPokemon;
        }
    }
    if (!pkmn || !mech) return;

    var result = PMZ.Battle.Mechanics.activate(pkmn, mech.key);
    if (result) {
        var meta = PMZ.Battle.Mechanics.get(mech.key) || {};
        var animColor = meta.animColor || '#a0d8ff';
        var sprite = this._getTargetSprite(pkmn);

        // Flash suave de pantalla tintado con el color de la mecanica
        try {
            this._flashSprite.bitmap = this._flashSprite.bitmap || new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
            this._flashSprite.bitmap.fillRect(0, 0, Graphics.boxWidth, Graphics.boxHeight, animColor);
            this._flashSprite.opacity = 220;
            this._beginTween(this._flashSprite, { opacity: 0 }, 24, { easing: 'outQuad' });
        } catch (e) {
            console.error('[PMZ] Mechanic flash error:', e.message);
        }

        // Impacto con el color de la mecanica centrado en el pokemon
        var applyForm = function(s) {
            if (!s) return;
            var oSX = s.scale.x, oSY = s.scale.y;
            this._spawnImpact(s, animColor);
            // El sprite viejo pulsa; al terminar el pulso se aplica la nueva forma
            this._beginTween(s, { scaleX: oSX * 1.3, scaleY: oSY * 1.3 }, 9, {
                easing: 'outQuad',
                onComplete: function() {
                    s.scale.x = oSX;
                    s.scale.y = oSY;
                    s.setPokemon(pkmn, true);
                    s.visible = true;
                }
            });
            // Rayos ascendentes: burbujas blancas que suben desde el pokemon
            this._initFX();
            for (var i = 0; i < 5; i++) {
                var sp = new Sprite();
                sp.bitmap = new Bitmap(10, 10);
                sp.bitmap.drawCircle(5, 5, 5, i % 2 === 0 ? '#ffffff' : animColor);
                sp.x = s.x + (s.bitmap ? s.bitmap.width * s.scale.x / 2 : 0) + (Math.random() * 60 - 30);
                sp.y = s.y + (s.bitmap ? s.bitmap.height * s.scale.y / 2 : 0) - 10;
                this.addChild(sp);
                this._fxSprites.push(sp);
                this._beginTween(sp, { y: sp.y - 70 - Math.random() * 40 }, 18 + Math.random() * 8, { easing: 'outQuad' });
            }
        }.bind(this);

        if (sprite) {
            applyForm(sprite);
        }

        var msg = mech.message ? mech.message.replace('{name}', pkmn.name) : pkmn.name + ' activo ' + mech.name + '!';
        this._msgWindow.setText(msg);
        // La nueva forma se aplica al terminar el pulso (ver applyForm); solo se
        // refrescan el HP si el sprite no pudo animarse
        if (!sprite) {
            this._getTargetSprite(pkmn).setPokemon(pkmn, true);
        }
        this._getTargetHP(pkmn).setPokemon(pkmn);
        this._getTargetHP(pkmn).refresh();
        this._fightWindow.hide();
        this._fightWindow.deactivate();
        this._waitCount = 70;
        if (PMZ.Battle._doubleBattle) {
            if (!this._playerAction) {
                this._playerAction = { _mechanic: true };
            } else {
                this._playerAction2 = { _mechanic: true };
            }
        }
        this._state = 'playerCommand';
    }
};

Scene_PMZ_Battle.prototype.onFightCancel = function() {
    this._fightWindow.hide();
    this._fightWindow.deactivate();
    this.showCommandWindow();
};

Scene_PMZ_Battle.prototype.updatePlayerAttack = function() {
    if (!this._attackStep) this._attackStep = 0;

    var player = this._currentAttacker || PMZ.Battle._playerPokemon;
    var target = this._currentTarget || this._playerTarget || PMZ.Battle._wildPokemon;
    var move = this._moveData;

    // Skip the early-fainted check when _attackStep > 0; case 3 handles fainted targets
    // properly with trainer-send-out logic. The check was prematurely routing to 'victory'
    // for trainer battles, skipping the second trainer Pokemon.
    if (this._attackStep === 0 && (!target || PMZ.Pokemon.isFainted(target))) {
        if (this.allEnemiesFainted()) {
            this._state = 'victory';
            this._waitCount = 20;
        } else {
            this._state = 'executeQueue';
            this._waitCount = 5;
        }
        return;
    }

    switch (this._attackStep) {
        case 0:
            this._msgWindow.setText(player.name + ' uso ' + move.name + '!');
            this._attackStep = 1;
            this._waitCount = 35;
            break;

        case 1:
            // Play animation on correct sprite (el flash lo maneja playMoveAnimation)
            var targetSprite = this._getTargetSprite(target);
            this.playMoveAnimation(move, targetSprite, this._getTargetSprite(player));
            this._attackStep = 2;
            this._waitCount = 5;
            break;

        case 2:
            // Resolucion del ataque (dano, efectos, objetos) en PMZ.BattleCore
            var res = PMZ.BattleCore.executeMove(player, target, move, {
                verbose: true,
                trackLastDamage: true
            });
            this._lastDamageTaken = res.lastDamageTaken;
            this._playerHP.refresh();
            this._getTargetHP(target).animateHp();

            if (res.miss || res.protected) {
                this._msgWindow.setText(res.msg);
                this._attackStep = 3;
                this._waitCount = 30;
                break;
            }

            this._msgWindow.setText(res.msg);

            // Multi-hit handling via EffectRegistry
            if (!this._multiHitSteps) {
                var mh = PMZ.Effects.getHitParams(move.effect, player);
                if (mh) {
                    this._multiHitSteps = { total: mh, current: 1 };
                    this._msgWindow.setText('Golpe ' + this._multiHitSteps.current + '!');
                    this._attackStep = 1;
                    this._waitCount = 20;
                    break;
                }
            }
            if (this._multiHitSteps) {
                this._multiHitSteps.current++;
                if (this._multiHitSteps.current <= this._multiHitSteps.total) {
                    this._msgWindow.setText('Golpe ' + this._multiHitSteps.current + '!');
                    this._attackStep = 1;
                    this._waitCount = 20;
                    break;
                }
                this._multiHitSteps = null;
            }
            this._attackStep = 3;
            this._waitCount = 45;
            break;

        case 3:
            this._attackStep = 0;
            if (PMZ.Pokemon.isFainted(target)) {
                this._msgWindow.setText(target.name + ' se debilito!');
                this._animateFaint(this._getTargetSprite(target));
                if (target && target.species) PMZ.Battle.addDefeatedSpecies(target.species);
                this._waitCount = 40;
                console.log('[PMZ] updatePlayerAttack step3 fainted target, trainer=' + PMZ.Battle.isTrainerBattle() + ' allFainted=' + this.allEnemiesFainted());
                if (PMZ.Battle.isTrainerBattle()) {
                    this._state = 'trainerSendOut';
                    this._enemyNextTimer = 30;
                } else if (PMZ.Config.isOneShotCapture() && !this._safariMode) {
                    this._state = 'capturePrompt';
                } else if (this._actionQueue && this._actionIndex < this._actionQueue.length) {
                    this._state = 'executeQueue';
                } else if (this.allEnemiesFainted()) {
                    this._state = 'victory';
                } else {
                    this._state = 'executeQueue';
                }
            } else {
                // Queue-based: finish this action, continue queue
                if (this._actionQueue) {
                    this._state = 'executeQueue';
                    break;
                }
                // Opponent end-of-turn ticks before they attack
                var oppTickR = PMZ.Status.tick(target);
                if (oppTickR.msg) {
                    this._msgWindow.setText(oppTickR.msg);
                    this._wildHP.refresh();
                    if (PMZ.Pokemon.isFainted(target)) {
                        this._waitCount = 30;
                        if (PMZ.Battle.isTrainerBattle()) {
                            this._state = 'trainerSendOut';
                            this._enemyNextTimer = 30;
                        } else if (PMZ.Config.isOneShotCapture() && !this._safariMode) {
                            this._state = 'capturePrompt';
                        } else if (this._actionQueue && this._actionIndex < this._actionQueue.length) {
                            this._state = 'executeQueue';
                        } else if (this.allEnemiesFainted()) {
                            this._state = 'victory';
                        } else {
                            this._state = 'executeQueue';
                        }
                        break;
                    }
                    this._waitCount = 40;
                    this._state = 'playerCommand';
                    break;
                }
                this._state = 'opponentAttack';
                this._waitCount = 10;
            }
            break;
    }
};

Scene_PMZ_Battle.prototype.updateOpponentAttack = function() {
    if (!this._enemyStep) this._enemyStep = 0;

    var target = this._currentTarget || this._enemyTarget || PMZ.Battle._playerPokemon;
    var attacker = this._currentAttacker || PMZ.Battle._wildPokemon;

    // Only check fainted target at start of turn; case 3 handles fainted targets
    if (this._enemyStep === 0 && (!target || PMZ.Pokemon.isFainted(target))) {
        this.checkDefeat();
        return;
    }

    if (!attacker || !attacker.moves || attacker.moves.length === 0) {
        this._state = 'playerCommand';
        this.showCommandWindow();
        return;
    }

    switch (this._enemyStep) {
        case 0:
            // Check if opponent can act due to status
            if (!PMZ.Status.canAct(attacker)) {
                var statusMsg = '';
                if (attacker.status === 'sleep') statusMsg = attacker.name + ' esta dormido!';
                else if (attacker.status === 'freeze') statusMsg = attacker.name + ' esta congelado!';
                else if (attacker.status === 'paralyze') statusMsg = attacker.name + ' esta paralizado!';
                this._msgWindow.setText(statusMsg);
                this._waitCount = 40;
                this._state = 'playerCommand';
                break;
            }

            // Confusion self-hit check for opponent
            var confDmg2 = this.checkConfusionHit(attacker);
            if (confDmg2) {
                this._msgWindow.setText(attacker.name + ' se golpea por confusion!');
                this._wildHP.refresh();
                this._waitCount = 40;
                this._state = 'playerCommand';
                break;
            }

            var availMoves = [];
            for (var mi = 0; mi < attacker.moves.length; mi++) {
                if (attacker.moves[mi].pp > 0) availMoves.push(attacker.moves[mi]);
            }
            if (availMoves.length === 0) {
                this._msgWindow.setText(attacker.name + ' no tiene movimientos!');
                this._waitCount = 40;
                this._enemyStep = 0;
                this._state = 'playerCommand';
                return;
            }

            this._enemyChosenMove = PMZ.AI.chooseMove(attacker, target, availMoves);
            this._enemyChosenMove.pp--;
            this._enemyMoveData = PMZ.Data.move(this._enemyChosenMove.key);

            if (!this._enemyMoveData) {
                this._enemyStep = 0;
                this._state = 'playerCommand';
                this.showCommandWindow();
                return;
            }

            this._msgWindow.setText(attacker.name + ' uso ' + this._enemyMoveData.name + '!');
            this._enemyStep = 1;
            this._waitCount = 35;
            break;

        case 1:
            this.playMoveAnimation(this._enemyMoveData, this._getTargetSprite(target), this._getTargetSprite(attacker));
            this._enemyStep = 2;
            this._waitCount = 5;
            break;

        case 2:
            // Resolucion del ataque enemigo (sin protect ni mensajes de efectividad)
            var eRes = PMZ.BattleCore.executeMove(attacker, target, this._enemyMoveData, {
                verbose: false,
                checkProtect: false,
                skipAccuracyIfStatus: true,
                trackLastDamage: false
            });
            this._lastDamageTaken = eRes.lastDamageTaken;
            this._playerHP.animateHp();
            this._getTargetHP(target).animateHp();
            if (eRes.miss) {
                this._msgWindow.setText(eRes.msg);
            } else if (eRes.ohkoFailed) {
                this._msgWindow.setText('Fallo!');
            } else if (this._enemyMoveData.category === 'status') {
                this._msgWindow.setText(eRes.msg || 'Pero no paso nada...');
            } else {
                this._msgWindow.setText(eRes.msg);
            }
            this._enemyStep = 3;
            this._waitCount = 45;
            break;

        case 3:
            this._enemyStep = 0;
            // Queue-based: continue queue
            if (this._actionQueue) {
                this._state = 'executeQueue';
                break;
            }
            if (PMZ.Pokemon.isFainted(target)) {
                this._msgWindow.setText(target.name + ' se debilito!');
                this._animateFaint(this._getTargetSprite(target));
                this._waitCount = 30;
                this.checkDefeat();
            } else {
                // End-of-turn effects (player side)
                var statusTickR = PMZ.Status.tick(target);
                if (statusTickR.msg) {
                    this._msgWindow.setText(statusTickR.msg);
                    this._playerHP.refresh();
                    if (PMZ.Pokemon.isFainted(target)) {
                        this._waitCount = 30;
                        this.checkDefeat();
                        break;
                    }
                    this._waitCount = 40;
                    this._state = 'playerCommand';
                    break;
                }
                // Opponent end-of-turn effects
                var oppTickR2 = PMZ.Status.tick(attacker);
                if (oppTickR2.msg) {
                    this._msgWindow.setText(oppTickR2.msg);
                    this._wildHP.refresh();
                    if (PMZ.Pokemon.isFainted(attacker)) {
                        this._waitCount = 30;
                        if (PMZ.Battle.isTrainerBattle()) {
                            this._state = 'trainerSendOut';
                            this._enemyNextTimer = 30;
                        } else if (PMZ.Config.isOneShotCapture() && !this._safariMode) {
                            this._state = 'capturePrompt';
                        } else if (this._actionQueue && this._actionIndex < this._actionQueue.length) {
                            this._state = 'executeQueue';
                        } else if (this.allEnemiesFainted()) {
                            this._state = 'victory';
                        } else {
                            this._state = 'executeQueue';
                        }
                        break;
                    }
                }
                var oppConsumed = PMZ.HoldItems.endOfTurn(attacker);
                if (oppConsumed.length > 0) {
                    var onames = oppConsumed.map(function(k) {
                        var d = PMZ.Data.item(k);
                        return d ? d.name : k;
                    });
                    this._msgWindow.setText(attacker.name + ' uso su ' + onames.join(', ') + '!');
                    this._wildHP.refresh();
                    this._waitCount = 50;
                    this._state = 'playerCommand';
                    break;
                }
                // End-of-turn held item effects (player side)
                var playerConsumed = PMZ.HoldItems.endOfTurn(target);
                if (playerConsumed.length > 0) {
                    var names = playerConsumed.map(function(k) {
                        var d = PMZ.Data.item(k);
                        return d ? d.name : k;
                    });
                    this._msgWindow.setText(target.name + ' uso su ' + names.join(', ') + '!');
                    this._playerHP.refresh();
                    this._waitCount = 50;
                    this._state = 'playerCommand';
                    break;
                }
                var allPoke = this._buildAllPokemonList();
                // Weather end-of-turn damage
                if (PMZ.Weather && PMZ.Weather._weather !== 'none') {
                    var wMsg = this._applyWeatherDamage(allPoke);
                    if (wMsg) {
                        this._msgWindow.setText(wMsg);
                        this._playerHP.refresh();
                        this._wildHP.refresh();
                        if (this._playerHP2) this._playerHP2.refresh();
                        if (this._wildHP2) this._wildHP2.refresh();
                        this._waitCount = 40;
                        this._state = this._resolveEndTurnState();
                        break;
                    }
                    PMZ.Weather.tick();
                }
                // Leech Seed end-of-turn drain
                var lsMsg = this._processLeechSeed(allPoke);
                if (lsMsg) {
                    this._msgWindow.setText(lsMsg);
                    this._playerHP.refresh();
                    this._wildHP.refresh();
                    if (this._playerHP2) this._playerHP2.refresh();
                    if (this._wildHP2) this._wildHP2.refresh();
                    var nextState = this._resolveEndTurnState();
                    this._waitCount = 40;
                    this._state = nextState;
                    break;
                }
                // Bind end-of-turn damage
                var bindMsg = this._processBindDamage(allPoke);
                if (bindMsg) {
                    this._msgWindow.setText(bindMsg);
                    this._playerHP.refresh();
                    this._wildHP.refresh();
                    if (this._playerHP2) this._playerHP2.refresh();
                    if (this._wildHP2) this._wildHP2.refresh();
                    this._waitCount = 40;
                    this._state = this._resolveEndTurnState();
                    break;
                }
                // Bide end-of-turn processing
                var bideMsg = this._processBide(allPoke);
                if (bideMsg) {
                    this._msgWindow.setText(bideMsg);
                    this._playerHP.refresh();
                    this._wildHP.refresh();
                    if (this._playerHP2) this._playerHP2.refresh();
                    if (this._wildHP2) this._wildHP2.refresh();
                    this._waitCount = 40;
                    this._state = this._resolveEndTurnState();
                    break;
                }
                this._state = 'playerCommand';
                this._waitCount = 10;
            }
            break;
    }
};

Scene_PMZ_Battle.prototype.checkDefeat = function() {
    var defeat = PMZ.BattleCore.resolveDefeat();
    if (defeat.defeated) {
        this._msgWindow.setText('Te has quedado sin Pokemon!');
        this._defeatOccurred = true;
        this._state = 'defeat';
        this._waitCount = 90;
    } else if (defeat.next) {
        var next = defeat.next;
        var fromTop = this._playerSprite.y < 0;
        this._playerHP.setPokemon(next);
        this._playerSprite.setPokemon(next, true);
        this._resetSprite(this._playerSprite);
        this._animateSendIn(this._playerSprite, fromTop);
        this._msgWindow.setText('Ve! ' + next.name + '!');
        this._waitCount = 40;
        this._state = 'playerCommand';
    }
};

Scene_PMZ_Battle.prototype.showBagOld = function() {
    this.showBag();
};

Scene_PMZ_Battle.prototype.onBagOk = function() {
    var selected = this._bagWindow.getSelected();
    if (!selected) { SoundManager.playBuzzer(); return; }

    var itemData = PMZ.Data.item(selected.key);
    if (!itemData) { SoundManager.playBuzzer(); return; }

    if (itemData.type === 'ball') {
        if (PMZ.Battle._doubleBattle) {
            this._captureTargetPending = { key: selected.key, data: itemData };
            this._bagWindow.hide();
            this._bagWindow.deactivate();
            var targets = [];
            if (PMZ.Battle._wildPokemon && !PMZ.Pokemon.isFainted(PMZ.Battle._wildPokemon))
                targets.push(PMZ.Battle._wildPokemon);
            if (PMZ.Battle._wildPokemon2 && !PMZ.Pokemon.isFainted(PMZ.Battle._wildPokemon2))
                targets.push(PMZ.Battle._wildPokemon2);
            this._targetWindow.setHandler('ok', function() {
                var target = this._targetWindow.selectedTarget();
                this._targetWindow.hide();
                this._targetWindow.deactivate();
                this._captureTargetPending = null;
                this.tryCapture(selected.key, itemData, target);
            }.bind(this));
            this._targetWindow.setHandler('cancel', function() {
                this._targetWindow.hide();
                this._targetWindow.deactivate();
                this._captureTargetPending = null;
                this._bagWindow.show();
                this._bagWindow.activate();
                this._state = 'subMenu';
            }.bind(this));
            this._targetWindow.setTargets(targets);
            this._targetWindow.show();
            this._targetWindow.activate();
            this._state = 'subMenu';
        } else {
            this.tryCapture(selected.key, itemData, PMZ.Battle._wildPokemon);
        }
        return;
    }

    if (itemData.effect === 'escape') {
        if (PMZ.Battle.isTrainerBattle()) {
            this._msgWindow.setText('No se puede usar en combates de entrenador!');
            this._waitCount = 30;
            return;
        }
        if (!PMZ.Battle._wildPokemon) {
            this._msgWindow.setText('No hay Pokemon salvaje.');
            this._waitCount = 30;
            return;
        }
        PMZ.Items.remove(selected.key, 1);
        this._bagWindow.hide();
        this._bagWindow.deactivate();
        this._msgWindow.setText('Huiste del combate!');
        this._state = 'flee';
        this._waitCount = 60;
        return;
    }

    var isHeal = itemData.effect === 'heal' || itemData.effect === 'full_heal' || itemData.effect === 'cure_status' || itemData.effect === 'cure_all_status' || itemData.effect === 'revive' || itemData.effect === 'restore_pp' || itemData.effect === 'restore_all_pp';
    var isStatBoost = itemData.effect === 'stat_boost';

    if (!isHeal && !isStatBoost) {
        SoundManager.playBuzzer();
        this._msgWindow.setText('No se puede usar aqui.');
        this._waitCount = 30;
        return;
    }

    if (PMZ.Battle._doubleBattle && (isHeal || isStatBoost)) {
        this._itemTargetPending = { key: selected.key, data: itemData, isHeal: isHeal };
        this._bagWindow.hide();
        this._bagWindow.deactivate();
        this._partyWindow.show();
        this._partyWindow.activate();
        this._partyWindow.select(0);
        this._msgWindow.setText('Usar en que Pokemon?');
        this._state = 'subMenu';
    } else if (isHeal) {
        this.useHealItem(selected.key, itemData);
    } else {
        this.useBattleItem(selected.key, itemData);
    }
};

Scene_PMZ_Battle.prototype.onBagCancel = function() {
    this._bagWindow.hide();
    this._bagWindow.deactivate();
    this.showCommandWindow();
};

Scene_PMZ_Battle.prototype.tryCapture = function(key, itemData) {
    this._bagWindow.hide();
    this._bagWindow.deactivate();
    var wild = PMZ.Battle._wildPokemon;
    if (!wild || PMZ.Pokemon.isFainted(wild)) {
        this._msgWindow.setText('No puedes capturar ahora.');
        this._waitCount = 30;
        this.showCommandWindow();
        return;
    }

    PMZ.Items.remove(key);

    this._usedBallKey = key;
    this._usedBallData = itemData;

    this._msgWindow.setText('Usaste ' + itemData.name + '!');
    this._waitCount = 30;
    this._captureShakes = 0;

    var result = PMZ.BattleCore.beginCapture(itemData, wild);

    this._captureResult = result;
    this._state = 'capture';
};

Scene_PMZ_Battle.prototype.updateCapture = function() {
    if (!this._captureStep) this._captureStep = 0;

    if (!this._ballSprite) {
        this.createCaptureSprite();
        this._ballSprite.visible = false;
    }
    var ball = this._ballSprite;
    var ws = this._getTargetSprite(PMZ.Battle._wildPokemon);
    if (!ws) this._captureStep = 7;
    if (!this._captureResult) {
        this._state = 'opponentAttack';
        this._enemyStep = 0;
        return;
    }

    switch (this._captureStep) {
        case 0:
            var itemData = this._usedBallData || PMZ.Data.item(this._usedBallKey);
            var bmp = PMZ.ItemIcons.getBitmap(this._usedBallKey, itemData);
            if (bmp) ball.bitmap = bmp;
            ball.scale.x = ball.scale.y = 1;
            var ws = this._getTargetSprite(PMZ.Battle._wildPokemon);
            if (!ws) ws = this._wildSprite;
            ball.anchor.x = 0.5;
            ball.anchor.y = 0.5;
            if (ball.bitmap && ball.bitmap.isReady && ball.bitmap.isReady() && ball.bitmap.width > 0) {
                var s = Math.min(1, 58 / ball.bitmap.width);
                ball.scale.x = ball.scale.y = s;
            }
            ball.rotation = 0;
            ball.opacity = 255;
            ball.x = ws.x + (ws.bitmap ? ws.bitmap.width * ws.scale.x / 2 : 0);
            ball.y = ws.y + (ws.bitmap ? ws.bitmap.height * ws.scale.y / 2 : 0) - 40;
            ball.visible = true;
            this._wildHP.hide();
            this._msgWindow.setText('...');
            this._captureStep = 1;
            this._captureShakes = 0;
            this._waitCount = 25;
            break;

        case 1:
            // El pokemon entra en la ball y esta cae al suelo con rebote
            this._resetSprite(ws);
            ws.visible = false;
            ball.y = Math.floor(Graphics.boxHeight * 0.55) - 30;
            this._beginTween(ball, { y: ball.y + 40 }, 14, { easing: 'outBounce' });
            this._captureStep = 2;
            this._waitCount = 20;
            break;

        case 2:
            this._captureShakes++;
            if (this._captureShakes <= this._captureResult.shakes) {
                this._msgWindow.setText('Shake ' + this._captureShakes + '...');
                ball.rotation = 0;
                this._beginTween(ball, { rotation: this._captureShakes % 2 === 1 ? 0.35 : -0.35 }, 6, {
                    easing: 'outQuad', yoyo: true, duration: 6
                });
                this._waitCount = 26;
            } else {
                this._captureStep = 3;
                this._waitCount = 10;
            }
            break;

        case 3:
            if (this._captureResult.captured) {
                this._captureStep = 4;
                this._waitCount = 10;
            } else {
                this._captureStep = 5;
                this._waitCount = 10;
            }
            break;

        case 4:
            this._msgWindow.setText('Atrapado! ' + PMZ.Battle._wildPokemon.name + ' fue capturado!');
            this._spawnImpact(ball, '#f8d030', { cx: ball.x, cy: ball.y });
            this._captureStep = 6;
            this._waitCount = 50;
            break;

        case 5:
            // La ball se abre y el pokemon escapa
            ball.scale.x = ball.scale.y = 1;
            this._beginTween(ball, { scaleX: 1.6, scaleY: 1.6, opacity: 0 }, 14, { easing: 'outQuad' });
            this._resetSprite(ws);
            ws.visible = true;
            this._wildHP.show();
            this._captureStep = 7;
            this._msgWindow.setText('Oh no! El Pokemon se libero!');
            this._waitCount = 40;
            break;

        case 6:
            this._resetSprite(ball);
            ball.scale.x = ball.scale.y = 1;
            ball.visible = false;
            this._state = 'captured';
            this._captureStep = 0;
            this._waitCount = 10;
            break;

        case 7:
            this._resetSprite(ball);
            ball.scale.x = ball.scale.y = 1;
            ball.visible = false;
            this._captureStep = 0;
            this._state = 'opponentAttack';
            this._enemyStep = 0;
            this._waitCount = 10;
            break;
    }
};

Scene_PMZ_Battle.prototype.updateCaptured = function() {
    var wild = PMZ.Battle._wildPokemon;
    if (wild) {
        // Registro de captura (pokedex, equipo/PC, resultado) en PMZ.BattleCore
        var dest = PMZ.BattleCore.registerCaptured(wild);
        if (dest === 'pc') {
            this._msgWindow.setText(wild.name + ' fue enviado al PC.');
        } else {
            this._msgWindow.setText(wild.name + ' fue anadido al equipo.');
        }
    }
    this._captureSuccess = true;
    this._waitCount = 50;
    this._state = 'victory';
};

Scene_PMZ_Battle.prototype.useHealItem = function(key, itemData) {
    var player = PMZ.Battle._playerPokemon;
    if (!player) return;
    this.useHealItemOn(key, itemData, player);
};

Scene_PMZ_Battle.prototype.useHealItemOn = function(key, itemData, target) {
    if (!target) return;
    var result = PMZ.Items.useItem(key, target);
    if (result.success) {
        this._itemTargetPending = null;
        this._msgWindow.setText(result.msg);
        this._getTargetHP(target).refresh();
        this._bagWindow.hide();
        this._bagWindow.deactivate();
        this._partyWindow.hide();
        this._partyWindow.deactivate();
        this._waitCount = 40;
        this._state = 'opponentAttack';
        this._waitCount = 20;
    } else {
        this._msgWindow.setText(result.msg || 'No tiene efecto...');
        this._partyWindow.activate();
    }
};

// ============================================================================
// Move effects and status application
// ============================================================================
// AHORA: los efectos se resuelven via PMZ.Effects.run() que despacha al handler
// registrado segun el "type" del effect object (definidos en PMZ_Core.js).
// ============================================================================
Scene_PMZ_Battle.prototype.applyMoveEffects = function(attacker, defender, moveData, damage) {
    // Efectos de movimiento resueltos en PMZ.BattleCore
    return PMZ.BattleCore.applyMoveEffects(attacker, defender, moveData, damage);
};
// Play MZ database animation on a sprite
Scene_PMZ_Battle.prototype.playMoveAnimation = function(moveData, targetSprite, attackerSprite) {
    if (!moveData || !targetSprite) return;

    // Atacante: embestida hacia el objetivo (vuelve a su posicion)
    var atkSprite = attackerSprite || this._getTargetSprite(this._currentAttacker || PMZ.Battle._playerPokemon);
    if (atkSprite) {
        this._lungeSprite(atkSprite, targetSprite);
    }

    // Impacto centrado en el sprite del objetivo (aunque no haya animacion en el editor)
    var color = PMZ.Utils && PMZ.Utils.typeColor ? PMZ.Utils.typeColor(moveData.type) : '#ffffff';
    this._spawnImpact(targetSprite, color);

    // Flash breve tintado con el color del tipo
    this._flashSprite.bitmap = this._flashSprite.bitmap || new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
    this._flashSprite.bitmap.fillRect(0, 0, Graphics.boxWidth, Graphics.boxHeight, color);
    this._flashSprite.opacity = 190;
    this._beginTween(this._flashSprite, { opacity: 0 }, 20, { easing: 'outQuad' });

    // Animacion de la base de datos de MZ (si esta configurada) — ya se centra en el sprite
    var animId = moveData.animationId || 0;
    if (animId <= 0) {
        var typeAnims = {
            'fire': 1, 'water': 2, 'grass': 3, 'electric': 4,
            'psychic': 5, 'ice': 6, 'dragon': 7, 'dark': 8,
            'fighting': 9, 'flying': 10, 'poison': 11, 'ground': 12,
            'rock': 13, 'ghost': 14, 'normal': 15
        };
        animId = typeAnims[moveData.type] || 15;
    }
    if (typeof $dataAnimations !== 'undefined' && $dataAnimations[animId]) {
        var anim = new Sprite_Animation();
        var targets = [targetSprite];
        anim.setup(targets, $dataAnimations[animId], false, 0, null);
        // MZ posiciona los efectos asumiendo sprites con anchor (0.5, 1) y saca
        // el centro con point(0, -height/2). Nuestros sprites usan anchor (0,0),
        // asi que sobrescribimos el calculo para centrar en el sprite real.
        anim.targetSpritePosition = function(sprite) {
            var point = new Point(
                sprite.width * (0.5 - sprite.anchor.x),
                sprite.height * (0.5 - sprite.anchor.y)
            );
            if (this._animation.alignBottom) {
                point.x = sprite.width * (0.5 - sprite.anchor.x);
                point.y = sprite.height * (1 - sprite.anchor.y);
            }
            sprite.updateTransform();
            return sprite.worldTransform.apply(point);
        };
        this.addChild(anim);
        this._currentAnimation = anim;
    }
};

// ============================================================================
// Animaciones ligeras de batalla (PMZ_FX)
// ============================================================================
// Resuelve clave -> propiedad real del sprite (PIXI usa scale.x/scale.y)
function PMZ_FXProp(target, key, dir) {
    if (key === 'scaleX') return { obj: target.scale, prop: 'x', dir: dir };
    if (key === 'scaleY') return { obj: target.scale, prop: 'y', dir: dir };
    return { obj: target, prop: key, dir: dir };
}

function PMZ_Tween(target, props, duration, opts) {
    this.target = target;
    this.from = {};
    this.to = {};
    for (var k in props) {
        if (typeof props[k] === 'number') {
            var f = PMZ_FXProp(target, k, 1);
            this.from[k] = f.obj[f.prop];
            this.to[k] = props[k];
        }
    }
    this.duration = Math.max(1, duration || 30);
    this.t = 0;
    this.opts = opts || {};
    this.done = false;
    this.yoyo = this.opts.yoyo || false;
    this._returning = false;
}

PMZ_Tween.prototype._apply = function(e) {
    for (var k in this.to) {
        var f = PMZ_FXProp(this.target, k, 1);
        f.obj[f.prop] = this.from[k] + (this.to[k] - this.from[k]) * e;
    }
};

PMZ_Tween.prototype.update = function() {
    if (this.done) return true;
    if (this.yoyo && !this._returning && this.t >= this.duration) {
        this._apply(1);                       // completa la fase de ida
        var tt = this.to; this.to = this.from; this.from = tt; // fase de retorno
        this.t = 0;
        this._returning = true;
    }
    this.t++;
    var p = Math.min(1, this.t / this.duration);
    var e = p;
    var ease = this.opts.easing;
    if (ease === 'outCube') e = 1 - Math.pow(1 - p, 3);
    else if (ease === 'outQuad') e = 1 - (1 - p) * (1 - p);
    else if (ease === 'inQuad') e = p * p;
    else if (ease === 'inOutCubic') e = (p < 0.5) ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    else if (ease === 'outBack') { var c1 = 1.70158, c3 = c1 + 1; e = 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); }
    else if (ease === 'outBounce') { var n1 = 7.5625, d1 = 2.75; e = p < 1 / d1 ? n1 * p * p : p < 2 / d1 ? n1 * (p -= 1.5 / d1) * p + 0.75 : p < 2.5 / d1 ? n1 * (p -= 2.25 / d1) * p + 0.9375 : n1 * (p -= 2.625 / d1) * p + 0.984375; }
    this._apply(e);
    if (this.t >= this.duration && (!this.yoyo || this._returning)) {
        this._apply(1);
        if (this.opts.onComplete) this.opts.onComplete(this.target);
        this.done = true;
        return true;
    }
    return false;
};

Scene_PMZ_Battle.prototype._initFX = function() {
    if (!this._tweens) this._tweens = [];
    if (!this._fxSprites) this._fxSprites = [];
};

Scene_PMZ_Battle.prototype._beginTween = function(target, props, duration, opts) {
    this._initFX();
    var t = new PMZ_Tween(target, props, duration, opts);
    this._tweens.push(t);
    return t;
};

Scene_PMZ_Battle.prototype._advanceFX = function() {
    if (this._tweens && this._tweens.length) {
        this._tweens = this._tweens.filter(function(t) { return !t.update(); });
    }
    if (this._fxSprites && this._fxSprites.length) {
        var keeps = [];
        for (var i = 0; i < this._fxSprites.length; i++) {
            var s = this._fxSprites[i];
            s.update();
            s.opacity -= 24;
            s.scale.x *= 1.14;
            s.scale.y *= 1.14;
            s.rotation += 0.09;
            if (s.opacity > 0) { keeps.push(s); }
            else { try { this.removeChild(s); } catch (err) { } }
        }
        this._fxSprites = keeps;
    }
};

// Embestida: el atacante avanza hacia el objetivo y vuelve (yoyo)
Scene_PMZ_Battle.prototype._lungeSprite = function(atkSprite, targetSprite) {
    if (!atkSprite || atkSprite === targetSprite) return;
    this._initFX();
    var dx = targetSprite.x - atkSprite.x;
    var dy = targetSprite.y - atkSprite.y;
    var dist = Math.sqrt(dx * dx + dy * dy) || 1;
    var step = Math.min(60, dist * 0.35);
    var nx = dx / dist, ny = dy / dist;
    this._beginTween(atkSprite, { x: atkSprite.x + nx * step, y: atkSprite.y + ny * step }, 9, {
        easing: 'inQuad',
        yoyo: true,
        duration: 9
    });
    // Leve sacudida al impactar
    this._beginTween(atkSprite, { rotation: 0.12 }, 4, { easing: 'outQuad', yoyo: true, duration: 4 });
};

// Impacto: burbuja de color centrada en el sprite objetivo
// (opcional: forzar posición con opts.cx/opts.cy, útil si el sprite tiene anchor centrado)
Scene_PMZ_Battle.prototype._spawnImpact = function(targetSprite, color, opts) {
    if (!targetSprite) return;
    this._initFX();
    var size = 56;
    var sp = new Sprite();
    sp.bitmap = new Bitmap(size, size);
    var cx = size / 2, cy = size / 2;
    // Anillo exterior del color del tipo + nucleo blanco
    sp.bitmap.drawCircle(cx, cy, size / 2 - 2, color);
    sp.bitmap.drawCircle(cx, cy, size / 2 - 12, 'rgba(255,255,255,0.85)');
    sp.anchor.x = 0.5;
    sp.anchor.y = 0.5;
    if (opts && (opts.cx !== undefined || opts.cy !== undefined)) {
        sp.x = opts.cx !== undefined ? opts.cx : targetSprite.x;
        sp.y = opts.cy !== undefined ? opts.cy : targetSprite.y;
    } else {
        var bmpW = targetSprite.bitmap ? targetSprite.bitmap.width : 0;
        var bmpH = targetSprite.bitmap ? targetSprite.bitmap.height : 0;
        // Centro real del sprite (x,y es esquina top-left en el ancla por defecto)
        sp.x = targetSprite.x + (bmpW * targetSprite.scale.x) / 2;
        sp.y = targetSprite.y + (bmpH * targetSprite.scale.y) / 2;
    }
    sp.opacity = 230;
    sp.scale.x = 0.3;
    sp.scale.y = 0.3;
    this.addChild(sp);
    this._fxSprites.push(sp);
};

// Desmayo: el sprite se desploma, rota y se desvanece
Scene_PMZ_Battle.prototype._animateFaint = function(sprite) {
    if (!sprite) return;
    this._initFX();
    var origX = sprite.x, origY = sprite.y, origScaleX = sprite.scale.x, origScaleY = sprite.scale.y;
    var origRot = sprite.rotation, origOpacity = sprite.opacity;
    sprite._fxHome = { x: origX, y: origY, scaleX: origScaleX, scaleY: origScaleY, rotation: origRot, opacity: origOpacity };
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;
    sprite.x = origX + (sprite.bitmap ? sprite.bitmap.width * origScaleX / 2 : 0);
    sprite.y = origY + (sprite.bitmap ? sprite.bitmap.height * origScaleY : 0);
    this._beginTween(sprite, { scaleX: 0.3, scaleY: 0.3, rotation: 0.45, y: sprite.y + 26 }, 34, {
        easing: 'inQuad',
        onComplete: function() {
            sprite.visible = false;
            sprite.opacity = 0;
        }
    });
    this._beginTween(sprite, { opacity: 120 }, 26, { easing: 'inQuad' });
};

// Entrada: el pokemon cae desde arriba con rebote y aparece
Scene_PMZ_Battle.prototype._animateSendIn = function(sprite, fromTop) {
    if (!sprite) return;
    this._resetSprite(sprite);
    var startY = fromTop ? -80 : sprite.y - 60;
    sprite.y = startY;
    sprite.opacity = 140;
    sprite.scale.x = sprite.scale.y = 0.4;
    this._beginTween(sprite, { y: sprite.y + 60, scaleX: 1, scaleY: 1, opacity: 255 }, 16, {
        easing: 'outBounce'
    });
    this._beginTween(sprite, { rotation: -0.06 }, 8, { easing: 'outQuad', yoyo: true, duration: 8 });
};

// Cancela cualquier tween activo que apunte al sprite dado (para reemplazos)
Scene_PMZ_Battle.prototype._cancelTweens = function(target) {
    if (!target || !this._tweens) return;
    var kept = [];
    for (var i = 0; i < this._tweens.length; i++) {
        if (this._tweens[i].target !== target) kept.push(this._tweens[i]);
    }
    this._tweens = kept;
};

// Restaura la transformacion base de un sprite de batalla
Scene_PMZ_Battle.prototype._resetSprite = function(sprite) {
    if (!sprite) return;
    this._cancelTweens(sprite);
    sprite.visible = true;
    sprite.opacity = 255;
    sprite.rotation = 0;
    sprite.anchor.x = 0;
    sprite.anchor.y = 0;
    if (sprite._fxHome) {
        var h = sprite._fxHome;
        sprite.x = h.x;
        sprite.y = h.y;
        sprite.scale.x = h.scaleX;
        sprite.scale.y = h.scaleY;
        sprite.opacity = h.opacity;
        sprite._fxHome = null;
    } else {
        sprite.scale.x = Math.max(sprite.scale.x, 0);
        sprite.scale.y = Math.max(sprite.scale.y, 0);
    }
};

Scene_PMZ_Battle.prototype.applyContactAbilities = function(attacker, defender, moveData) {
    if (moveData.category === 'status') return '';
    var msg = '';
    return msg;
};

// Check if a Pokémon hits itself due to confusion before acting
Scene_PMZ_Battle.prototype.checkConfusionHit = function(pokemon) {
    // Autogolpe por confusion resuelto en PMZ.BattleCore
    return PMZ.BattleCore.checkConfusionHit(pokemon);
};

Scene_PMZ_Battle.prototype.useBattleItem = function(key, itemData) {
    var player = PMZ.Battle._playerPokemon;
    if (!player || PMZ.Pokemon.isFainted(player)) return;
    this.useBattleItemOn(key, itemData, player);
};

Scene_PMZ_Battle.prototype.useBattleItemOn = function(key, itemData, target) {
    if (!target || PMZ.Pokemon.isFainted(target)) return;

    var wasUsed = false;

    if (itemData.effect === 'stat_boost' && itemData.stat) {
        var change = PMZ.Battle.boostStat(target, itemData.stat, itemData.stages || 1);
        if (change !== 0) {
            var statNames = { attack: 'Ataque', defense: 'Defensa', spAttack: 'At.Esp.', spDefense: 'Def.Esp.', speed: 'Velocidad', accuracy: 'Precision', evasion: 'Evasión' };
            var sname = statNames[itemData.stat] || itemData.stat;
            this._msgWindow.setText(target.name + ': ' + sname + ' subio!');
            wasUsed = true;
        }
    }

    if (itemData.effect === 'dire_hit') {
        target._focusEnergy = true;
        this._msgWindow.setText('Golpe critico aumenta!');
        wasUsed = true;
    }

    if (wasUsed) {
        this._itemTargetPending = null;
        PMZ.Items.remove(key);
        this._getTargetHP(target).refresh();
        this._bagWindow.hide();
        this._bagWindow.deactivate();
        this._partyWindow.hide();
        this._partyWindow.deactivate();
        this._waitCount = 40;
        this._state = 'opponentAttack';
        this._waitCount = 20;
    } else {
        this._msgWindow.setText('No tiene efecto...');
        this._partyWindow.activate();
    }
};

Scene_PMZ_Battle.prototype.showParty = function() {
    this._cmdWindow.hide();
    this._cmdWindow.deactivate();
    this._partyWindow.show();
    this._partyWindow.activate();
    this._partyWindow.select(0);
    this._msgWindow.setText('Elige un Pokemon');
    this._state = 'subMenu';
};

Scene_PMZ_Battle.prototype.onPartyOk = function() {
    var index = this._partyWindow.index();
    var pkmn = $gamePMZ.party()[index];
    if (!pkmn) { SoundManager.playBuzzer(); return; }

    // Item target selection in double battle
    if (this._itemTargetPending) {
        if (this._itemTargetPending.isHeal) {
            this.useHealItemOn(this._itemTargetPending.key, this._itemTargetPending.data, pkmn);
        } else {
            this.useBattleItemOn(this._itemTargetPending.key, this._itemTargetPending.data, pkmn);
        }
        return;
    }

    // Normal party switching
    if (index === PMZ.Battle._activePlayerIndex) {
        SoundManager.playBuzzer();
        this._msgWindow.setText('Ya esta en combate.');
        this._partyWindow.activate();
        return;
    }

    if (PMZ.Pokemon.isFainted(pkmn)) {
        SoundManager.playBuzzer();
        this._msgWindow.setText('No puede combatir...');
        this._partyWindow.activate();
        return;
    }

    PMZ.Battle._activePlayerIndex = index;
    PMZ.Battle._playerPokemon = pkmn;
    PMZ.Battle.addParticipant(pkmn);
    this._playerHP.setPokemon(pkmn);
    this._resetSprite(this._playerSprite);
    this._playerSprite.setPokemon(pkmn, true);
    this._animateSendIn(this._playerSprite, false);
    this._partyWindow.hide();
    this._partyWindow.deactivate();
    this._msgWindow.setText('Ve! ' + pkmn.name + '!');
    this._waitCount = 10;
    this._state = 'showCommand';
};

Scene_PMZ_Battle.prototype.onPartyCancel = function() {
    if (this._itemTargetPending) {
        this._itemTargetPending = null;
        this._partyWindow.hide();
        this._partyWindow.deactivate();
        this._bagWindow.show();
        this._bagWindow.activate();
        this._msgWindow.setText('Selecciona un objeto');
        this._state = 'subMenu';
        return;
    }
    this._partyWindow.hide();
    this._partyWindow.deactivate();
    this.showCommandWindow();
};

Scene_PMZ_Battle.prototype.tryFlee = function() {
    var wild = PMZ.Battle._wildPokemon;
    var player = PMZ.Battle._playerPokemon;
    var isTrainer = PMZ.Battle.isTrainerBattle();

    if (isTrainer || !wild) {
        this._msgWindow.setText('No puedes huir de un entrenador!');
        this._cmdWindow.hide();
        this._cmdWindow.deactivate();
        this._waitCount = 40;
        this._state = 'opponentAttack';
        return;
    }

    var flee = PMZ.BattleCore.computeFlee(player, wild);
    if (flee.success) {
        this._msgWindow.setText('Huiste del combate!');
        this._state = 'flee';
        this._waitCount = 60;
    } else {
        this._msgWindow.setText('No puedes huir!');
        this._cmdWindow.hide();
        this._cmdWindow.deactivate();
        this._waitCount = 30;
        this._state = 'opponentAttack';
    }
};

Scene_PMZ_Battle.prototype.updateFlee = function() {
    if (this._waitCount <= 0) {
        PMZ.Battle.setResultOutcome('fled', {
            species: PMZ.Battle._battleInitialSpecies
        });
        PMZ.Encounter.endBattle();
        PMZ.Battle.trainerEndBattle();
        SceneManager.pop();
    }
};

Scene_PMZ_Battle.prototype.updateVictory = function() {
    if (!this._victoryStep) this._victoryStep = 0;

    // Set outcome on first entry (if not already set by capture)
    if (this._victoryStep === 0) {
        if (this._captureSuccess) {
            // Capture path: outcome was set in updateCaptured
        } else {
            var trainer = PMZ.Battle._enemyTrainer;
            PMZ.Battle.setResultOutcome('won', {
                trainer: trainer ? trainer.id : null,
                species: PMZ.Battle._battleInitialSpecies
            });
        }
    }

    switch (this._victoryStep) {
        case 0:
            var wild = PMZ.Battle._wildPokemon;
            if (wild && this._captureSuccess) {
                this._victoryStep = 2;
                this._waitCount = 10;
                return;
            }
            this._victoryStep = 1;
            this._waitCount = 10;
            break;

        case 1:
            var wild = PMZ.Battle._wildPokemon;
            // Distribucion de EXP (participantes, killer 1.0x) en PMZ.BattleCore
            var exp = PMZ.BattleCore.distributeVictoryExp();
            if (exp.msg) {
                this._pendingMoveLearns = exp.pendingMoveLearns;
                this._msgWindow.setText(exp.msg);
                this._playerHP.refresh();
                if (PMZ.Battle._playerPokemon2 && this._playerHP2 && this._playerHP2.refresh) this._playerHP2.refresh();
                // Si hay movimientos pendientes, abrir MoveLearn para el primero
                if (this._pendingMoveLearns.length > 0) {
                    var first = this._pendingMoveLearns.shift();
                    $gameTemp._pmzMoveLearn = { pokemon: first.pokemon, newMove: first.newMove, blocking: true };
                    this._victoryStep = 1.5;
                    this._waitCount = 60;
                    SceneManager.push(Scene_PMZ_MoveLearn);
                    break;
                }
                this._waitCount = 60;
                this._victoryStep = 2;
            } else {
                this._victoryStep = 2;
                this._waitCount = 10;
            }
            break;

        case 1.5:
            // Scene_PMZ_MoveLearn was just popped. If there are more pending moves, push the next one.
            if (this._pendingMoveLearns && this._pendingMoveLearns.length > 0) {
                var nextPending = this._pendingMoveLearns.shift();
                $gameTemp._pmzMoveLearn = { pokemon: nextPending.pokemon, newMove: nextPending.newMove, blocking: true };
                SceneManager.push(Scene_PMZ_MoveLearn);
                this._waitCount = 10;
                break;
            }
            // All done, advance to victory
            this._victoryStep = 2;
            this._waitCount = 60;
            break;

        case 2:
            this._msgWindow.setText('Victoria!');
            this._waitCount = 50;
            this._victoryStep = 0;
            this._state = 'endBattle';
            break;
    }
};

// Window_PMZ_YesNo - Simple Yes/No chooser
// ============================================================================
function Window_PMZ_YesNo() {
    this.initialize.apply(this, arguments);
}
Window_PMZ_YesNo.prototype = Object.create(Window_Selectable.prototype);
Window_PMZ_YesNo.prototype.constructor = Window_PMZ_YesNo;
Window_PMZ_YesNo.prototype.initialize = function(x, y, width, height) {
    this._choices = ['Si', 'No'];
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
};
Window_PMZ_YesNo.prototype.maxCols = function() { return 2; };
Window_PMZ_YesNo.prototype.maxItems = function() { return this._choices.length; };
Window_PMZ_YesNo.prototype.drawItem = function(index) {
    this.drawText(this._choices[index], this.itemRect(index).x + 10, this.itemRect(index).y + 10, this.itemWidth() - 20, 'center');
};
Window_PMZ_YesNo.prototype.refresh = function() {
    this.contents.clear();
    for (var i = 0; i < this._choices.length; i++) this.drawItem(i);
};

// Capture prompt handler
// ============================================================================
Scene_PMZ_Battle.prototype.updateCapturePrompt = function() {
    if (!this._capturePromptStep) this._capturePromptStep = 0;

    switch (this._capturePromptStep) {
        case 0:
            this._msgWindow.setText('Capturar a ' + (PMZ.Battle._wildPokemon ? PMZ.Battle._wildPokemon.name : '???') + '?');
            var w = Graphics.boxWidth;
            var h = Graphics.boxHeight;
            if (!this._captureYesNoWindow) {
                this._captureYesNoWindow = new Window_PMZ_YesNo(0, Math.floor(h * 0.72), w, Math.floor(h * 0.28));
                this._captureYesNoWindow.setHandler('ok', this._onCaptureYesNo.bind(this));
                this._captureYesNoWindow.setHandler('cancel', this._onCaptureCancel.bind(this));
                this.addWindow(this._captureYesNoWindow);
            }
            this._captureYesNoWindow.show();
            this._captureYesNoWindow.activate();
            this._capturePromptStep = -1; // wait for choice
            this._waitCount = 10;
            break;

        case 1:
            this._capturePromptStep = 0;
            this._state = 'victory';
            break;
    }
};

Scene_PMZ_Battle.prototype._onCaptureYesNo = function() {
    var idx = this._captureYesNoWindow.index();
    var wild = PMZ.Battle._wildPokemon;
    if (idx === 0 && wild) {
        // Use addToPartyOrPC so overflow goes to the PC with a proper message
        var dest = $gamePMZ.addToPartyOrPC(wild);
        PMZ.Battle._wildPokemon = null;
        this._captureSuccess = true;
        if (dest === 'pc') {
            this._msgWindow.setText('¡' + wild.name + ' fue enviado al PC!');
        } else {
            this._msgWindow.setText('¡' + wild.name + ' fue añadido al equipo!');
        }
    }
    this._captureYesNoWindow.hide();
    this._capturePromptStep = 1;
    this._waitCount = 60;
};

Scene_PMZ_Battle.prototype._onCaptureCancel = function() {
    this._captureYesNoWindow.hide();
    this._capturePromptStep = 1;
    this._waitCount = 20;
};

Scene_PMZ_Battle.prototype.updateAbilityActivate = function() {
    if (this._abilityQueue && this._abilityQueue.length > 0) {
        var msg = this._abilityQueue.shift();
        this._msgWindow.setText(msg);
        this._waitCount = 40;
    } else {
        this._state = this._prevState || 'playerCommand';
    }
};

Scene_PMZ_Battle.prototype.updateTrainerSendOut = function() {
    console.log('[PMZ] updateTrainerSendOut enter _enemyNextTimer=' + this._enemyNextTimer + ' waitCount=' + this._waitCount);
    if (this._enemyNextTimer !== undefined) {
        this._enemyNextTimer--;
        if (this._enemyNextTimer <= 0) {
            var wp1 = PMZ.Battle._wildPokemon;
            var wp2 = PMZ.Battle._wildPokemon2;
            var isDouble = PMZ.Battle._doubleBattle;
            var slot1Empty = !wp1 || PMZ.Pokemon.isFainted(wp1);
            var slot2Empty = isDouble && (!wp2 || PMZ.Pokemon.isFainted(wp2));
            console.log('[PMZ] updateTrainerSendOut slot1Empty=' + slot1Empty + ' slot2Empty=' + slot2Empty + ' isDouble=' + isDouble);

            if (slot1Empty && slot2Empty) {
                // Double battle: both enemy slots empty. Send out 2 new pokemon.
                var p1 = PMZ.Battle.sendNextTrainerPokemon(null);
                var p2 = p1 ? PMZ.Battle.sendNextTrainerPokemon(p1) : null;
                console.log('[PMZ] updateTrainerSendOut (both) p1=' + (p1 ? p1.name : 'null') + ' p2=' + (p2 ? p2.name : 'null'));
                if (p1) {
                    PMZ.Battle._wildPokemon = p1;
                    this._wildHP.setPokemon(p1);
                    this._resetSprite(this._wildSprite);
                    this._wildSprite.setPokemon(p1, false);
                    this._animateSendIn(this._wildSprite, false);
                }
                if (p2) {
                    PMZ.Battle._wildPokemon2 = p2;
                    if (this._wildHP2) this._wildHP2.setPokemon(p2);
                    if (this._wildSprite2) {
                        this._resetSprite(this._wildSprite2);
                        this._wildSprite2.setPokemon(p2, false);
                        this._animateSendIn(this._wildSprite2, false);
                    }
                }
                if (p1 || p2) {
                    var msg = '';
                    if (p1) msg += p1.name + ' salio al combate! ';
                    if (p2) msg += p2.name + ' salio al combate!';
                    this._msgWindow.setText(msg.trim());
                    this._waitCount = 50;
                    this._state = 'playerCommand';
                } else {
                    this._finishTrainerVictory();
                }
            } else if (slot1Empty) {
                // Slot 1 empty, slot 2 may or may not be alive. Send to slot 1, exclude slot 2.
                var p1 = PMZ.Battle.sendNextTrainerPokemon(wp2 && !PMZ.Pokemon.isFainted(wp2) ? wp2 : null);
                console.log('[PMZ] updateTrainerSendOut (slot1) p1=' + (p1 ? p1.name : 'null'));
                if (p1) {
                    PMZ.Battle._wildPokemon = p1;
                    this._wildHP.setPokemon(p1);
                    this._resetSprite(this._wildSprite);
                    this._wildSprite.setPokemon(p1, false);
                    this._animateSendIn(this._wildSprite, false);
                    this._msgWindow.setText(p1.name + ' salio al combate!');
                    this._waitCount = 40;
                    this._state = 'playerCommand';
                } else if (wp2 && !PMZ.Pokemon.isFainted(wp2)) {
                    // No replacement, but slot 2 alive: continue 1vN
                    console.log('[PMZ] updateTrainerSendOut (slot1) no replacement, continuing with slot2');
                    this._state = 'playerCommand';
                } else {
                    this._finishTrainerVictory();
                }
            } else if (slot2Empty) {
                // Slot 2 empty, slot 1 alive. Send to slot 2, exclude slot 1.
                var p2b = PMZ.Battle.sendNextTrainerPokemon(wp1);
                console.log('[PMZ] updateTrainerSendOut (slot2) p2=' + (p2b ? p2b.name : 'null'));
                if (p2b) {
                    PMZ.Battle._wildPokemon2 = p2b;
                    if (this._wildHP2) this._wildHP2.setPokemon(p2b);
                    if (this._wildSprite2) {
                        this._resetSprite(this._wildSprite2);
                        this._wildSprite2.setPokemon(p2b, false);
                        this._animateSendIn(this._wildSprite2, false);
                    }
                    this._msgWindow.setText(p2b.name + ' salio al combate!');
                    this._waitCount = 40;
                    this._state = 'playerCommand';
                } else if (wp1 && !PMZ.Pokemon.isFainted(wp1)) {
                    console.log('[PMZ] updateTrainerSendOut (slot2) no replacement, continuing with slot1');
                    this._state = 'playerCommand';
                } else {
                    this._finishTrainerVictory();
                }
            } else {
                // Both slots alive - shouldn't reach here
                this._state = 'playerCommand';
            }
        }
    }
};

// Handle trainer running out of pokemon (no replacements left).
Scene_PMZ_Battle.prototype._finishTrainerVictory = function() {
    this._msgWindow.setText('El entrenador se quedo sin Pokemon!');
    this._waitCount = 40;
    var tData = PMZ.Battle._enemyTrainer;
    if (tData) {
        // Dinero y medallas otorgados en PMZ.BattleCore
        var rewards = PMZ.BattleCore.trainerVictoryRewards();
        var money = rewards.money;
        this._msgWindow.setText('Ganaste $' + money + '!');
        this._waitCount = 60;
        if (rewards.badge) {
            var badgeData = PMZ.Data.badges();
            var bName = rewards.badge;
            if (badgeData && badgeData.badges) {
                for (var bi = 0; bi < badgeData.badges.length; bi++) {
                    if (badgeData.badges[bi].key === rewards.badge) {
                        bName = badgeData.badges[bi].name;
                        break;
                    }
                }
            }
            this._msgWindow.setText('Recibiste la Medalla ' + bName + '!');
            this._waitCount = 80;
        }
    }
    this._state = 'victory';
};

Scene_PMZ_Battle.prototype.updateDefeat = function() {
    if (!this._defeatStep) this._defeatStep = 0;

    if (this._defeatStep === 0) {
        var trainer = PMZ.Battle._enemyTrainer;
        PMZ.Battle.setResultOutcome('lost', {
            trainer: trainer ? trainer.id : null,
            species: PMZ.Battle._battleInitialSpecies
        });
    }

    switch (this._defeatStep) {
        case 0:
            this._msgWindow.setText('Has sido derrotado...');
            this._defeatStep = 1;
            this._waitCount = 50;
            break;

        case 1:
            this._defeatStep = 0;
            this._state = 'endBattle';
            this._waitCount = 10;
            break;
    }
};

Scene_PMZ_Battle.prototype.updateEndBattle = function() {
    // Clear active mechanics on all player Pokemon
    var party = $gamePMZ ? $gamePMZ.party() : [];
    for (var i = 0; i < party.length; i++) {
        PMZ.Battle.Mechanics.clearAll(party[i]);
    }
    PMZ.Battle.Mechanics.clearCounts();

    if (PMZ.Battle._wildPokemon) {
        PMZ.Encounter.endBattle();
    }
    PMZ.Battle.trainerEndBattle();

    if (this._defeatOccurred && PMZ.Config.healOnDefeat()) {
        this._defeatOccurred = false;
        var center = $gamePMZ.lastPokeCenter();
        if (center) {
            $gamePlayer.reserveTransfer(center.mapId, center.x, center.y, 2);
            PMZ.Party.healAll();
        }
    }

    SceneManager.pop();
};

// ============================================================================
// Listado de Pokemon en el campo y procesamiento de fin de turno.
// La logica vive en PMZ.BattleCore (PMZ_BattleCore.js); aqui solo se delega.
// ============================================================================
Scene_PMZ_Battle.prototype._buildAllPokemonList = function() {
    return PMZ.BattleCore.allPokemonList();
};

Scene_PMZ_Battle.prototype._applyWeatherDamage = function(allPoke) {
    return PMZ.BattleCore.weatherDamage(allPoke);
};

// Process Leech Seed end-of-turn drain
Scene_PMZ_Battle.prototype._processLeechSeed = function(allPoke) {
    return PMZ.BattleCore.leechSeed(allPoke);
};

// Process Bind (wrap) end-of-turn damage
Scene_PMZ_Battle.prototype._processBindDamage = function(allPoke) {
    return PMZ.BattleCore.bindDamage(allPoke);
};

// Process Bide end-of-turn (release stored damage)
Scene_PMZ_Battle.prototype._processBide = function(allPoke) {
    return PMZ.BattleCore.bide(allPoke);
};

// Helper: get sprite for a target Pokemon (supports double battle)
Scene_PMZ_Battle.prototype._getTargetSprite = function(pkmn) {
    if (pkmn === PMZ.Battle._wildPokemon) return this._wildSprite;
    if (pkmn === PMZ.Battle._wildPokemon2) return this._wildSprite2 || this._wildSprite;
    if (pkmn === PMZ.Battle._playerPokemon) return this._playerSprite;
    if (pkmn === PMZ.Battle._playerPokemon2) return this._playerSprite2 || this._playerSprite;
    return this._wildSprite;
};

// Helper: get HP window for a target Pokemon
Scene_PMZ_Battle.prototype._getTargetHP = function(pkmn) {
    if (pkmn === PMZ.Battle._wildPokemon) return this._wildHP;
    if (pkmn === PMZ.Battle._wildPokemon2) return this._wildHP2 || this._wildHP;
    if (pkmn === PMZ.Battle._playerPokemon) return this._playerHP;
    if (pkmn === PMZ.Battle._playerPokemon2) return this._playerHP2 || this._playerHP;
    return this._wildHP;
};

// ============================================================================
// Plugin Commands
// ============================================================================
(function() {
    // Helper: read battle-result switch args and configure PMZ.Battle
    function applySwitchesFromArgs(args) {
        var sw = {
            win: Number(args.winSwitch) || 0,
            lose: Number(args.loseSwitch) || 0,
            flee: Number(args.fleeSwitch) || 0,
            catch: Number(args.catchSwitch) || 0,
            defeatTarget: Number(args.defeatSwitch) || 0
        };
        console.log('[PMZ] applySwitchesFromArgs winSwitch=' + args.winSwitch + ' -> win=' + sw.win + ' args=', JSON.stringify(args));
        var tgt = String(args.defeatTarget || '').toLowerCase().trim();
        sw._defeatTargetKey = tgt || null;
        PMZ.Battle.setBattleSwitches(sw);
    }

    PluginManager.registerCommand('PMZ_Battle', 'startBattle', function(args) {
        var species = String(args.species || 'pikachu').toLowerCase();
        var level = Number(args.level) || 10;
        applySwitchesFromArgs(args);
        PMZ.Battle.startWild(species, level);
        SceneManager.push(Scene_PMZ_Battle);
    });

    PluginManager.registerCommand('PMZ_Battle', 'startTrainer', function(args) {
        var trainer = String(args.trainer || 'youngster').toLowerCase();
        applySwitchesFromArgs(args);
        if (PMZ.Battle.startTrainer(trainer)) {
            SceneManager.push(Scene_PMZ_Battle);
        }
    });

    PluginManager.registerCommand('PMZ_Battle', 'startDoubleWild', function(args) {
        var s1 = String(args.species1 || 'pikachu').toLowerCase();
        var l1 = Number(args.level1) || 10;
        var s2 = String(args.species2 || 'bulbasaur').toLowerCase();
        var l2 = Number(args.level2) || 10;
        applySwitchesFromArgs(args);
        PMZ.Battle.startDoubleWild(s1, l1, s2, l2);
        SceneManager.push(Scene_PMZ_Battle);
    });

    PluginManager.registerCommand('PMZ_Battle', 'startDoubleTrainer', function(args) {
        var trainer = String(args.trainer || 'youngster').toLowerCase();
        applySwitchesFromArgs(args);
        if (PMZ.Battle.startDoubleTrainer(trainer)) {
            SceneManager.push(Scene_PMZ_Battle);
        }
    });

    PluginManager.registerCommand('PMZ_Battle', 'wildEncounterList', function(args) {
        try {
            var list = [];
            for (var i = 1; i <= 12; i++) {
                var sp = String(args['species' + i] || '').toLowerCase().trim();
                if (!sp) continue;
                var pMin = Number(args['levelMin' + i]) || 1;
                var pMax = Number(args['levelMax' + i]) || pMin;
                var prob = Number(args['probability' + i]) || 0;
                if (prob <= 0) continue;
                list.push({ species: sp, levelMin: pMin, levelMax: pMax, probability: prob });
            }
            if (list.length === 0) return;

            var roll = Math.random() * 100;
            var cumulative = 0;
            var selected = null;

            for (var i = 0; i < list.length; i++) {
                cumulative += list[i].probability;
                if (roll < cumulative) {
                    selected = list[i];
                    break;
                }
            }

            if (!selected) return;

            var level = Math.floor(Math.random() * (selected.levelMax - selected.levelMin + 1)) + selected.levelMin;
            applySwitchesFromArgs(args);
            PMZ.Battle.startWild(selected.species, level);
            SceneManager.push(Scene_PMZ_Battle);
        } catch(e) {
            console.error('[PMZ] wildEncounterList error:', e);
        }
    });

    // New: clear battle result state and all associated switches
    PluginManager.registerCommand('PMZ_Battle', 'resetBattleResult', function(args) {
        PMZ.Battle.clearResult();
    });

    console.log('[PMZ] Battle plugin loaded');
})();
