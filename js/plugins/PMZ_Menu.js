//=============================================================================
// PMZ_Menu.js
// Pokemon MZ Essential - Party Menu System v0.1.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Pokemon MZ Essential - Party Menu System
 * @author PMZ Team
 * @url
 * @help
 * ============================================================================
 * PMZ Menu - Sistema de menu de equipo Pokemon.
 * Dependencia: PMZ_Core.js
 * ============================================================================
 * 
 * @command openParty
 * @text Open Party Menu
 * @desc Abre el menu de equipo Pokemon.
 * 
 * @command openSummary
 * @text Open Pokemon Summary
 * @desc Abre el resumen de un Pokemon.
 * @arg partyIndex
 * @text Party Index
 * @desc Indice del Pokemon en el equipo (0-5)
 * @type number
 * @default 0
 * 
 * @command openCenter
 * @text Open Pokemon Center
 * @desc Abre el menu del Centro Pokemon.
 * 
 * @command openMart
 * @text Open Pokemon Mart
 * @desc Abre la tienda Pokemon.
 * 
 * @command openCustomShop
 * @text Open Custom Shop
 * @desc Tienda con objetos y precios personalizados (1-12 objetos).
 * 
 * @arg itemKey1
 * @text Item Key 1
 * @desc Key del objeto en items.json (vacio = no usado)
 * @type string
 * @default 
 * @arg itemPrice1
 * @text Price 1
 * @desc Precio de venta (0 = precio por defecto)
 * @type number
 * @min 0
 * @default 0
 * @arg itemStock1
 * @text Stock 1
 * @desc Unidades disponibles (0 = sin limite)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg itemKey2
 * @text Item Key 2
 * @desc Key del objeto en items.json (vacio = no usado)
 * @type string
 * @default 
 * @arg itemPrice2
 * @text Price 2
 * @desc Precio de venta (0 = precio por defecto)
 * @type number
 * @min 0
 * @default 0
 * @arg itemStock2
 * @text Stock 2
 * @desc Unidades disponibles (0 = sin limite)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg itemKey3
 * @text Item Key 3
 * @desc Key del objeto en items.json (vacio = no usado)
 * @type string
 * @default 
 * @arg itemPrice3
 * @text Price 3
 * @desc Precio de venta (0 = precio por defecto)
 * @type number
 * @min 0
 * @default 0
 * @arg itemStock3
 * @text Stock 3
 * @desc Unidades disponibles (0 = sin limite)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg itemKey4
 * @text Item Key 4
 * @desc Key del objeto en items.json (vacio = no usado)
 * @type string
 * @default 
 * @arg itemPrice4
 * @text Price 4
 * @desc Precio de venta (0 = precio por defecto)
 * @type number
 * @min 0
 * @default 0
 * @arg itemStock4
 * @text Stock 4
 * @desc Unidades disponibles (0 = sin limite)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg itemKey5
 * @text Item Key 5
 * @desc Key del objeto en items.json (vacio = no usado)
 * @type string
 * @default 
 * @arg itemPrice5
 * @text Price 5
 * @desc Precio de venta (0 = precio por defecto)
 * @type number
 * @min 0
 * @default 0
 * @arg itemStock5
 * @text Stock 5
 * @desc Unidades disponibles (0 = sin limite)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg itemKey6
 * @text Item Key 6
 * @desc Key del objeto en items.json (vacio = no usado)
 * @type string
 * @default 
 * @arg itemPrice6
 * @text Price 6
 * @desc Precio de venta (0 = precio por defecto)
 * @type number
 * @min 0
 * @default 0
 * @arg itemStock6
 * @text Stock 6
 * @desc Unidades disponibles (0 = sin limite)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg itemKey7
 * @text Item Key 7
 * @desc Key del objeto en items.json (vacio = no usado)
 * @type string
 * @default 
 * @arg itemPrice7
 * @text Price 7
 * @desc Precio de venta (0 = precio por defecto)
 * @type number
 * @min 0
 * @default 0
 * @arg itemStock7
 * @text Stock 7
 * @desc Unidades disponibles (0 = sin limite)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg itemKey8
 * @text Item Key 8
 * @desc Key del objeto en items.json (vacio = no usado)
 * @type string
 * @default 
 * @arg itemPrice8
 * @text Price 8
 * @desc Precio de venta (0 = precio por defecto)
 * @type number
 * @min 0
 * @default 0
 * @arg itemStock8
 * @text Stock 8
 * @desc Unidades disponibles (0 = sin limite)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg itemKey9
 * @text Item Key 9
 * @desc Key del objeto en items.json (vacio = no usado)
 * @type string
 * @default 
 * @arg itemPrice9
 * @text Price 9
 * @desc Precio de venta (0 = precio por defecto)
 * @type number
 * @min 0
 * @default 0
 * @arg itemStock9
 * @text Stock 9
 * @desc Unidades disponibles (0 = sin limite)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg itemKey10
 * @text Item Key 10
 * @desc Key del objeto en items.json (vacio = no usado)
 * @type string
 * @default 
 * @arg itemPrice10
 * @text Price 10
 * @desc Precio de venta (0 = precio por defecto)
 * @type number
 * @min 0
 * @default 0
 * @arg itemStock10
 * @text Stock 10
 * @desc Unidades disponibles (0 = sin limite)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg itemKey11
 * @text Item Key 11
 * @desc Key del objeto en items.json (vacio = no usado)
 * @type string
 * @default 
 * @arg itemPrice11
 * @text Price 11
 * @desc Precio de venta (0 = precio por defecto)
 * @type number
 * @min 0
 * @default 0
 * @arg itemStock11
 * @text Stock 11
 * @desc Unidades disponibles (0 = sin limite)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg itemKey12
 * @text Item Key 12
 * @desc Key del objeto en items.json (vacio = no usado)
 * @type string
 * @default 
 * @arg itemPrice12
 * @text Price 12
 * @desc Precio de venta (0 = precio por defecto)
 * @type number
 * @min 0
 * @default 0
 * @arg itemStock12
 * @text Stock 12
 * @desc Unidades disponibles (0 = sin limite)
 * @type number
 * @min 0
 * @default 0
 * 
 * @command openPC
 * @text Open PC
 * @desc Abre el PC para gestionar cajas.
 * 
 * @command openBag
 * @text Open Bag
 * @desc Abre la mochila fuera de combate.
 * 
 * @command openPokedex
 * @text Open Pokedex
 * @desc Abre la Pokedex.
 *
 * @command learnMove
 * @text Learn Move
 * @desc Enseña un movimiento a un Pokemon del equipo. Si tiene 4 movimientos (limite), abre Scene_PMZ_MoveLearn para elegir cual olvidar.
 * @arg partyIndex
 * @text Party Index
 * @desc Indice del Pokemon en el equipo (0-5)
 * @type number
 * @min 0
 * @default 0
 * @arg move
 * @text Move Key
 * @desc Key del movimiento a aprender (ej: flamethrower, hydropump)
 * @type string
 * @default tackle
 *
 * @command giveTM
 * @text Give TM
 * @desc Da un TM/MO al jugador. Útil para entregarlos como recompensa.
 * @arg tm
 * @text TM Key
 * @desc Key del TM (ej: tm13, hmsurf)
 * @type string
 * @default tm13
 * @arg amount
 * @text Amount
 * @desc Cantidad a entregar
 * @type number
 * @min 1
 * @default 1
 *
 * @command openTrainerCard
 * @text Open Trainer Card
 * @desc Abre la tarjeta de entrenador.
 *
 * @command choosePokemon
 * @text Choose Pokemon
 * @desc Abre seleccion de Pokemon y guarda el indice en variable.
 * @arg variableId
 * @text Variable ID
 * @desc ID de la variable donde se guardara el indice (-1 si cancela)
 * @type number
 * @default 1
 * @arg message
 * @text Message
 * @desc Mensaje a mostrar en la seleccion
 * @type string
 * @default Selecciona un Pokemon:
 */

var PMZ = PMZ || {};
PMZ.Menu = PMZ.Menu || {};

// ============================================================================
// Window_PMZ_PartyList
// ============================================================================
function Window_PMZ_PartyList() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_PartyList.prototype = Object.create(Window_Selectable.prototype);
Window_PMZ_PartyList.prototype.constructor = Window_PMZ_PartyList;

Window_PMZ_PartyList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.select(0);
    this.activate();
};

Window_PMZ_PartyList.prototype.maxItems = function() {
    return Math.max(2, $gamePMZ.party().length);
};

Window_PMZ_PartyList.prototype.itemHeight = function() {
    return 84;
};

Window_PMZ_PartyList.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    var pkmn = $gamePMZ.party()[index];

    if (!pkmn) {
        this.contents.fontSize = 20;
        this.drawText('--- Vac\u00edo ---', rect.x + 8, rect.y + 30, rect.width - 16, 'center');
        this.contents.fontSize = 22;
        return;
    }

    var iconW = 36;
    var ix = rect.x + 4;
    var iy = rect.y + (this.itemHeight() - iconW) / 2;
    PMZ.Icons.drawIcon(this.contents, pkmn.id, ix, iy, iconW, iconW, (pkmn._formSuffix || pkmn._megaForm || ''));

    var isFainted = PMZ.Pokemon.isFainted(pkmn);
    var x = rect.x + 4 + iconW + 6;
    var y = rect.y + 6;

    // Name + Pokedex ID
    this.contents.fontSize = 20;
    this.drawText('#' + String(pkmn.id).padStart(3, '0') + ' ' + pkmn.name, x, y, rect.width - iconW - 20, 'left');

    // Level + Status
    this.contents.fontSize = 16;
    var lvText = PMZ.Config.isStatEvolution() ? '???' : 'Nv' + pkmn.level;
    if (isFainted) {
        this.drawText(lvText, x, y + 22, 50, 'left');
        this.changeTextColor('#f85858');
        this.drawText('FNT', x + 52, y + 22, 36, 'left');
        this.resetTextColor();
    } else if (pkmn.status) {
        this.drawText(lvText, x, y + 22, 50, 'left');
        this.changeTextColor('#f8a030');
        this.drawText(String(pkmn.status).toUpperCase(), x + 52, y + 22, 60, 'left');
        this.resetTextColor();
    } else {
        this.changeTextColor('#f8d030');
        this.drawText(lvText, x, y + 22, 60, 'left');
        this.resetTextColor();
    }

    // HP Bar
    var barX = x;
    var barY = y + 42;
    var barW = Math.min(180, rect.width - iconW - 30);
    var barH = 10;
    var hpRatio = pkmn.maxHp > 0 ? pkmn.currentHp / pkmn.maxHp : 0;

    this.contents.fillRect(barX, barY, barW, barH, '#202020');
    var hpColor = hpRatio > 0.5 ? '#48c848' : (hpRatio > 0.25 ? '#f8d030' : '#f85858');
    this.contents.fillRect(barX + 1, barY + 1, Math.max(0, Math.floor((barW - 2) * hpRatio)), barH - 2, hpColor);

    var hpText = pkmn.currentHp + '/' + pkmn.maxHp;
    this.contents.fontSize = 14;
    this.drawText('HP', barX + 2, barY + barH + 1, 18, 'left');
    this.drawText(hpText, barX + barW - 70, barY + barH + 1, 68, 'right');

    // Held item indicator
    var held = PMZ.HoldItems.heldItems(pkmn);
    if (held.length > 0) {
        var hasMega = false;
        for (var hi = 0; hi < held.length; hi++) {
            var hd = PMZ.Data.item(held[hi]);
            if (hd && hd.type === 'megastone') { hasMega = true; break; }
        }
        var badgeX = rect.x + rect.width - 34;
        var badgeY = rect.y + 6;
        var badgeW = 26;
        var badgeH = 20;
        if (hasMega) {
            this.contents.fillRect(badgeX, badgeY, badgeW, badgeH, '#f8d030');
            this.changeTextColor('#ffffff');
            this.contents.fontSize = 16;
            this.drawText('M', badgeX, badgeY + 1, badgeW, 'center');
        } else {
            this.contents.fillRect(badgeX, badgeY, badgeW, badgeH, '#6890f0');
            this.changeTextColor('#ffffff');
            this.contents.fontSize = 16;
            this.drawText('E', badgeX, badgeY + 1, badgeW, 'center');
        }
    }
    this.resetTextColor();
    this.contents.fontSize = 22;
};

Window_PMZ_PartyList.prototype.refresh = function() {
    this.contents.clear();
    this.drawAllItems();
};

// ============================================================================
// Window_PMZ_Summary_Stats
// ============================================================================
function Window_PMZ_Summary_Stats() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_Summary_Stats.prototype = Object.create(Window_Base.prototype);
Window_PMZ_Summary_Stats.prototype.constructor = Window_PMZ_Summary_Stats;

Window_PMZ_Summary_Stats.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
};

Window_PMZ_Summary_Stats.prototype.setPokemon = function(pkmn) {
    if (this._pkmn === pkmn) return;
    this._pkmn = pkmn;
    this.refresh();
};

Window_PMZ_Summary_Stats.prototype.refresh = function() {
    this.contents.clear();
    if (!this._pkmn) return;

    var p = this._pkmn;
    var x = 8;
    var y = 4;
    var w = this.contentsWidth() - 16;
    var barW = Math.min(120, w - 100);

    // Line 1: Name
    this.contents.fontSize = 18;
    this.drawText(p.name, x, y, 160, 'left');

    // Line 2: Lv + Gender (with extra vertical spacing)
    this.changeTextColor('#f8d030');
    this.contents.fontSize = 16;
    var lvText = PMZ.Config.isStatEvolution() ? '???' : 'Nv' + p.level;
    var genText = p.gender === 'male' ? ' \u2642' : (p.gender === 'female' ? ' \u2640' : '');
    this.drawText(lvText + genText, x, y + 22, 80, 'left');
    this.resetTextColor();

    // Line 3: Nature (+ stat up/down indicators)
    this.contents.fontSize = 14;
    this.changeTextColor('#c8c8c8');
    var natureName = PMZ.Utils.capitalize(p.nature || 'serious');
    this.drawText(natureName, x, y + 44, 80, 'left');
    this.resetTextColor();
    // Show up/down arrows if nature modifies a stat
    var nMods = PMZ.Pokemon._natureMods[p.nature] || PMZ.Pokemon._natureMods['hardy'];
    if (nMods.up || nMods.down) {
        this.contents.fontSize = 11;
        var labels = { attack: 'Atk', defense: 'Def', spAttack: 'At.E', spDefense: 'D.E', speed: 'Vel' };
        this.changeTextColor('#88dd66');
        if (nMods.up) this.drawText('↑' + (labels[nMods.up] || nMods.up), x + 82, y + 45, 32, 'left');
        this.changeTextColor('#dd6666');
        if (nMods.down) this.drawText('↓' + (labels[nMods.down] || nMods.down), x + 116, y + 45, 32, 'left');
        this.resetTextColor();
    }

    // Line 4: Types (with extra spacing from nature)
    if (p.types) {
        for (var i = 0; i < p.types.length; i++) {
            PMZ.Utils.drawTypeBadge(this.contents, p.types[i], x + i * 70, y + 68, 64, 18);
        }
    }

    // Line 5: HP bar (with extra spacing from types)
    this.contents.fontSize = 15;
    this.drawText('HP', x, y + 90, 18, 'left');
    this.drawText(p.currentHp + '/' + p.maxHp, x + 20, y + 90, 60, 'left');
    var hpRatio = p.maxHp > 0 ? p.currentHp / p.maxHp : 0;
    var hpBarX = x + 86;
    this.contents.fillRect(hpBarX, y + 92, barW, 8, '#202020');
    var hpCol = hpRatio > 0.5 ? '#48c848' : (hpRatio > 0.25 ? '#f8d030' : '#f85858');
    this.contents.fillRect(hpBarX + 1, y + 93, Math.max(0, Math.floor((barW - 2) * Math.max(0, hpRatio))), 6, hpCol);

    // Line 6: EXP bar
    var base = PMZ.Data.pokemon(p.species);
    var expRate = base ? (base.expRate || 'medium') : 'medium';
    var expAtLevel = PMZ.Pokemon.calcExp(p.level, expRate);
    var expGained = Math.max(0, p.exp - expAtLevel);
    this.drawText('EXP:' + expGained + '/' + p.expToNext, x, y + 106, 86, 'left');
    var expRatio = p.expToNext > 0 ? Math.min(1, expGained / p.expToNext) : 0;
    this.contents.fillRect(hpBarX, y + 108, barW, 6, '#202020');
    this.contents.fillRect(hpBarX + 1, y + 109, Math.max(0, Math.floor((barW - 2) * expRatio)), 4, '#58b8f8');

    // Lines 7-11: Stats (more vertical space per row)
    var stats = [
        { label: 'Ataque', val: p.attack, base: 255 },
        { label: 'Defensa', val: p.defense, base: 255 },
        { label: 'At.Esp.', val: p.spAttack, base: 255 },
        { label: 'Def.Esp.', val: p.spDefense, base: 255 },
        { label: 'Velocidad', val: p.speed, base: 255 }
    ];

    var sy = y + 122;
    var rowH = 19;
    var numX = x + 70;
    var barOffsetX = 110;
    for (var j = 0; j < stats.length; j++) {
        var s = stats[j];
        var ratio = Math.min(1, s.val / s.base);
        var rowY = sy + j * rowH;

        this.contents.fontSize = 15;
        this.changeTextColor('#e0e0e0');
        this.drawText(s.label, x, rowY, 64, 'left');
        this.resetTextColor();
        // Right-aligned number, fixed width so it never crowds the bar
        this.drawText(String(s.val), numX, rowY, 36, 'right');

        // Stat bar (slightly shorter than the HP bar to fit the panel)
        var statBarX = x + barOffsetX;
        var statBarW = barW - (barOffsetX - 86);
        if (statBarW < 30) statBarW = 30;
        this.contents.fillRect(statBarX, rowY + 4, statBarW, 6, '#202020');
        var sc = ratio > 0.5 ? '#48c848' : (ratio > 0.25 ? '#f8d030' : '#f85858');
        this.contents.fillRect(statBarX + 1, rowY + 5, Math.max(0, Math.floor((statBarW - 2) * ratio)), 4, sc);
    }

    // Held item
    if (p.heldItems && p.heldItems.length > 0) {
        var held = p.heldItems.map(function(k) {
            var d = PMZ.Data.item(k);
            return d ? d.name : k;
        }).join(', ');
        this.changeTextColor('#f8d030');
        this.drawText('\u2666 ' + held, x, sy + 5 * rowH + 4, w, 'left');
        this.resetTextColor();
    }
    this.contents.fontSize = 22;
};

// Window_PMZ_Summary_StatsIV - IV/EV tab
// ============================================================================
function Window_PMZ_Summary_StatsIV() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_Summary_StatsIV.prototype = Object.create(Window_Base.prototype);
Window_PMZ_Summary_StatsIV.prototype.constructor = Window_PMZ_Summary_StatsIV;

Window_PMZ_Summary_StatsIV.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
};

Window_PMZ_Summary_StatsIV.prototype.setPokemon = function(pkmn) {
    if (this._pkmn === pkmn) return;
    this._pkmn = pkmn;
    this.refresh();
};

Window_PMZ_Summary_StatsIV.prototype.refresh = function() {
    this.contents.clear();
    if (!this._pkmn) return;
    var p = this._pkmn;
    var x = 10, y = 10;

    this.drawText('IVs (Valores Individuales)', x, y, 250, 'left');
    var stats = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];
    var labels = ['HP', 'Ataque', 'Defensa', 'At.Esp.', 'Def.Esp.', 'Vel.'];
    for (var i = 0; i < stats.length; i++) {
        var iv = p.ivs[stats[i]] || 0;
        var ivColor = iv >= 31 ? '#f8d030' : (iv >= 20 ? '#48c848' : '#c8c8c8');
        this.changeTextColor(ivColor);
        this.drawText(labels[i] + ': ' + iv + '/31', x + (i % 2) * 160, y + 22 + Math.floor(i / 2) * 22, 150, 'left');
    }

    this.resetTextColor();
    this.drawText('EVs (Puntos de Esfuerzo)', x, y + 95, 250, 'left');
    for (var j = 0; j < stats.length; j++) {
        var ev = p.evs[stats[j]] || 0;
        var evCol = ev >= 252 ? '#f8d030' : (ev > 0 ? '#48c848' : '#c8c8c8');
        this.changeTextColor(evCol);
        this.drawText(labels[j] + ': ' + ev + '/255', x + (j % 2) * 160, y + 117 + Math.floor(j / 2) * 22, 150, 'left');
    }
    this.resetTextColor();
};

// Window_PMZ_Data - Ability, Held item, Happiness, Shiny, Egg info
// ============================================================================
function Window_PMZ_Data() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_Data.prototype = Object.create(Window_Base.prototype);
Window_PMZ_Data.prototype.constructor = Window_PMZ_Data;

Window_PMZ_Data.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
};

Window_PMZ_Data.prototype.setPokemon = function(pkmn) {
    if (this._pkmn === pkmn) return;
    this._pkmn = pkmn;
    this.refresh();
};

Window_PMZ_Data.prototype.refresh = function() {
    this.contents.clear();
    if (!this._pkmn) return;
    var p = this._pkmn;
    var x = 10, y = 10;

    this.drawText('Datos de ' + p.name, x, y, 250, 'left');
    var lines = [];
    var base = PMZ.Data.pokemon(p.species);
    if (base && base.abilities && base.abilities.length > 0) {
        var abName = '';
        var abData = PMZ.Data.ability(base.abilities[0]);
        if (abData) abName = abData.name || PMZ.Utils.capitalize(base.abilities[0]);
        else abName = PMZ.Utils.capitalize(base.abilities[0]);
        lines.push('Habilidad: ' + abName);
    }
    if (p.heldItems && p.heldItems.length > 0) {
        var heldNames = p.heldItems.map(function(k) {
            var d = PMZ.Data.item(k);
            return d ? d.name : k;
        }).join(', ');
        lines.push('Objeto: ' + heldNames);
    } else {
        lines.push('Objeto: (ninguno)');
    }
    lines.push('Felicidad: ' + (p.happiness || 70) + '/255');
    lines.push('Shiny: ' + (p.shiny ? 'Si!' : 'No'));
    lines.push('Genero: ' + (p.gender === 'male' ? 'Macho' : (p.gender === 'female' ? 'Hembra' : 'Sin genero')));
    var nMods = PMZ.Pokemon._natureMods[p.nature] || PMZ.Pokemon._natureMods['hardy'];
    var labels2 = { attack: 'Atk', defense: 'Def', spAttack: 'At.E', spDefense: 'D.E', speed: 'Vel' };
    var natureStr = PMZ.Utils.capitalize(p.nature || 'serious');
    if (nMods.up || nMods.down) {
        var u = nMods.up ? ' +' + (labels2[nMods.up] || nMods.up) : '';
        var d = nMods.down ? ' -' + (labels2[nMods.down] || nMods.down) : '';
        natureStr += ' (' + (u + d).trim() + ')';
    }
    lines.push('Naturaleza: ' + natureStr);
    // Evolution info
    if (base && base.evolutions && base.evolutions.length > 0) {
        var evoNames = base.evolutions.map(function(e) {
            var eb = PMZ.Data.pokemon(e.to);
            return eb ? eb.name : e.to;
        }).join(', ');
        lines.push('Evoluciona a: ' + evoNames);
    } else {
        lines.push('(No evoluciona)');
    }

    for (var i = 0; i < lines.length; i++) {
        this.drawText(lines[i], x, y + 22 + i * 20, 350, 'left');
    }
};

// ============================================================================
// Window_PMZ_Summary_Moves
// ============================================================================
function Window_PMZ_Summary_Moves() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_Summary_Moves.prototype = Object.create(Window_Base.prototype);
Window_PMZ_Summary_Moves.prototype.constructor = Window_PMZ_Summary_Moves;

Window_PMZ_Summary_Moves.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
};

Window_PMZ_Summary_Moves.prototype.setPokemon = function(pkmn) {
    if (this._pkmn === pkmn) return;
    this._pkmn = pkmn;
    this.refresh();
};

Window_PMZ_Summary_Moves.prototype.refresh = function() {
    this.contents.clear();
    if (!this._pkmn) return;

    var p = this._pkmn;
    var x = 10;
    var y = 10;

    this.drawText('Movimientos', x, y, 300, 'left');

    if (!p.moves || p.moves.length === 0) {
        this.drawText('(Sin movimientos)', x + 10, y + 30, 200, 'left');
        return;
    }

    for (var i = 0; i < Math.min(4, p.moves.length); i++) {
        var m = p.moves[i];
        var my = y + 30 + i * 58;

        // Type icon
        PMZ.Utils.drawTypeBadge(this.contents, m.type || 'normal', x, my, 50, 22);

        // Name
        this.drawText(m.name || '???', x + 68, my, 150, 'left');

        // Category
        var catLabel = '';
        if (m.category === 'physical') catLabel = 'Fis';
        else if (m.category === 'special') catLabel = 'Esp';
        else catLabel = 'Sta';
        this.drawText(catLabel, x + 68, my + 20, 40, 'left');

        // Power
        var powText = m.power > 0 ? String(m.power) : '---';
        this.drawText('Pot: ' + powText, x + 120, my + 20, 80, 'left');

        // PP
        var ppText = m.pp + '/' + m.maxPp;
        this.drawText('PP: ' + ppText, x + 68, my + 36, 100, 'left');

        // Accuracy
        var accText = m.accuracy ? String(m.accuracy) : '---';
        this.drawText('Pre: ' + accText, x + 68, my + 50, 80, 'left');

        // Separator line
        if (i < Math.min(3, p.moves.length - 1)) {
            this.contents.fillRect(x + 68, my + 56, 230, 1, '#404040');
        }
    }
};

// ============================================================================
// Window_PMZ_Info
// ============================================================================
function Window_PMZ_Info() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_Info.prototype = Object.create(Window_Base.prototype);
Window_PMZ_Info.prototype.constructor = Window_PMZ_Info;

Window_PMZ_Info.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
};

Window_PMZ_Info.prototype.setPokemon = function(pkmn) {
    if (this._pkmn === pkmn) return;
    this._pkmn = pkmn;
    this.refresh();
};

Window_PMZ_Info.prototype.refresh = function() {
    this.contents.clear();
    if (!this._pkmn) return;

    var p = this._pkmn;

    this.drawText('Datos', 10, 10, 200, 'left');

    var info = [];
    info.push('ID: #' + String(p.id).padStart(3, '0'));
    info.push('Especie: ' + p.name);
    if (!PMZ.Config.isStatEvolution()) info.push('Nivel: ' + p.level);
    info.push('Naturaleza: ' + PMZ.Utils.capitalize(p.nature || 'serious'));
    info.push('Captura: ' + (p.catchRate || 45));
    info.push('Shiny: ' + (p.shiny ? 'Si' : 'No'));
    if (p.heldItems && p.heldItems.length > 0) {
        var held = p.heldItems.map(function(k) {
            var d = PMZ.Data.item(k);
            return d ? d.name : k;
        }).join(', ');
        info.push('Equipado: ' + held);
    }

    for (var i = 0; i < info.length; i++) {
        this.drawText(info[i], 10, 30 + i * 22, 280, 'left');
    }
};

// ============================================================================
// Scene_PMZ_Party - Main Party Scene
// ============================================================================
function Scene_PMZ_Party() {
    this.initialize.apply(this, arguments);
}

Scene_PMZ_Party.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PMZ_Party.prototype.constructor = Scene_PMZ_Party;

Scene_PMZ_Party.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_PMZ_Party.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createPartyWindow();
    this.createInfoWindow();
    this.createCommandWindow();
};

Scene_PMZ_Party.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Base(0, 0, Graphics.boxWidth, 58);
    this._helpWindow.contents.fontSize = 26;
    this._helpWindow.drawText('EQUIPO POKEMON', 12, 6, 320, 'left');
    this._helpWindow.contents.fontSize = 20;
    this._helpWindow.changeTextColor('#f8d030');
    this._helpWindow.drawText(PMZ.Party.count() + '/' + (PMZ.Data.configValue('maxPartySize') || 6), Graphics.boxWidth - 90, 8, 80, 'right');
    this._helpWindow.resetTextColor();
    this._helpWindow.contents.fontSize = 18;
    this._helpWindow.drawText('\u2666 ' + PMZ.Money.get(), 12, 32, 160, 'left');
    this.addWindow(this._helpWindow);
};

Scene_PMZ_Party.prototype.createPartyWindow = function() {
    var w = Graphics.boxWidth;
    this._partyWindow = new Window_PMZ_PartyList(0, 54, Math.floor(w * 0.55), Graphics.boxHeight - 54);
    this._partyWindow.setHandler('ok', this.onPartyOk.bind(this));
    this._partyWindow.setHandler('cancel', this.onPartyCancel.bind(this));
    this.addWindow(this._partyWindow);
};

Scene_PMZ_Party.prototype.createInfoWindow = function() {
    var w = Graphics.boxWidth;
    var x = Math.floor(w * 0.55);
    var rightW = w - x;
    var iconArea = 100;

    var statsY = 50;
    var cmdH = 244;
    var statsH = Graphics.boxHeight - statsY - cmdH;
    this._statsWindow = new Window_PMZ_Summary_Stats(x, statsY, rightW - iconArea, Math.max(180, statsH));
    this.addWindow(this._statsWindow);

    this._partySprite = new Sprite_PMZ_Icon();
    this._partySprite.anchor.x = 0.5;
    this._partySprite.anchor.y = 0.5;
    this._partySprite.x = x + rightW - 50;
    this._partySprite.y = statsY + 50;
    this._partySprite.scale.x = 2.5;
    this._partySprite.scale.y = 2.5;
    if (this._windowLayer) {
        this._windowLayer.addChild(this._partySprite);
    } else {
        this.addChild(this._partySprite);
    }
};

Scene_PMZ_Party.prototype.createCommandWindow = function() {
    var w = Graphics.boxWidth;
    var x = Math.floor(w * 0.55);
    var rightW = w - x;
    var cmdH = 244;
    var cmdY = Graphics.boxHeight - cmdH;
    this._commandWindow = new Window_Command(x, cmdY, ['Resumen', 'Mover', 'Objeto', 'Equipar', 'Salir'], rightW, cmdH);
    this._commandWindow.setHandler('Resumen', this.onSummary.bind(this));
    this._commandWindow.setHandler('Mover', this.onMove.bind(this));
    this._commandWindow.setHandler('Objeto', this.onItem.bind(this));
    this._commandWindow.setHandler('Equipar', this.onEquip.bind(this));
    this._commandWindow.setHandler('Salir', this.onCancel.bind(this));
    this._commandWindow.deactivate();
    this.addWindow(this._commandWindow);
};

Scene_PMZ_Party.prototype.onPartyOk = function() {
    var index = this._partyWindow.index();
    var pkmn = $gamePMZ.party()[index];
    if (!pkmn) return;

    if (this._moveMode) {
        var src = this._moveSource;
        if (src === index) {
            this._moveMode = false;
            this._moveSource = -1;
            this.refreshHeader();
            this._commandWindow.activate();
            this._partyWindow.deactivate();
            return;
        }
        var party = $gamePMZ.party();
        var temp = party[src];
        party[src] = party[index];
        party[index] = temp;
        this._partyWindow.refresh();
        this._moveMode = false;
        this._moveSource = -1;
        this.refreshHeader();
        this._commandWindow.activate();
        this._partyWindow.deactivate();
        return;
    }

    this._selectedPkmn = pkmn;
    this.updateInfoWindows();
    this._commandWindow.activate();
    this._partyWindow.deactivate();
};

Scene_PMZ_Party.prototype.updateInfoWindows = function() {
    var pkmn = this._selectedPkmn;
    if (!pkmn) return;
    this._statsWindow.setPokemon(pkmn);
    this._partySprite.setPokemon(pkmn);
};

Scene_PMZ_Party.prototype.onSummary = function() {
    if (this._selectedPkmn) {
        PMZ.Menu._summaryIndex = this._partyWindow.index();
        SceneManager.push(Scene_PMZ_Summary);
    }
};

Scene_PMZ_Party.prototype.onMove = function() {
    this._partyWindow.activate();
    this._commandWindow.deactivate();
    this._moveMode = true;
    this._moveSource = this._partyWindow.index();
};

Scene_PMZ_Party.prototype.refreshHeader = function(msg, pkmn) {
    if (!this._helpWindow) return;
    var w = this._helpWindow;
    w.contents.clear();
    w.contents.fontSize = 26;
    w.drawText('EQUIPO POKEMON', 12, 6, 320, 'left');
    w.contents.fontSize = 20;
    w.changeTextColor('#f8d030');
    w.drawText(PMZ.Party.count() + '/' + (PMZ.Data.configValue('maxPartySize') || 6), Graphics.boxWidth - 90, 8, 80, 'right');
    w.resetTextColor();
    w.contents.fontSize = 18;
    w.drawText('\u2666 ' + PMZ.Money.get(), 12, 32, 160, 'left');
    // Held-item slot indicator (right of money)
    if (pkmn) {
        var max = PMZ.HoldItems.maxSlots();
        var used = PMZ.HoldItems.heldItems(pkmn).length;
        w.changeTextColor(used >= max ? '#ff8888' : '#aaffaa');
        w.drawText('Slots: ' + used + '/' + max, 12, 32, 160, 'right');
        w.resetTextColor();
    }
    if (msg) {
        w.contents.fontSize = 18;
        w.drawText(msg, 140, 32, 400, 'left');
    }
};

Scene_PMZ_Party.prototype.onCancel = function() {
    this._partyWindow.activate();
    this._commandWindow.deactivate();
};

Scene_PMZ_Party.prototype.onPartyCancel = function() {
    if (this._moveMode) {
        this._moveMode = false;
        this._moveSource = -1;
        this.refreshHeader();
        this._commandWindow.activate();
        this._partyWindow.deactivate();
    } else {
        this.popScene();
    }
};

Scene_PMZ_Party.prototype.popScene = function() {
    Scene_MenuBase.prototype.popScene.call(this);
};

// ============================================================================
// Window_PMZ_SummaryTabs - Tab bar horizontal para el resumen
// ============================================================================
function Window_PMZ_SummaryTabs() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_SummaryTabs.prototype = Object.create(Window_Command.prototype);
Window_PMZ_SummaryTabs.prototype.constructor = Window_PMZ_SummaryTabs;

Window_PMZ_SummaryTabs.prototype.initialize = function(x, y, commands) {
    Window_Command.prototype.initialize.call(this, x, y, commands, Graphics.boxWidth);
};

Window_PMZ_SummaryTabs.prototype.maxCols = function() { return 5; };
Window_PMZ_SummaryTabs.prototype.maxItems = function() { return 5; };
Window_PMZ_SummaryTabs.prototype.itemHeight = function() { return 36; };

Window_PMZ_SummaryTabs.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    var commands = ['Stats', 'Movimientos', 'IV/EV', 'Datos', 'Info'];
    this.contents.fontSize = 18;
    this.changeTextColor(this.index() === index ? '#f8d030' : '#ffffff');
    this.drawText(commands[index] || '---', rect.x, rect.y + 8, rect.width, 'center');
    this.resetTextColor();
    this.contents.fontSize = 22;
};

// ============================================================================
// Scene_PMZ_Summary - Detailed Pokemon Summary
// ============================================================================
function Scene_PMZ_Summary() {
    this.initialize.apply(this, arguments);
}

Scene_PMZ_Summary.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PMZ_Summary.prototype.constructor = Scene_PMZ_Summary;

Scene_PMZ_Summary.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_PMZ_Summary.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHeader();
    this.createStatsPage();
    this.createMovesPage();
    this.createIvEvPage();
    this.createDataPage();
    this.createTabWindow();
};

Scene_PMZ_Summary.prototype.popScene = function() {
    Scene_MenuBase.prototype.popScene.call(this);
};

Scene_PMZ_Summary.prototype.createHeader = function() {
    var pkmn = this.getPokemon();
    if (!pkmn) return;

    this._headerWindow = new Window_Base(0, 0, Graphics.boxWidth, 48);
    this._headerWindow.drawText(pkmn.name + (PMZ.Config.isStatEvolution() ? '' : '  Lv' + pkmn.level), 10, 12, 300, 'left');

    if (pkmn.types) {
        for (var i = 0; i < pkmn.types.length; i++) {
            PMZ.Utils.drawTypeBadge(this._headerWindow.contents, pkmn.types[i], Graphics.boxWidth - 160 + i * 72, 12, 68, 22);
        }
    }

    this.addWindow(this._headerWindow);

    this._sprite = new Sprite_PMZ_Pokemon();
    this._sprite.setPokemon(pkmn, false);
    this._sprite.x = Graphics.boxWidth - 260;
    this._sprite.y = 56;
    this._sprite.scale.x = 1.2;
    this._sprite.scale.y = 1.2;
    this.addChild(this._sprite);
};

Scene_PMZ_Summary.prototype.createStatsPage = function() {
    var pkmn = this.getPokemon();
    if (!pkmn) return;

    var w = Graphics.boxWidth;
    var h = Graphics.boxHeight - 96;
    this._statsPage = new Window_PMZ_Summary_Stats(0, 48, w, h);
    this._statsPage.setPokemon(pkmn);
    this._statsPage.hide();
    this.addWindow(this._statsPage);
};

Scene_PMZ_Summary.prototype.createMovesPage = function() {
    var pkmn = this.getPokemon();
    if (!pkmn) return;

    var w = Graphics.boxWidth;
    var h = Graphics.boxHeight - 96;
    this._movesPage = new Window_PMZ_Summary_Moves(0, 48, w, h);
    this._movesPage.setPokemon(pkmn);
    this._movesPage.hide();
    this.addWindow(this._movesPage);
};

Scene_PMZ_Summary.prototype.createIvEvPage = function() {
    var pkmn = this.getPokemon();
    if (!pkmn) return;

    var w = Graphics.boxWidth;
    var h = Graphics.boxHeight - 96;
    this._ivEvPage = new Window_PMZ_Summary_StatsIV(0, 48, w, h);
    this._ivEvPage.setPokemon(pkmn);
    this._ivEvPage.hide();
    this.addWindow(this._ivEvPage);
};

Scene_PMZ_Summary.prototype.createDataPage = function() {
    var pkmn = this.getPokemon();
    if (!pkmn) return;

    var w = Graphics.boxWidth;
    var h = Graphics.boxHeight - 96;
    this._dataPage = new Window_PMZ_Data(0, 48, w, h);
    this._dataPage.setPokemon(pkmn);
    this._dataPage.hide();
    this.addWindow(this._dataPage);
};

Scene_PMZ_Summary.prototype.createTabWindow = function() {
    var w = Graphics.boxWidth;
    var h = Graphics.boxHeight - 96;
    this._infoPage = new Window_PMZ_Info(0, 48, w, h);
    this._infoPage.hide();
    this.addWindow(this._infoPage);

    this._tabWindow = new Window_PMZ_SummaryTabs(0, Graphics.boxHeight - 48, ['Stats', 'Movimientos', 'IV/EV', 'Datos', 'Info']);
    this._tabWindow.setHandler('Stats', this.showStats.bind(this));
    this._tabWindow.setHandler('Movimientos', this.showMoves.bind(this));
    this._tabWindow.setHandler('IV/EV', this.showIvEv.bind(this));
    this._tabWindow.setHandler('Datos', this.showData.bind(this));
    this._tabWindow.setHandler('Info', this.showInfo.bind(this));
    this._tabWindow.setHandler('cancel', this.popScene.bind(this));
    this._tabWindow.activate();
    this.addWindow(this._tabWindow);

    this.showStats();
};

Scene_PMZ_Summary.prototype.getPokemon = function() {
    var idx = PMZ.Menu._summaryIndex || 0;
    return $gamePMZ.party()[idx] || null;
};

Scene_PMZ_Summary.prototype.showStats = function() {
    this._statsPage.show();
    this._movesPage.hide();
    if (this._ivEvPage) this._ivEvPage.hide();
    if (this._dataPage) this._dataPage.hide();
    if (this._infoPage) this._infoPage.hide();
    SoundManager.playCursor();
    this._tabWindow.activate();
};

Scene_PMZ_Summary.prototype.showMoves = function() {
    this._statsPage.hide();
    this._movesPage.show();
    if (this._ivEvPage) this._ivEvPage.hide();
    if (this._dataPage) this._dataPage.hide();
    if (this._infoPage) this._infoPage.hide();
    SoundManager.playCursor();
    this._tabWindow.activate();
};

Scene_PMZ_Summary.prototype.showIvEv = function() {
    var pkmn = this.getPokemon();
    if (!pkmn) return;
    this._statsPage.hide();
    this._movesPage.hide();
    if (this._ivEvPage) { this._ivEvPage.show(); this._ivEvPage.setPokemon(pkmn); }
    if (this._dataPage) this._dataPage.hide();
    if (this._infoPage) this._infoPage.hide();
    SoundManager.playCursor();
    this._tabWindow.activate();
};

Scene_PMZ_Summary.prototype.showData = function() {
    var pkmn = this.getPokemon();
    if (!pkmn) return;
    this._statsPage.hide();
    this._movesPage.hide();
    if (this._ivEvPage) this._ivEvPage.hide();
    if (this._dataPage) { this._dataPage.show(); this._dataPage.setPokemon(pkmn); }
    if (this._infoPage) this._infoPage.hide();
    SoundManager.playCursor();
    this._tabWindow.activate();
};

Scene_PMZ_Summary.prototype.showInfo = function() {
    var pkmn = this.getPokemon();
    if (!pkmn) return;

    if (!this._infoPage) {
        var w = Graphics.boxWidth;
        var h = Graphics.boxHeight - 96;
        this._infoPage = new Window_PMZ_Info(0, 48, w, h);
        this.addWindow(this._infoPage);
    }

    this._statsPage.hide();
    this._movesPage.hide();
    if (this._ivEvPage) this._ivEvPage.hide();
    if (this._dataPage) this._dataPage.hide();
    this._infoPage.show();
    this._infoPage.setPokemon(pkmn);
    SoundManager.playCursor();
    this._tabWindow.activate();
};

// ============================================================================
// Window_PMZ_ItemList - Lista de objetos usables
// ============================================================================
function Window_PMZ_ItemList() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_ItemList.prototype = Object.create(Window_Selectable.prototype);
Window_PMZ_ItemList.prototype.constructor = Window_PMZ_ItemList;

Window_PMZ_ItemList.prototype.initialize = function(x, y, width, height) {
    this._items = [];
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
};

Window_PMZ_ItemList.prototype.setItems = function(items) {
    this._items = items;
    this.refresh();
    this.select(0);
};

Window_PMZ_ItemList.prototype.maxItems = function() {
    return this._items.length;
};

Window_PMZ_ItemList.prototype.maxCols = function() {
    return 1;
};

Window_PMZ_ItemList.prototype.itemHeight = function() {
    return 44;
};

Window_PMZ_ItemList.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    var item = this._items[index];
    if (!item) return;

    var data = item.data || PMZ.Data.item(item.key);
    var name = data ? data.name : item.key;
    this.resetTextColor();

    // Shop mode: show prices + color-code
    if (this._shopMode === 'buy') {
        var price = (item.customPrice > 0) ? item.customPrice : (data ? data.price : 0);
        var stock = item.stock || 0;
        var bought = ($gamePMZ && $gamePMZ._shopBought) ? ($gamePMZ._shopBought[item.key] || 0) : 0;
        var outOfStock = stock > 0 && bought >= stock;
        var canAfford = PMZ.Money.has(price);

        if (outOfStock) {
            this.changeTextColor('#666666');
        } else if (!canAfford) {
            this.changeTextColor('#ff6666');
        } else {
            this.changeTextColor('#ffffff');
        }
        this.drawText(name, rect.x + 8, rect.y + 10, rect.width - 200, 'left');

        this.changeTextColor(outOfStock ? '#666666' : (canAfford ? '#ffd700' : '#ff6666'));
        this.drawText('$' + price, rect.x + rect.width - 140, rect.y + 10, 60, 'right');

        if (stock > 0) {
            var remaining = stock - bought;
            this.changeTextColor(outOfStock ? '#666666' : '#aaaaaa');
            this.drawText('x' + remaining, rect.x + rect.width - 60, rect.y + 10, 56, 'right');
        }
    } else if (this._shopMode === 'sell') {
        var sellPrice = data ? Math.floor((data.price || 0) / 2) : 0;
        this.drawText(name, rect.x + 8, rect.y + 10, rect.width - 200, 'left');
        this.changeTextColor('#ffd700');
        this.drawText('$' + sellPrice, rect.x + rect.width - 140, rect.y + 10, 60, 'right');
        this.changeTextColor('#aaaaaa');
        this.drawText('x' + item.count, rect.x + rect.width - 60, rect.y + 10, 56, 'right');
    } else {
        this.changeTextColor(data ? '#ffffff' : '#888888');
        this.drawText(name, rect.x + 4, rect.y + 10, 160, 'left');
        this.drawText('x' + item.count, rect.x + rect.width - 70, rect.y + 10, 60, 'right');
    }
    this.resetTextColor();
};

Window_PMZ_ItemList.prototype.item = function() {
    return this._items[this.index()] || null;
};

Window_PMZ_ItemList.prototype.refresh = function() {
    this.contents.clear();
    this.drawAllItems();
};

// ============================================================================
// Scene_PMZ_ItemUse - Usar objeto en Pokemon del equipo
// ============================================================================
function Scene_PMZ_ItemUse() {
    this.initialize.apply(this, arguments);
}

Scene_PMZ_ItemUse.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PMZ_ItemUse.prototype.constructor = Scene_PMZ_ItemUse;

Scene_PMZ_ItemUse.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    this._itemKey = PMZ.Menu._useItemKey || '';
    this._itemData = PMZ.Menu._useItemData || null;
};

Scene_PMZ_ItemUse.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);

    this._helpWindow = new Window_Base(0, 0, Graphics.boxWidth, 50);
    this._helpWindow.drawText('Usar ' + this._itemData.name + ' en...', 10, 14, 400, 'left');
    this.addWindow(this._helpWindow);

    this._partyWindow = new Window_PMZ_PartyList(0, 50, Graphics.boxWidth, Graphics.boxHeight - 50);
    this._partyWindow.setHandler('ok', this.onPokemonOk.bind(this));
    this._partyWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._partyWindow);
};

Scene_PMZ_ItemUse.prototype.onPokemonOk = function() {
    var index = this._partyWindow.index();
    var target = $gamePMZ.party()[index];
    if (!target) return;

    var result = PMZ.Items.useItem(this._itemKey, target);
    if (result.success) {
        this._msgText = result.msg;
        if (result.evolved) {
            PMZ.Menu._evolutionMsg = target.name + ' evoluciono!';
        }
        this.popScene();
        if (result.evolved) {
            setTimeout(function() {
                $gameTemp._pmzEvolutionMsg = PMZ.Menu._evolutionMsg;
            }, 100);
        } else if (result.needReplace) {
            // TM/HM with full party: open MoveLearn, then close this scene
            setTimeout(function() {
                SceneManager.push(Scene_PMZ_MoveLearn);
            }, 80);
        } else {
            setTimeout(function() {
                $gameTemp._pmzPartyRefresh = true;
            }, 100);
        }
    } else {
        SoundManager.playBuzzer();
        this._helpWindow.contents.clear();
        this._helpWindow.drawText(result.msg, 10, 14, 400, 'left');
    }
};

// ============================================================================
// Scene_PMZ_Center - Centro Pokemon
// ============================================================================
function Scene_PMZ_Center() {
    this.initialize.apply(this, arguments);
}

Scene_PMZ_Center.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PMZ_Center.prototype.constructor = Scene_PMZ_Center;

Scene_PMZ_Center.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_PMZ_Center.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);

    this._step = 0;
    this._waitCount = 60;

    this._msgWindow = new Window_Base(0, 0, Graphics.boxWidth, Graphics.boxHeight);
    this._msgWindow.drawText('Bienvenido al Centro Pokemon!', 20, 80, 600, 'left');
    this._msgWindow.drawText('Vamos a curar a tus Pokemon.', 20, 120, 600, 'left');
    this.addWindow(this._msgWindow);
};

Scene_PMZ_Center.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);

    if (this._waitCount > 0) {
        this._waitCount--;
        return;
    }

    switch (this._step) {
        case 0:
            PMZ.Party.healAll();
            this._msgWindow.contents.clear();
            this._msgWindow.drawText('Tus Pokemon han sido curados!', 20, 80, 600, 'left');
            this._step = 1;
            this._waitCount = 80;
            break;
        case 1:
            if ($gamePlayer) {
                var mapId = $gameMap.mapId();
                var x = $gamePlayer.x;
                var y = $gamePlayer.y;
                $gamePMZ.setLastPokeCenter({ mapId: mapId, x: x, y: y });
            }
            this._step = 2;
            this._waitCount = 40;
            break;
        case 2:
            SceneManager.pop();
            break;
    }
};

// ============================================================================
// Scene_PMZ_Shop - Tienda Pokemon
// ============================================================================
function Scene_PMZ_Shop() {
    this.initialize.apply(this, arguments);
}

Scene_PMZ_Shop.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PMZ_Shop.prototype.constructor = Scene_PMZ_Shop;

Scene_PMZ_Shop.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    this._mode = 'buy';
    this._customItems = Scene_PMZ_Shop._customItems || null;
    this._customStock = Scene_PMZ_Shop._customStock || null;
    Scene_PMZ_Shop._customItems = null;
    Scene_PMZ_Shop._customStock = null;
};

Scene_PMZ_Shop.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);

    var H = Graphics.boxHeight;
    var W = Graphics.boxWidth;

    // Header (60px) - title + money
    this._helpWindow = new Window_Base(0, 0, W, 60);
    this.drawHeader();
    this.addWindow(this._helpWindow);

    // Item list (60 to H-120) - 504px tall, fits ~11 items at 44px
    this._itemList = this.buildBuyList();
    console.log('[PMZ Shop] items in list:', this._itemList.length);
    this._listWindow = new Window_PMZ_ItemList(0, 60, W, H - 120);
    this._listWindow._shopMode = 'buy';
    this._listWindow.setItems(this._itemList);
    this._listWindow.setHandler('ok', this.onItemOk.bind(this));
    this._listWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._listWindow);

    // Detail (H-120 to H) - 120px tall, shows item info + transaction msg
    this._detailWindow = new Window_Base(0, H - 120, W, 120);
    this.addWindow(this._detailWindow);

    // Commands - full screen, hidden when in list mode
    this._cmdWindow = new Window_Command(0, 60, ['Comprar', 'Vender', 'Salir']);
    console.log('[PMZ Shop] cmd commands:', this._cmdWindow._list.length, this._cmdWindow._list.map(function(c){return c.symbol;}));
    this._cmdWindow.setHandler('Comprar', this.onBuy.bind(this));
    this._cmdWindow.setHandler('Vender', this.onSell.bind(this));
    this._cmdWindow.setHandler('Salir', this.popScene.bind(this));
    this._cmdWindow.activate();
    this._listWindow.hide();
    this._detailWindow.hide();
    this.addWindow(this._cmdWindow);
};

Scene_PMZ_Shop.prototype.drawHeader = function() {
    var w = this._helpWindow;
    w.contents.clear();
    // Title with gold color
    w.changeTextColor('#ffd700');
    w.drawText('TIENDA POKEMON', 10, 8, 300, 'left');
    w.resetTextColor();
    // Money display
    w.drawText('$' + PMZ.Money.get(), Graphics.boxWidth - 140, 8, 130, 'right');
    // Separator line at bottom
    w.contents.paintOpacity = 80;
    for (var x = 0; x < Graphics.boxWidth; x += 4) {
        w.contents.fillRect(x, 56, 2, 2, '#ffffff');
    }
    w.contents.paintOpacity = 255;
};

Scene_PMZ_Shop.prototype.buildBuyList = function() {
    if (this._customItems && this._customItems.length > 0) {
        var stock = this._customStock || {};
        return this._customItems.map(function(item) {
            return { key: item.key, count: 0, customPrice: item.price || 0, stock: stock[item.key] || 0 };
        }).filter(function(item) {
            return PMZ.Data.item(item.key);
        });
    }
    var cfg = PMZ.Data.config();
    var keys = cfg ? (cfg.martItems || []) : [];
    return keys.map(function(k) {
        return { key: k, count: 0, customPrice: 0, stock: 0 };
    }).filter(function(item) {
        return PMZ.Data.item(item.key);
    });
};

Scene_PMZ_Shop.prototype.onBuy = function() {
    this._mode = 'buy';
    this._msgText = null;
    this._itemList = this.buildBuyList();
    this._listWindow._shopMode = 'buy';
    this._listWindow.setItems(this._itemList);
    this._cmdWindow.deactivate();
    this._cmdWindow.hide();
    this._listWindow.show();
    this._listWindow.activate();
    this._detailWindow.show();
    this.updateDetail();
    SoundManager.playOk();
};

Scene_PMZ_Shop.prototype.onSell = function() {
    this._mode = 'sell';
    this._msgText = null;
    var sellItems = [];
    var bag = $gamePMZ.itemBag();
    for (var key in bag) {
        if (!bag.hasOwnProperty(key) || bag[key] <= 0) continue;
        if (key.indexOf('tm') === 0 || key.indexOf('hm') === 0) continue;
        var data = PMZ.Data.item(key);
        if (!data || data.type === 'tm' || data.type === 'hm') continue;
        sellItems.push({ key: key, count: bag[key] });
    }
    this._itemList = sellItems;
    this._listWindow._shopMode = 'sell';
    this._listWindow.setItems(this._itemList);
    this._cmdWindow.deactivate();
    this._cmdWindow.hide();
    this._listWindow.show();
    this._listWindow.activate();
    this._detailWindow.show();
    this.updateDetail();
    SoundManager.playOk();
};

Scene_PMZ_Shop.prototype.onItemCancel = function() {
    this._listWindow.hide();
    this._listWindow.deactivate();
    this._detailWindow.hide();
    this._msgText = null;
    this._cmdWindow.show();
    this._cmdWindow.activate();
};

Scene_PMZ_Shop.prototype.onItemOk = function() {
    var item = this._listWindow.item();
    if (!item) { this._listWindow.activate(); return; }
    var data = PMZ.Data.item(item.key);
    if (!data) { this._listWindow.activate(); return; }

    this._msgText = null;
    this._msgColor = '#88ff88';

    if (this._mode === 'buy') {
        var price = (item.customPrice > 0) ? item.customPrice : data.price;
        if (item.stock > 0) {
            var bought = $gamePMZ._shopBought || {};
            if ((bought[item.key] || 0) >= item.stock) {
                SoundManager.playBuzzer();
                this._msgText = 'Sin stock!';
                this._msgColor = '#ff6666';
                this.updateDetail();
                this._listWindow.activate();
                return;
            }
        }
        if (PMZ.Money.has(price)) {
            PMZ.Money.remove(price);
            PMZ.Items.add(item.key);
            if (item.stock > 0) {
                if (!$gamePMZ._shopBought) $gamePMZ._shopBought = {};
                $gamePMZ._shopBought[item.key] = ($gamePMZ._shopBought[item.key] || 0) + 1;
            }
            this.refreshMoney();
            this._msgText = 'Compraste ' + data.name + '!';
            this._msgColor = '#88ff88';
            SoundManager.playOk();
        } else {
            SoundManager.playBuzzer();
            this._msgText = 'No tienes suficiente dinero!';
            this._msgColor = '#ff6666';
        }
        this._listWindow.activate();
    } else {
        var sellPrice = Math.floor((data.price || 0) / 2);
        PMZ.Money.add(sellPrice);
        PMZ.Items.remove(item.key);
        this.refreshMoney();
        this._msgText = 'Vendiste ' + data.name + ' por $' + sellPrice + '!';
        this._msgColor = '#88ff88';
        SoundManager.playOk();
        this.onSell();
        return;
    }
    this.updateDetail();
};

Scene_PMZ_Shop.prototype.refreshMoney = function() {
    this.drawHeader();
};

Scene_PMZ_Shop.prototype.updateDetail = function() {
    var item = this._listWindow.item();
    this._detailWindow.contents.clear();
    if (!item) {
        // Even if no item, show last transaction message
        if (this._msgText) {
            this._detailWindow.changeTextColor(this._msgColor || '#ffffff');
            this._detailWindow.drawText(this._msgText, 10, 6, Graphics.boxWidth - 20, 'left');
            this._detailWindow.resetTextColor();
        }
        return;
    }
    var data = PMZ.Data.item(item.key);
    if (!data) return;
    var W = Graphics.boxWidth;
    if (this._mode === 'buy') {
        var price = (item.customPrice > 0) ? item.customPrice : data.price;
        var bought = $gamePMZ._shopBought || {};
        var remaining = item.stock > 0 ? (item.stock - (bought[item.key] || 0)) : null;
        var canAfford = PMZ.Money.has(price);
        var outOfStock = remaining !== null && remaining <= 0;

        // Line 1: item name
        this._detailWindow.changeTextColor('#ffffff');
        this._detailWindow.drawText(data.name, 10, 6, 320, 'left');

        // Line 2: price + stock
        this._detailWindow.changeTextColor(canAfford ? '#ffd700' : '#ff6666');
        this._detailWindow.drawText('Precio: $' + price, 10, 32, 180, 'left');
        if (remaining !== null) {
            this._detailWindow.changeTextColor(outOfStock ? '#666666' : '#aaaaaa');
            this._detailWindow.drawText('Stock: ' + remaining, 200, 32, 120, 'left');
        }

        // Line 2 right: action hint
        if (outOfStock) {
            this._detailWindow.changeTextColor('#888888');
            this._detailWindow.drawText('Agotado', W - 130, 32, 120, 'right');
        } else if (!canAfford) {
            this._detailWindow.changeTextColor('#ff6666');
            this._detailWindow.drawText('Sin dinero', W - 130, 32, 120, 'right');
        } else {
            this._detailWindow.changeTextColor('#88ff88');
            this._detailWindow.drawText('OK: Comprar', W - 130, 32, 120, 'right');
        }

        // Line 3: transaction message (if any)
        if (this._msgText) {
            this._detailWindow.changeTextColor(this._msgColor || '#ffffff');
            this._detailWindow.drawText(this._msgText, 10, 60, W - 20, 'left');
        } else {
            this._detailWindow.changeTextColor('#888888');
            this._detailWindow.drawText('Esc: Volver al menu', 10, 60, W - 20, 'left');
        }
        this._detailWindow.resetTextColor();
    } else {
        var sellPrice = Math.floor((data.price || 0) / 2);
        this._detailWindow.changeTextColor('#ffffff');
        this._detailWindow.drawText(data.name, 10, 6, 320, 'left');
        this._detailWindow.changeTextColor('#ffd700');
        this._detailWindow.drawText('Venta: $' + sellPrice, 10, 32, 180, 'left');
        this._detailWindow.changeTextColor('#aaaaaa');
        this._detailWindow.drawText('Tienes: ' + item.count, 200, 32, 120, 'left');
        this._detailWindow.changeTextColor('#88ff88');
        this._detailWindow.drawText('OK: Vender', W - 130, 32, 120, 'right');
        if (this._msgText) {
            this._detailWindow.changeTextColor(this._msgColor || '#ffffff');
            this._detailWindow.drawText(this._msgText, 10, 60, W - 20, 'left');
        } else {
            this._detailWindow.changeTextColor('#888888');
            this._detailWindow.drawText('Esc: Volver al menu', 10, 60, W - 20, 'left');
        }
        this._detailWindow.resetTextColor();
    }
};

Scene_PMZ_Shop.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    if (this._listWindow.active) {
        var idx = this._listWindow.index();
        if (this._lastIndex !== idx) {
            this._lastIndex = idx;
            this._msgText = null;
            this.updateDetail();
        }
    }
};

Scene_PMZ_Shop.prototype.popScene = function() {
    Scene_MenuBase.prototype.popScene.call(this);
};

// ============================================================================
// Window_PMZ_BagFilter - Filtro horizontal compacto para la mochila
// ============================================================================
function Window_PMZ_BagFilter() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_BagFilter.prototype = Object.create(Window_Command.prototype);
Window_PMZ_BagFilter.prototype.constructor = Window_PMZ_BagFilter;

Window_PMZ_BagFilter.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y, ['Todos', 'Bolas', 'Medicina', 'Bayas', 'Equipar', 'Campo', 'TMs', 'Evol', 'Otros'], Graphics.boxWidth);
};

Window_PMZ_BagFilter.prototype.maxCols = function() { return 9; };
Window_PMZ_BagFilter.prototype.itemHeight = function() { return 30; };
Window_PMZ_BagFilter.prototype.windowHeight = function() { return this.fittingHeight(1); };

Window_PMZ_BagFilter.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    var cmd = this._list[index];
    var name = cmd ? cmd.name : '---';
    this.contents.fontSize = 15;
    this.changeTextColor(this.index() === index ? '#f8d030' : '#ffffff');
    this.drawText(name, rect.x, rect.y + 6, rect.width, 'center');
    this.resetTextColor();
    this.contents.fontSize = 22;
};

// ============================================================================
// Scene_PMZ_Bag - Mochila fuera de combate
// ============================================================================
function Scene_PMZ_Bag() {
    this.initialize.apply(this, arguments);
}

Scene_PMZ_Bag.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PMZ_Bag.prototype.constructor = Scene_PMZ_Bag;

Scene_PMZ_Bag.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_PMZ_Bag.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);

    this._helpWindow = new Window_Base(0, 0, Graphics.boxWidth, 48);
    this._helpWindow.drawText('MOCHILA', 10, 12, 300, 'left');
    this.addWindow(this._helpWindow);

    this._filter = 'all';
    this.buildItemList();

    this._listWindow = new Window_PMZ_ItemList(0, 85, Graphics.boxWidth, Graphics.boxHeight - 115);
    this._listWindow.setItems(this._itemList);
    this._listWindow.setHandler('ok', this.onItemOk.bind(this));
    this._listWindow.setHandler('cancel', this.onCancel.bind(this));
    this._listWindow.deactivate();
    this.addWindow(this._listWindow);

    this.createFilterWindow();
    this._needRefresh = false;
};

Scene_PMZ_Bag.prototype.createFilterWindow = function() {
    this._filterWindow = new Window_PMZ_BagFilter(0, 48);
    this._filterWindow.setHandler('Todos', this.onFilter.bind(this, 'all'));
    this._filterWindow.setHandler('Bolas', this.onFilter.bind(this, 'ball'));
    this._filterWindow.setHandler('Medicina', this.onFilter.bind(this, 'medicine'));
    this._filterWindow.setHandler('Bayas', this.onFilter.bind(this, 'berry'));
    this._filterWindow.setHandler('Equipar', this.onFilter.bind(this, 'hold'));
    this._filterWindow.setHandler('Campo', this.onFilter.bind(this, 'field'));
    this._filterWindow.setHandler('Evolucion', this.onFilter.bind(this, 'evolution'));
    this._filterWindow.setHandler('TMs', this.onFilter.bind(this, 'tm'));
    this._filterWindow.setHandler('Otros', this.onFilter.bind(this, 'other'));
    this._filterWindow.setHandler('cancel', this.popScene.bind(this));
    this._filterWindow.activate();
    this.addWindow(this._filterWindow);
};

Scene_PMZ_Bag.prototype.onCancel = function() {
    $gameTemp._pmzPartyRefresh = true;
    this.popScene();
};

// Refresh item list when returning from sub-scenes (e.g., after using an item)
Scene_PMZ_Bag.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    if (this._needRefresh) {
        this._needRefresh = false;
        this.buildItemList();
        this._listWindow.setItems(this._itemList);
    }
};

Scene_PMZ_Bag.prototype.onFilter = function(filter) {
    this._filter = filter;
    this.buildItemList();
    this._listWindow.setItems(this._itemList);
    this._listWindow.select(0);
    this._listWindow.activate();
    this._filterWindow.hide();
    SoundManager.playCursor();
};

Scene_PMZ_Bag.prototype.buildItemList = function() {
    this._itemList = [];
    var bag = $gamePMZ.itemBag();
    var filter = this._filter || 'all';
    for (var key in bag) {
        if (bag.hasOwnProperty(key) && bag[key] > 0) {
            var data = PMZ.Data.item(key);
            if (filter === 'all') {
                this._itemList.push({ key: key, count: bag[key], data: data });
            } else if (filter === 'other') {
                if (!data) continue;
                if (data.type !== 'ball' && data.type !== 'medicine' && data.type !== 'hold' && data.type !== 'field' && data.type !== 'evolution' && data.type !== 'tm' && data.type !== 'hm' && data.effect !== 'berry') {
                    this._itemList.push({ key: key, count: bag[key], data: data });
                }
            } else if (filter === 'tm') {
                if (data && (data.type === 'tm' || data.type === 'hm')) {
                    this._itemList.push({ key: key, count: bag[key], data: data });
                }
            } else if (data && filter === 'berry' && data.effect === 'berry') {
                this._itemList.push({ key: key, count: bag[key], data: data });
            } else if (data && data.type === filter) {
                this._itemList.push({ key: key, count: bag[key], data: data });
            }
        }
    }
};

Scene_PMZ_Bag.prototype.onItemOk = function() {
    var item = this._listWindow.item();
    if (!item) return;
    var data = item.data || PMZ.Data.item(item.key);
    if (!data) {
        SoundManager.playBuzzer();
        return;
    }

    if (data.type === 'medicine' || data.type === 'evolution' || data.type === 'ball' || data.type === 'field' || data.type === 'tm' || data.type === 'hm') {
        if (data.type === 'field' && data.effect === 'repel') {
            var result = PMZ.Items.useItem(item.key, null);
            if (result.success) {
                this._helpWindow.contents.clear();
                this._helpWindow.drawText(result.msg, 10, 14, 400, 'left');
                this.buildItemList();
                this._listWindow.setItems(this._itemList);
                SoundManager.playOk();
            }
            return;
        }
        if (data.type === 'field' && data.effect === 'escape') {
            var result2 = PMZ.Items.useItem(item.key, null);
            if (result2.success) {
                this._helpWindow.contents.clear();
                this._helpWindow.drawText(result2.msg, 10, 14, 400, 'left');
                this.buildItemList();
                this._listWindow.setItems(this._itemList);
                SoundManager.playOk();
                setTimeout(function() {
                    PMZ.Party.healAll();
                    var center = $gamePMZ.lastPokeCenter();
                    if (center) {
                        $gamePlayer.reserveTransfer(center.mapId, center.x, center.y, 2);
                    }
                    if ($gameMap) SceneManager.pop();
                }, 500);
            }
            return;
        }
        // Medicine or evolution stone - select a target Pokemon
        PMZ.Menu._useItemKey = item.key;
        PMZ.Menu._useItemData = data;
        this._needRefresh = true;
        SceneManager.push(Scene_PMZ_ItemUse);
    } else if (data.type === 'hold' || data.type === 'megastone') {
        PMZ.Menu._equipItemKey = item.key;
        this._needRefresh = true;
        SceneManager.push(Scene_PMZ_EquipSelect);
    } else if (data.type === 'battle') {
        this._helpWindow.contents.clear();
        this._helpWindow.drawText('Solo usable en combate.', 10, 14, 400, 'left');
        SoundManager.playBuzzer();
    } else {
        SoundManager.playBuzzer();
    }
};

// ============================================================================
// Scene_PMZ_EquipSelect - Seleccionar Pokemon para equipar objeto
// ============================================================================
function Scene_PMZ_EquipSelect() {
    this.initialize.apply(this, arguments);
}

Scene_PMZ_EquipSelect.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PMZ_EquipSelect.prototype.constructor = Scene_PMZ_EquipSelect;

Scene_PMZ_EquipSelect.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_PMZ_EquipSelect.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);

    var itemKey = PMZ.Menu._equipItemKey || '';
    var data = PMZ.Data.item(itemKey);
    var itemName = data ? data.name : itemKey;

    this._helpWindow = new Window_Base(0, 0, Graphics.boxWidth, 50);
    this._helpWindow.drawText('Equipar ' + itemName + ' a...', 10, 14, 400, 'left');
    this.addWindow(this._helpWindow);

    this._partyWindow = new Window_PMZ_PartyList(0, 50, Graphics.boxWidth, Graphics.boxHeight - 50);
    this._partyWindow.setHandler('ok', this.onPokemonOk.bind(this));
    this._partyWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._partyWindow);
};

Scene_PMZ_EquipSelect.prototype.onPokemonOk = function() {
    var index = this._partyWindow.index();
    var target = $gamePMZ.party()[index];
    if (!target) return;

    var itemKey = PMZ.Menu._equipItemKey;
    if (!itemKey) return;

    if (PMZ.HoldItems.equip(target, itemKey)) {
        var data = PMZ.Data.item(itemKey);
        this._helpWindow.contents.clear();
        this._helpWindow.drawText('Equipado: ' + (data ? data.name : itemKey), 10, 14, 400, 'left');
        SoundManager.playOk();
        setTimeout(function(self) {
            self.popScene();
        }, 500, this);
    } else {
        SoundManager.playBuzzer();
        if (!PMZ.HoldItems.canEquip(target)) {
            this._helpWindow.contents.clear();
            this._helpWindow.drawText('Slots llenos! Desequipa primero.', 10, 14, 400, 'left');
        }
    }
};

// ============================================================================
// Update Scene_PMZ_Party para usar objetos
// ============================================================================
Scene_PMZ_Party.prototype.createItemWindow = function() {
    var w = Graphics.boxWidth;
    var items = this.getUsableItems();
    this._itemWindow = new Window_PMZ_ItemList(0, 60, w, Graphics.boxHeight - 60);
    this._itemWindow.setItems(items);
    this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this._itemWindow.hide();
    this.addWindow(this._itemWindow);
};

Scene_PMZ_Party.prototype.getUsableItems = function() {
    var bag = $gamePMZ.itemBag();
    var usable = [];
    for (var key in bag) {
        if (bag.hasOwnProperty(key) && bag[key] > 0) {
            var data = PMZ.Data.item(key);
            if (data && (data.type === 'medicine' || data.type === 'evolution' || data.type === 'tm' || data.type === 'hm')) {
                usable.push({ key: key, count: bag[key] });
            }
        }
    }
    return usable;
};

// Override to include item window
var _Scene_PMZ_Party_create = Scene_PMZ_Party.prototype.create;
Scene_PMZ_Party.prototype.create = function() {
    _Scene_PMZ_Party_create.call(this);
    this.createItemWindow();
    this.createEquipWindows();
};

Scene_PMZ_Party.prototype.createEquipWindows = function() {
    this._equipWindow = new Window_PMZ_ItemList(0, 60, Graphics.boxWidth, Graphics.boxHeight - 60);
    this._equipWindow.setHandler('ok', this.onEquipOk.bind(this));
    this._equipWindow.setHandler('cancel', this.onEquipCancel.bind(this));
    this._equipWindow.hide();
    this.addWindow(this._equipWindow);

    this._unequipWindow = new Window_PMZ_ItemList(0, 60, Graphics.boxWidth, Graphics.boxHeight - 60);
    this._unequipWindow.setHandler('ok', this.onUnequipOk.bind(this));
    this._unequipWindow.setHandler('cancel', this.onUnequipCancel.bind(this));
    this._unequipWindow.hide();
    this.addWindow(this._unequipWindow);
};

// Override onItem to show item window
Scene_PMZ_Party.prototype.onItem = function() {
    this._itemWindow.setItems(this.getUsableItems());
    this._commandWindow.deactivate();
    this._partyWindow.deactivate();
    this._itemWindow.show();
    this._itemWindow.activate();
    this._itemWindow.select(0);
};

Scene_PMZ_Party.prototype.onItemOk = function() {
    var item = this._itemWindow.item();
    if (!item) return;
    var data = PMZ.Data.item(item.key);
    if (!data) return;
    this._itemWindow.hide();
    this._itemWindow.deactivate();
    this._commandWindow.activate();

    if (data.type === 'medicine' || data.type === 'evolution') {
        PMZ.Menu._useItemKey = item.key;
        PMZ.Menu._useItemData = data;
        SceneManager.push(Scene_PMZ_ItemUse);
    } else {
        SoundManager.playBuzzer();
    }
};

Scene_PMZ_Party.prototype.onItemCancel = function() {
    this._itemWindow.hide();
    this._itemWindow.deactivate();
    this._commandWindow.activate();
};

// ============================================================================
// Equipar objetos en la Party
// ============================================================================
Scene_PMZ_Party.prototype.onEquip = function() {
    var pkmn = this._selectedPkmn;
    if (!pkmn) { SoundManager.playBuzzer(); return; }

    // Show unequip if Pokemon has equipped items
    var equipped = PMZ.HoldItems.heldItems(pkmn);
    if (equipped && equipped.length > 0) {
        this.showEquippedItems(pkmn);
        return;
    }

    // No equipped items → check bag for items to equip
    var bag = $gamePMZ.itemBag();
    var holdItems = [];
    for (var key in bag) {
        if (bag.hasOwnProperty(key) && bag[key] > 0) {
            var data = PMZ.Data.item(key);
            if (data && (data.type === 'hold' || data.type === 'megastone')) {
                holdItems.push({ key: key, count: bag[key] });
            }
        }
    }

    if (holdItems.length === 0) {
        this.refreshHeader('No tienes objetos equipables.', pkmn);
        SoundManager.playBuzzer();
        return;
    }

    this._equipWindow.setItems(holdItems);
    this._commandWindow.deactivate();
    this._equipWindow.show();
    this._equipWindow.activate();
};

Scene_PMZ_Party.prototype.onEquipOk = function() {
    var item = this._equipWindow.item();
    if (!item) return;
    var pkmn = this._selectedPkmn;
    if (!pkmn) return;

    if (PMZ.HoldItems.equip(pkmn, item.key)) {
        var itemName = PMZ.Utils.capitalize(item.key);
        var data = PMZ.Data.item(item.key);
        if (data) itemName = data.name;
        this.refreshHeader('Equipado: ' + itemName, pkmn);
        this._partyWindow.refresh();
        this._equipWindow.hide();
        this._equipWindow.deactivate();
        this._commandWindow.activate();
        SoundManager.playOk();
    } else {
        SoundManager.playBuzzer();
    }
};

Scene_PMZ_Party.prototype.onEquipCancel = function() {
    this._equipWindow.hide();
    this._equipWindow.deactivate();
    this._commandWindow.activate();
};

Scene_PMZ_Party.prototype.showEquippedItems = function(pkmn) {
    var items = PMZ.HoldItems.heldItems(pkmn);
    if (items.length === 0) return;

    var unequipList = [];
    for (var i = 0; i < items.length; i++) {
        var data = PMZ.Data.item(items[i]);
        unequipList.push({ key: items[i], count: 1, name: data ? data.name : items[i] });
    }

    this._unequipWindow.setItems(unequipList);
    this._commandWindow.deactivate();
    this._unequipWindow.show();
    this._unequipWindow.activate();
    this.refreshHeader('Slots llenos. Quitar objeto?', pkmn);
};

Scene_PMZ_Party.prototype.onUnequipOk = function() {
    var item = this._unequipWindow.item();
    if (!item) return;
    var pkmn = this._selectedPkmn;
    if (!pkmn) return;

    if (PMZ.HoldItems.unequip(pkmn, item.key)) {
        var itemName = PMZ.Utils.capitalize(item.key);
        var data = PMZ.Data.item(item.key);
        if (data) itemName = data.name;
        this.refreshHeader('Quitado: ' + itemName);
        this._partyWindow.refresh();
        this._unequipWindow.hide();
        this._unequipWindow.deactivate();
        this._commandWindow.activate();
        SoundManager.playOk();
    } else {
        SoundManager.playBuzzer();
    }
};

Scene_PMZ_Party.prototype.onUnequipCancel = function() {
    this._unequipWindow.hide();
    this._unequipWindow.deactivate();
    this._commandWindow.activate();
};

// Check for evolution notification after returning from item use
var _Scene_PMZ_Party_update = Scene_PMZ_Party.prototype.update;
Scene_PMZ_Party.prototype.update = function() {
    _Scene_PMZ_Party_update.call(this);
    if ($gameTemp._pmzEvolutionMsg) {
        var msg = $gameTemp._pmzEvolutionMsg;
        $gameTemp._pmzEvolutionMsg = null;
        this.refreshHeader(msg);
        this._partyWindow.refresh();
        this.updateInfoWindows();
    }
    if ($gameTemp._pmzPartyRefresh) {
        $gameTemp._pmzPartyRefresh = false;
        this._partyWindow.refresh();
        if (this._selectedPkmn) {
            this.updateInfoWindows();
        }
    }
};

// ============================================================================
// Scene_PMZ_Pokedex - Pokedex Scene
// ============================================================================
function Scene_PMZ_Pokedex() {
    this.initialize.apply(this, arguments);
}

Scene_PMZ_Pokedex.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PMZ_Pokedex.prototype.constructor = Scene_PMZ_Pokedex;

Scene_PMZ_Pokedex.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    this._selectedIndex = 0;
};

Scene_PMZ_Pokedex.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._speciesList = PMZ.Pokedex.allSpecies();
    this.createHeader();
    this.createListWindow();
    this.createDetailWindow();
};

Scene_PMZ_Pokedex.prototype.createHeader = function() {
    this._header = new Window_Base(0, 0, Graphics.boxWidth, 50);
    this._header.drawText('POKEDEX', 10, 14, 200, 'left');
    this._header.drawText(PMZ.Pokedex.caught() + '/' + this._speciesList.length + ' capturados', Graphics.boxWidth - 220, 14, 200, 'right');
    this.addWindow(this._header);
};

Scene_PMZ_Pokedex.prototype.createListWindow = function() {
    var w = Graphics.boxWidth;
    var scene = this;
    function PokedexList() { this.initialize.apply(this, arguments); }
    PokedexList.prototype = Object.create(Window_Selectable.prototype);
    PokedexList.prototype.constructor = PokedexList;
    PokedexList.prototype.initialize = function(x, y, w2, h2) {
        Window_Selectable.prototype.initialize.call(this, x, y, w2, h2);
        this._speciesList = scene._speciesList;
    };
    // Override processOk to NOT deactivate the window — we want the list
    // to stay active for continuous selection/preview after pressing OK.
    PokedexList.prototype.processOk = function() {
        if (this.isCurrentItemEnabled()) {
            this.playOkSound();
            this.updateInputData();
            this.callOkHandler();
        } else {
            this.playBuzzerSound();
        }
    };
    PokedexList.prototype.maxItems = function() { return this._speciesList ? this._speciesList.length : 0; };
    PokedexList.prototype.maxCols = function() { return 1; };
    PokedexList.prototype.itemHeight = function() { return 36; };
    PokedexList.prototype.drawItem = function(index) {
        var rect = this.itemRect(index);
        var key = this._speciesList[index];
        var base = PMZ.Data.pokemon(key);
        if (!base) return;
        var seen = PMZ.Pokedex.isSeen(key);
        var caught = PMZ.Pokedex.isCaught(key);

        // Icon (28x28) on the left
        var iconSize = 28;
        if (seen) {
            PMZ.Icons.drawIcon(this.contents, base.id, rect.x + 4, rect.y + 4, iconSize, iconSize);
        } else {
            // Draw ??? placeholder
            this.changeTextColor('#606060');
            this.drawText('?', rect.x + 8, rect.y + 8, iconSize, 'center');
            this.resetTextColor();
        }

        // Caught/seen marker
        var marker, markerColor;
        if (caught) { marker = '★'; markerColor = '#FFD700'; }
        else if (seen) { marker = '●'; markerColor = '#80C0FF'; }
        else { marker = '○'; markerColor = '#606060'; }
        this.changeTextColor(markerColor);
        this.drawText(marker, rect.x + 36, rect.y + 6, 18, 'center');
        this.resetTextColor();

        // ID + name
        var textColor = seen ? '#ffffff' : '#808080';
        var id = String(base.id || 0).padStart(3, '0');
        var name = seen ? base.name : '???';
        this.changeTextColor(textColor);
        this.drawText(id, rect.x + 56, rect.y + 8, 36, 'left');
        this.drawText(name, rect.x + 96, rect.y + 8, rect.width - 100, 'left');
        this.resetTextColor();
    };

    this._listWindow = new (PokedexList)(0, 50, Math.floor(w * 0.45), Graphics.boxHeight - 100);
    this._listWindow.setHandler('ok', this.onSelect.bind(this));
    this._listWindow.setHandler('cancel', this.popScene.bind(this));
    var listWin = this._listWindow;
    var sceneRef = this;
    listWin._update = listWin.update;
    listWin.update = function() {
        var prevIndex = this.index();
        listWin._update.call(this);
        if (this.index() !== prevIndex) sceneRef.updateDetail();
    };
    this._listWindow.activate();
    this.addWindow(this._listWindow);
};

Scene_PMZ_Pokedex.prototype.createDetailWindow = function() {
    var w = Graphics.boxWidth;
    var x = Math.floor(w * 0.45);
    this._detailWindow = new Window_Base(x, 50, w - x, Graphics.boxHeight - 100);
    this.addWindow(this._detailWindow);
    this.updateDetail();
};

Scene_PMZ_Pokedex.prototype.onSelect = function() {
    this._selectedIndex = this._listWindow.index();
    this.updateDetail();
};

Scene_PMZ_Pokedex.prototype.updateDetail = function() {
    this._detailWindow.contents.clear();
    var key = this._speciesList[this._selectedIndex];
    if (!key) return;
    var base = PMZ.Data.pokemon(key);
    if (!base) return;
    var seen = PMZ.Pokedex.isSeen(key);
    var caught = PMZ.Pokedex.isCaught(key);
    var x = 10, y = 10;
    
    if (!seen) {
        this._detailWindow.changeTextColor('#606060');
        this._detailWindow.drawText('???', x, y, 200, 'left');
        this._detailWindow.drawText('No visto', x, y + 40, 200, 'left');
        this._detailWindow.resetTextColor();
        return;
    }
    
    // Icon (64x64) on the top-left of detail
    PMZ.Icons.drawIcon(this._detailWindow.contents, base.id, x, y, 64, 64);

    // ID + name
    this._detailWindow.drawText('#' + String(base.id || 0).padStart(3, '0') + ' ' + base.name, x + 72, y + 6, 250, 'left');

    // Caught/seen status
    if (caught) {
        this._detailWindow.changeTextColor('#FFD700');
        this._detailWindow.drawText('★ Capturado', x + 72, y + 26, 200, 'left');
    } else {
        this._detailWindow.changeTextColor('#80C0FF');
        this._detailWindow.drawText('● Visto', x + 72, y + 26, 200, 'left');
    }
    this._detailWindow.resetTextColor();

    // Types
    if (base.types) {
        for (var i = 0; i < base.types.length; i++) {
            PMZ.Utils.drawTypeBadge(this._detailWindow.contents, base.types[i], x + 72 + i * 90, y + 44, 85, 22);
        }
    }

    // Description
    var desc = PMZ.Pokedex.getDescription(key);
    this._detailWindow.drawText(desc, x, y + 76, this._detailWindow.width - 20, 'left');
};

Scene_PMZ_Pokedex.prototype.popScene = function() {
    Scene_MenuBase.prototype.popScene.call(this);
};

// ============================================================================
// Scene_PMZ_TrainerCard - Tarjeta de Entrenador
// ============================================================================
function Scene_PMZ_TrainerCard() {
    this.initialize.apply(this, arguments);
}

Scene_PMZ_TrainerCard.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PMZ_TrainerCard.prototype.constructor = Scene_PMZ_TrainerCard;

Scene_PMZ_TrainerCard.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_PMZ_TrainerCard.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    
    var w = Graphics.boxWidth;
    var h = Graphics.boxHeight;
    
    this._infoWindow = new Window_Base(new Rectangle(0, 0, w, h - 50));
    
    var y = 16;
    // Title
    this._infoWindow.contents.fontSize = 26;
    this._infoWindow.drawText('TARJETA ENTRENADOR', 0, y, w, 'center');
    y += 38;
    
    // Player info row
    this._infoWindow.contents.fontSize = 20;
    var nameText = ($gamePlayer ? $gamePlayer._actorName || 'Entrenador' : 'Entrenador');
    this._infoWindow.drawText(nameText, 24, y, 250, 'left');
    var moneyText = '\u2666 ' + ($gamePMZ ? PMZ.Money.get() : 0);
    this._infoWindow.drawText(moneyText, w - 150, y, 130, 'right');
    y += 26;
    this._infoWindow.drawText('Vistos: ' + ($gamePMZ ? $gamePMZ.seenCount() : 0), 24, y, 180, 'left');
    this._infoWindow.drawText('Capturados: ' + ($gamePMZ ? $gamePMZ.caughtCount() : 0), w - 200, y, 180, 'right');
    y += 32;
    
    // Separator
    this._infoWindow.contents.fillRect(20, y, w - 40, 2, '#404040');
    y += 12;
    
    // Badges header with count
    var badgeTotal = PMZ.Badges.list().length || 8;
    var badgeOwned = $gamePMZ ? $gamePMZ.badgeCount() : 0;
    this._infoWindow.contents.fontSize = 22;
    this._infoWindow.drawText('MEDALLAS ' + badgeOwned + '/' + badgeTotal, 24, y, 300, 'left');
    y += 30;
    
    // Badges in 4x2 grid
    var badges = PMZ.Badges.list();
    var cols = 4;
    var cellW = Math.floor((w - 40) / cols);
    var cellH = 48;
    var bw = cellW - 12;
    var col = 0;
    for (var i = 0; i < badges.length; i++) {
        var has = $gamePMZ ? $gamePMZ.hasBadge(badges[i].key) : false;
        var badge = badges[i];
        var bx = 20 + col * cellW;
        var by = y + Math.floor(i / cols) * cellH;
        
        // Badge background
        var bgColor = has ? '#3a3a3a' : '#1a1a1a';
        var borderColor = has ? '#ffd700' : '#404040';
        this._infoWindow.contents.fillRect(bx, by, bw, cellH - 4, bgColor);
        this._infoWindow.contents.fillRect(bx, by, bw, 1, borderColor);
        this._infoWindow.contents.fillRect(bx, by + cellH - 5, bw, 1, borderColor);
        
        // Badge name + leader
        this._infoWindow.contents.fontSize = 16;
        this._infoWindow.changeTextColor(has ? '#ffd700' : '#606060');
        var label = has ? badge.name : '???';
        this._infoWindow.drawText(label, bx + 6, by + 2, bw - 12, 'left');
        this._infoWindow.contents.fontSize = 13;
        this._infoWindow.changeTextColor(has ? '#ffffff' : '#404040');
        var leaderLabel = has ? badge.leader : '-';
        this._infoWindow.drawText(leaderLabel, bx + 6, by + 22, bw - 12, 'left');
        this._infoWindow.resetTextColor();
        
        col = (col + 1) % cols;
    }
    
    this.addWindow(this._infoWindow);
    
    // Back button
    this._backWindow = new Window_Command(0, h - 50, ['Volver']);
    this._backWindow.setHandler('Volver', this.popScene.bind(this));
    this._backWindow.activate();
    this.addWindow(this._backWindow);
};

Scene_PMZ_TrainerCard.prototype.popScene = function() {
    Scene_MenuBase.prototype.popScene.call(this);
};

// ============================================================================
// Scene_PMZ_MainMenu - Menu principal estilo Pokemon
// ============================================================================
function Scene_PMZ_MainMenu() {
    this.initialize.apply(this, arguments);
}

Scene_PMZ_MainMenu.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PMZ_MainMenu.prototype.constructor = Scene_PMZ_MainMenu;

Scene_PMZ_MainMenu.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_PMZ_MainMenu.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    
    var cmds = ['EQUIPO', 'MOCHILA', 'GUARDAR', 'PERSONAJE', 'POKEDEX', 'OPCIONES'];
    this._cmdWindow = new Window_Command(0, 60, cmds);
    this._cmdWindow.setHandler('EQUIPO', this.onPokemon.bind(this));
    this._cmdWindow.setHandler('MOCHILA', this.onBag.bind(this));
    this._cmdWindow.setHandler('GUARDAR', this.onSave.bind(this));
    this._cmdWindow.setHandler('PERSONAJE', this.onTrainer.bind(this));
    this._cmdWindow.setHandler('POKEDEX', this.onPokedex.bind(this));
    this._cmdWindow.setHandler('OPCIONES', this.onOptions.bind(this));
    this._cmdWindow.setHandler('cancel', this.onCancel.bind(this));
    this.addWindow(this._cmdWindow);
    
    // Info bar at top
    this._infoWindow = new Window_Base(0, 0, Graphics.boxWidth, 60);
    this._infoWindow.drawText('EQUIPO: ' + PMZ.Party.count() + '/' + (PMZ.Data.configValue('maxPartySize') || 6), 10, 8, 200, 'left');
    this._infoWindow.drawText('\u2666 ' + PMZ.Money.get(), 10, 34, 150, 'left');
    this._infoWindow.drawText('MEDALLAS ' + ($gamePMZ ? $gamePMZ.badgeCount() : 0) + '/' + (PMZ.Badges.list().length || 8), Graphics.boxWidth - 200, 8, 190, 'right');
    this._infoWindow.drawText('POKEDEX: ' + ($gamePMZ ? $gamePMZ.caughtCount() : 0) + '/' + 151, Graphics.boxWidth - 200, 34, 190, 'right');
    this.addWindow(this._infoWindow);
};

Scene_PMZ_MainMenu.prototype.onPokemon = function() {
    SceneManager.push(Scene_PMZ_Party);
};

Scene_PMZ_MainMenu.prototype.onBag = function() {
    SceneManager.push(Scene_PMZ_Bag);
};

Scene_PMZ_MainMenu.prototype.onSave = function() {
    SceneManager.push(Scene_Save);
};

Scene_PMZ_MainMenu.prototype.onTrainer = function() {
    SceneManager.push(Scene_PMZ_TrainerCard);
};

Scene_PMZ_MainMenu.prototype.onPokedex = function() {
    SceneManager.push(Scene_PMZ_Pokedex);
};

Scene_PMZ_MainMenu.prototype.onOptions = function() {
    SceneManager.push(Scene_Options);
};

Scene_PMZ_MainMenu.prototype.onCancel = function() {
    this.popScene();
};

// ============================================================================
// Window_PMZ_PCCommands - Comandos horizontales para el PC
// ============================================================================
function Window_PMZ_PCCommands() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_PCCommands.prototype = Object.create(Window_Command.prototype);
Window_PMZ_PCCommands.prototype.constructor = Window_PMZ_PCCommands;

Window_PMZ_PCCommands.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y, ['Depositar', 'Retirar', 'Soltar', 'Renombrar', 'Salir'], Graphics.boxWidth);
};

Window_PMZ_PCCommands.prototype.maxCols = function() { return 5; };
Window_PMZ_PCCommands.prototype.maxItems = function() { return 5; };
Window_PMZ_PCCommands.prototype.itemHeight = function() { return 36; };

Window_PMZ_PCCommands.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    var commands = ['Depositar', 'Retirar', 'Soltar', 'Renombrar', 'Salir'];
    this.contents.fontSize = 20;
    this.changeTextColor(this.index() === index ? '#f8d030' : '#ffffff');
    this.drawText(commands[index] || '---', rect.x, rect.y + 8, rect.width, 'center');
    this.resetTextColor();
    this.contents.fontSize = 22;
};

// ============================================================================
// Scene_PMZ_PC - Sistema de Cajas Pokemon
// ============================================================================
function Scene_PMZ_PC() {
    this.initialize.apply(this, arguments);
}

Scene_PMZ_PC.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PMZ_PC.prototype.constructor = Scene_PMZ_PC;

Scene_PMZ_PC.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    this._boxIndex = 0;
    this._state = 'box';
};

Scene_PMZ_PC.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);

    this._boxCount = PMZ.PC.allBoxes().length;
    this._helpWindow = new Window_Base(0, 0, Graphics.boxWidth, 48);
    this._helpWindow.drawText('PC DE ' + ($gamePlayer ? $gamePlayer._actorName || 'ENTRENADOR' : 'ENTRENADOR'), 10, 12, 400, 'left');
    this.addWindow(this._helpWindow);

    this.createBoxWindow();
    this.createListWindow();
    this.createCommandWindow();
    this.refreshBox();
};

Scene_PMZ_PC.prototype.createBoxWindow = function() {
    this._boxWindow = new Window_Command(0, 48, ['\u25C0', '', '\u25B6']);
    this._boxWindow.setHandler('\u25C0', this.prevBox.bind(this));
    this._boxWindow.setHandler('\u25B6', this.nextBox.bind(this));
    this._boxWindow.activate();
    this._boxWindow.hide();
    this.addWindow(this._boxWindow);
};

Scene_PMZ_PC.prototype.createListWindow = function() {
    var w = Graphics.boxWidth;
    this._listWindow = new Window_PMZ_PCList(0, 48, w, Graphics.boxHeight - 48);
    this._listWindow.setHandler('ok', this.onListOk.bind(this));
    this._listWindow.setHandler('cancel', this.onListCancel.bind(this));
    this._listWindow.activate();
    this.addWindow(this._listWindow);
};

Scene_PMZ_PC.prototype.createCommandWindow = function() {
    this._cmdWindow = new Window_PMZ_PCCommands(0, Graphics.boxHeight - 48);
    this._cmdWindow.setHandler('Depositar', this.onDeposit.bind(this));
    this._cmdWindow.setHandler('Retirar', this.onWithdraw.bind(this));
    this._cmdWindow.setHandler('Soltar', this.onRelease.bind(this));
    this._cmdWindow.setHandler('Renombrar', this.onRename.bind(this));
    this._cmdWindow.setHandler('Salir', this.popScene.bind(this));
    this._cmdWindow.hide();
    this.addWindow(this._cmdWindow);
};

Scene_PMZ_PC.prototype.refreshBox = function() {
    var box = PMZ.PC.box(this._boxIndex);
    if (!box) return;
    this._listWindow.setPokemon(box.pokemon, this._boxIndex);
    this._helpWindow.contents.clear();
    this._helpWindow.drawText('PC DE ' + ($gamePlayer ? $gamePlayer._actorName || 'ENTRENADOR' : 'ENTRENADOR'), 10, 12, 250, 'left');
    this._helpWindow.drawText(box.name + ' ' + (this._boxIndex + 1) + '/' + this._boxCount, Graphics.boxWidth - 180, 12, 170, 'right');
    this._listWindow.select(0);
};

Scene_PMZ_PC.prototype.prevBox = function() {
    if (this._boxIndex > 0) this._boxIndex--;
    else this._boxIndex = this._boxCount - 1;
    this.refreshBox();
};

Scene_PMZ_PC.prototype.nextBox = function() {
    if (this._boxIndex < this._boxCount - 1) this._boxIndex++;
    else this._boxIndex = 0;
    this.refreshBox();
};

Scene_PMZ_PC.prototype.onListOk = function() {
    this._cmdWindow.show();
    this._cmdWindow.activate();
    this._listWindow.deactivate();
};

Scene_PMZ_PC.prototype.onDeposit = function() {
    var party = $gamePMZ.party();
    if (party.length === 0) {
        this._helpWindow.contents.clear();
        this._helpWindow.drawText('No hay Pokemon en el equipo!', 10, 12, 400, 'left');
        return;
    }
    this._pkmnList = party.slice();
    this._listWindow.setPokemon(this._pkmnList, -1);
    this._listWindow.activate();
    this._cmdWindow.deactivate();
    this._state = 'deposit';
};

Scene_PMZ_PC.prototype.onWithdraw = function() {
    var box = PMZ.PC.box(this._boxIndex);
    if (!box || box.pokemon.length === 0) {
        this._helpWindow.contents.clear();
        this._helpWindow.drawText('Esta caja esta vacia!', 10, 12, 400, 'left');
        return;
    }
    var party = $gamePMZ.party();
    var maxParty = PMZ.Data.configValue('maxPartySize') || 6;
    if (party.length >= maxParty) {
        this._helpWindow.contents.clear();
        this._helpWindow.drawText('El equipo esta lleno!', 10, 12, 400, 'left');
        return;
    }
    this._listWindow.setPokemon(box.pokemon, this._boxIndex);
    this._listWindow.activate();
    this._cmdWindow.deactivate();
    this._state = 'withdraw';
};

Scene_PMZ_PC.prototype.onRelease = function() {
    var box = PMZ.PC.box(this._boxIndex);
    if (!box || box.pokemon.length === 0) {
        this._helpWindow.contents.clear();
        this._helpWindow.drawText('Esta caja esta vacia!', 10, 12, 400, 'left');
        return;
    }
    this._listWindow.setPokemon(box.pokemon, this._boxIndex);
    this._listWindow.activate();
    this._cmdWindow.deactivate();
    this._state = 'release';
};

Scene_PMZ_PC.prototype.onRename = function() {
    var box = PMZ.PC.box(this._boxIndex);
    if (!box) return;
    // Simple rename via prompt
    var newName = prompt('Nuevo nombre para ' + box.name + ':');
    if (newName && newName.trim().length > 0) {
        PMZ.PC.renameBox(this._boxIndex, newName.trim());
        this.refreshBox();
    }
};

Scene_PMZ_PC.prototype.onListOk = function() {
    if (this._state === 'box') {
        this._cmdWindow.show();
        this._cmdWindow.activate();
        this._listWindow.deactivate();
        return;
    }

    var idx = this._listWindow.index();
    if (this._state === 'deposit') {
        var pkmn = this._pkmnList[idx];
        if (!pkmn) return;
        var party = $gamePMZ.party();
        var partyIdx = party.indexOf(pkmn);
        if (partyIdx >= 0) {
            party.splice(partyIdx, 1);
            if (PMZ.PC.deposit(pkmn)) {
                this._helpWindow.contents.clear();
                this._helpWindow.drawText(pkmn.name + ' depositado!', 10, 12, 400, 'left');
            }
        }
        this._state = 'box';
        this.refreshBox();
        this._cmdWindow.show();
        this._cmdWindow.activate();
        this._listWindow.deactivate();
    } else if (this._state === 'withdraw') {
        var withdrawn = PMZ.PC.withdraw(this._boxIndex, idx);
        if (withdrawn) {
            $gamePMZ.party().push(withdrawn);
            this._helpWindow.contents.clear();
            this._helpWindow.drawText(withdrawn.name + ' retirado!', 10, 12, 400, 'left');
        }
        this._state = 'box';
        this.refreshBox();
        this._cmdWindow.show();
        this._cmdWindow.activate();
        this._listWindow.deactivate();
    } else if (this._state === 'release') {
        var relPkmn = PMZ.PC.box(this._boxIndex).pokemon[idx];
        if (relPkmn) {
            PMZ.PC.withdraw(this._boxIndex, idx);
            this._helpWindow.contents.clear();
            this._helpWindow.drawText(relPkmn.name + ' liberado...', 10, 12, 400, 'left');
        }
        this._state = 'box';
        this.refreshBox();
        this._cmdWindow.show();
        this._cmdWindow.activate();
        this._listWindow.deactivate();
    }
};

Scene_PMZ_PC.prototype.onListCancel = function() {
    if (this._state === 'deposit' || this._state === 'withdraw' || this._state === 'release') {
        this._state = 'box';
        this.refreshBox();
        this._cmdWindow.show();
        this._cmdWindow.activate();
        this._listWindow.deactivate();
    } else {
        this.popScene();
    }
};

Scene_PMZ_PC.prototype.popScene = function() {
    Scene_MenuBase.prototype.popScene.call(this);
};

// ============================================================================
// Window_PMZ_PCList - Lista de Pokemon en una caja
// ============================================================================
function Window_PMZ_PCList() {
    this.initialize.apply(this, arguments);
}

Window_PMZ_PCList.prototype = Object.create(Window_Selectable.prototype);
Window_PMZ_PCList.prototype.constructor = Window_PMZ_PCList;

Window_PMZ_PCList.prototype.initialize = function(x, y, width, height) {
    this._pokemon = [];
    this._boxIdx = 0;
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
};

Window_PMZ_PCList.prototype.setPokemon = function(list, boxIdx) {
    this._pokemon = list || [];
    this._boxIdx = boxIdx || 0;
    this.refresh();
    this.select(0);
};

Window_PMZ_PCList.prototype.maxItems = function() {
    return Math.max(1, this._pokemon.length);
};

Window_PMZ_PCList.prototype.maxCols = function() { return 2; };
Window_PMZ_PCList.prototype.itemHeight = function() { return 48; };

Window_PMZ_PCList.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    var pkmn = this._pokemon[index];

    if (!pkmn) {
        this.contents.fontSize = 18;
        this.drawText('--- Vac\u00edo ---', rect.x + 10, rect.y + 14, rect.width - 20, 'center');
        this.contents.fontSize = 22;
        return;
    }

    var iconW = 32;
    PMZ.Icons.drawIcon(this.contents, pkmn.id, rect.x + 4, rect.y + (48 - iconW) / 2, iconW, iconW, (pkmn._formSuffix || pkmn._megaForm || ''));

    var x = rect.x + 4 + iconW + 6;

    // Name + Lv
    this.contents.fontSize = 18;
    this.changeTextColor('#ffffff');
    this.drawText('#' + String(pkmn.id).padStart(3, '0') + ' ' + pkmn.name, x, rect.y + 4, rect.width - iconW - 20, 'left');
    this.changeTextColor('#f8d030');
    this.drawText('Lv' + pkmn.level, x, rect.y + 26, 50, 'left');
    this.resetTextColor();

    // Types
    if (pkmn.types) {
        for (var i = 0; i < Math.min(2, pkmn.types.length); i++) {
            var tx = x + 54 + i * 52;
            PMZ.Utils.drawTypeBadge(this.contents, pkmn.types[i], tx, rect.y + 26, 48, 14);
        }
    }
};

Window_PMZ_PCList.prototype.refresh = function() {
    this.contents.clear();
    this.drawAllItems();
};

// ============================================================================
// Scene_PMZ_MoveLearn - Scene for choosing which move to forget
// ============================================================================
function Scene_PMZ_MoveLearn() {
    this.initialize.apply(this, arguments);
}

Scene_PMZ_MoveLearn.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PMZ_MoveLearn.prototype.constructor = Scene_PMZ_MoveLearn;

Scene_PMZ_MoveLearn.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    this._pokemon = null;
    this._newMove = null;
    this._onComplete = null;
    this._replaced = false;
};

Scene_PMZ_MoveLearn.prototype.setup = function(pokemon, newMove, onComplete) {
    this._pokemon = pokemon;
    this._newMove = newMove;
    this._onComplete = onComplete || function() {};
};

Scene_PMZ_MoveLearn.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    // If pushed via plugin command, read pending data
    if ($gameTemp && $gameTemp._pmzMoveLearn) {
        this._pokemon = $gameTemp._pmzMoveLearn.pokemon;
        this._newMove = $gameTemp._pmzMoveLearn.newMove;
        // Optional TM/HM key — only consumed if the user actually replaces a move
        this._tmKey = $gameTemp._pmzMoveLearn.tmKey || null;
        $gameTemp._pmzMoveLearn = null;
    }
    if (!this._pokemon || !this._newMove) {
        // Nothing to do
        this.popScene();
        return;
    }
    this.createHeader();
    this.createNewMoveWindow();
    this.createCurrentMovesWindow();
};

Scene_PMZ_MoveLearn.prototype.createHeader = function() {
    var w = Graphics.boxWidth;
    this._header = new Window_Base(0, 0, w, 56);
    this._header.contents.fontSize = 22;
    var name = this._pokemon ? (this._pokemon.nickname || this._pokemon.name) : 'Pokemon';
    this._header.drawText(name + ' quiere aprender ' + this._newMove.name + '.', 10, 8, w - 20, 'left');
    this._header.drawText('¿Cual movimiento quieres olvidar?', 10, 32, w - 20, 'left');
    this.addWindow(this._header);
};

Scene_PMZ_MoveLearn.prototype.createNewMoveWindow = function() {
    var w = Graphics.boxWidth;
    var nw = new Window_Base(0, 56, w, 90);
    var md = this._newMove;
    var typeColor = '#A8A878';
    if (md.type && PMZ.Utils && PMZ.Utils.typeColor) typeColor = PMZ.Utils.typeColor(md.type);
    nw.drawText('NUEVO: ' + md.name, 10, 8, 280, 'left');
    nw.drawText('Tipo:', 10, 32, 60, 'left');
    if (PMZ.Utils && PMZ.Utils.drawTypeBadge) {
        PMZ.Utils.drawTypeBadge(nw.contents, md.type, 60, 30, 70, 20);
    }
    nw.drawText('Cat: ' + (md.category || 'status'), 140, 32, 100, 'left');
    nw.drawText('Poder: ' + (md.power || 0), 240, 32, 80, 'left');
    nw.drawText('Prec: ' + (md.accuracy || 0), 320, 32, 80, 'left');
    nw.drawText('PP: ' + (md.pp || 0), 400, 32, 60, 'left');
    var desc = (md.effect && md.effect !== 'none') ? 'Efecto: ' + md.effect : '';
    nw.drawText(desc, 10, 56, w - 20, 'left');
    this._newMoveWindow = nw;
    this.addWindow(nw);
};

Scene_PMZ_MoveLearn.prototype.createCurrentMovesWindow = function() {
    var scene = this;
    function MoveListWindow() { this.initialize.apply(this, arguments); }
    MoveListWindow.prototype = Object.create(Window_Selectable.prototype);
    MoveListWindow.prototype.constructor = MoveListWindow;
    MoveListWindow.prototype.initialize = function(x, y, w, h) {
        Window_Selectable.prototype.initialize.call(this, x, y, w, h);
        this._showArrows = true;
    };
    MoveListWindow.prototype.maxItems = function() { return scene._pokemon && scene._pokemon.moves ? scene._pokemon.moves.length : 0; };
    MoveListWindow.prototype.maxCols = function() { return 1; };
    MoveListWindow.prototype.itemHeight = function() { return 32; };
    MoveListWindow.prototype.drawItem = function(index) {
        var rect = this.itemRect(index);
        var move = scene._pokemon.moves[index];
        if (!move) return;
        this.drawText(String(index + 1) + '.', rect.x + 8, rect.y + 6, 24, 'left');
        this.drawText(move.name, rect.x + 36, rect.y + 6, rect.width - 130, 'left');
        if (move.type && PMZ.Utils && PMZ.Utils.drawTypeBadge) {
            PMZ.Utils.drawTypeBadge(this.contents, move.type, rect.x + rect.width - 120, rect.y + 8, 60, 18);
        }
        this.changeTextColor('#808080');
        this.drawText('PP ' + (move.pp || 0) + '/' + (move.maxPp || move.pp || 0), rect.x + rect.width - 56, rect.y + 6, 50, 'right');
        this.resetTextColor();
    };
    // Custom arrow indicators + position counter
    MoveListWindow.prototype._updateArrows = function() {
        Window_Selectable.prototype._updateArrows.call(this);
        var txt = (this.index() + 1) + ' / ' + this.maxItems();
        if (this._lastPosText === txt) return;
        this._lastPosText = txt;
        if (this._posSprite) this.removeChild(this._posSprite);
        var ctx = this.contents;
        var w = ctx.measureTextWidth(txt) + 12;
        var sp = new Sprite(new Bitmap(w, 22));
        sp.bitmap.fontSize = 14;
        sp.bitmap.textColor = '#FFFFFF';
        sp.bitmap.paintOpacity = 200;
        sp.bitmap.fillRect(0, 0, w, 22, 'rgba(0,0,0,0.55)');
        sp.bitmap.drawText(txt, 0, 2, w, 18, 'center');
        sp.x = this.contentsWidth() - w - 6;
        sp.y = 2;
        this.addChildToBack(sp);
        this._posSprite = sp;
    };
    MoveListWindow.prototype.refresh = function() {
        Window_Selectable.prototype.refresh.call(this);
        this._updateArrows();
    };
    // Ensure scroll is active and visible
    MoveListWindow.prototype.processCursorMove = function() {
        Window_Selectable.prototype.processCursorMove.call(this);
        this._updateArrows();
    };

    this._movesWindow = new (MoveListWindow)(0, 146, Graphics.boxWidth, Graphics.boxHeight - 146 - 56);
    this._movesWindow.setHandler('ok', this.onReplaceMove.bind(this));
    this._movesWindow.setHandler('cancel', this.onCancelLearn.bind(this));
    this._movesWindow.activate();
    this._movesWindow.select(0);
    this.addWindow(this._movesWindow);
    this._movesWindow.update = (function(orig) {
        return function() {
            orig.call(this);
            if (this.index() < 0) this.select(0);
            this._updateArrows();
        };
    })(this._movesWindow.update);
    this._movesWindow.update();
};

Scene_PMZ_MoveLearn.prototype.onReplaceMove = function() {
    var idx = this._movesWindow.index();
    if (idx < 0 || idx >= this._pokemon.moves.length) return;
    var forgotName = this._pokemon.moves[idx].name;
    PMZ.Pokemon.replaceMove(this._pokemon, idx, this._newMove);
    this._replaced = true;
    // Consume the TM/HM if this learn was triggered by item use
    if (this._tmKey) {
        PMZ.Items.remove(this._tmKey);
        this._tmKey = null;
    }
    if ($gameMessage) $gameMessage.add('¡' + (this._pokemon.nickname || this._pokemon.name) + ' olvido ' + forgotName + ' y aprendio ' + this._newMove.name + '!');
    this.popScene();
};

// Show the move being forgotten on a side panel (passive preview)
Scene_PMZ_MoveLearn.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    if (this._movesWindow) this.refreshPreview();
};

Scene_PMZ_MoveLearn.prototype.refreshPreview = function() {
    var idx = this._movesWindow.index();
    if (idx < 0 || !this._pokemon.moves[idx]) return;
    var mv = this._pokemon.moves[idx];
    if (this._lastPreviewIdx === idx) return;
    this._lastPreviewIdx = idx;
    // Remove old sprite
    if (this._forgotSprite) {
        this.removeChild(this._forgotSprite);
        this._forgotSprite = null;
    }
    var txt = '▼ Olvidaras: ' + mv.name;
    var w = this._newMoveWindow ? this._newMoveWindow.contentsWidth() : 400;
    var sp = new Sprite(new Bitmap(w, 22));
    sp.bitmap.fontSize = 16;
    sp.bitmap.textColor = '#FF8888';
    sp.bitmap.paintOpacity = 230;
    sp.bitmap.fillRect(0, 0, w, 22, 'rgba(0,0,0,0.55)');
    sp.bitmap.drawText(txt, 8, 2, w - 16, 18, 'left');
    sp.x = this._newMoveWindow ? this._newMoveWindow.x : 0;
    sp.y = (this._newMoveWindow ? this._newMoveWindow.y : 56) + 68;
    this.addChild(sp);
    this._forgotSprite = sp;
};

Scene_PMZ_MoveLearn.prototype.onCancelLearn = function() {
    if ($gameMessage) $gameMessage.add((this._pokemon.nickname || this._pokemon.name) + ' no aprendio ' + this._newMove.name + '.');
    this.popScene();
};

Scene_PMZ_MoveLearn.prototype.popScene = function() {
    Scene_MenuBase.prototype.popScene.call(this);
    if (this._onComplete) this._onComplete(this._replaced);
};

Scene_PMZ_MoveLearn.prototype.terminate = function() {
    // Clean up overlay sprites to avoid leaks
    if (this._movesWindow && this._movesWindow._posSprite) {
        this._movesWindow.removeChild(this._movesWindow._posSprite);
        this._movesWindow._posSprite = null;
    }
    if (this._forgotSprite) {
        this.removeChild(this._forgotSprite);
        this._forgotSprite = null;
    }
    Scene_MenuBase.prototype.terminate.call(this);
};

// ============================================================================
// Plugin Commands
// ============================================================================
(function() {
    PluginManager.registerCommand('PMZ_Menu', 'openParty', function(args) {
        SceneManager.push(Scene_PMZ_Party);
    });

    PluginManager.registerCommand('PMZ_Menu', 'openSummary', function(args) {
        var idx = Number(args.partyIndex) || 0;
        PMZ.Menu._summaryIndex = idx;
        SceneManager.push(Scene_PMZ_Summary);
    });

    PluginManager.registerCommand('PMZ_Menu', 'openCenter', function(args) {
        SceneManager.push(Scene_PMZ_Center);
    });

    PluginManager.registerCommand('PMZ_Menu', 'openMart', function(args) {
        Scene_PMZ_Shop._customItems = null;
        Scene_PMZ_Shop._customStock = null;
        SceneManager.push(Scene_PMZ_Shop);
    });

    PluginManager.registerCommand('PMZ_Menu', 'openCustomShop', function(args) {
        var items = [];
        var stock = {};
        for (var i = 1; i <= 12; i++) {
            var key = String(args['itemKey' + i] || '').toLowerCase().trim();
            if (!key) continue;
            var price = Number(args['itemPrice' + i]) || 0;
            var st = Number(args['itemStock' + i]) || 0;
            items.push({ key: key, price: price });
            if (st > 0) stock[key] = st;
        }
        Scene_PMZ_Shop._customItems = items.length > 0 ? items : null;
        Scene_PMZ_Shop._customStock = items.length > 0 ? stock : null;
        SceneManager.push(Scene_PMZ_Shop);
    });

    PluginManager.registerCommand('PMZ_Menu', 'openBag', function(args) {
        SceneManager.push(Scene_PMZ_Bag);
    });

    PluginManager.registerCommand('PMZ_Menu', 'openPokedex', function(args) {
        SceneManager.push(Scene_PMZ_Pokedex);
    });

    PluginManager.registerCommand('PMZ_Menu', 'learnMove', function(args) {
        var idx = Number(args.partyIndex) || 0;
        var moveKey = String(args.move || '').toLowerCase();
        var party = $gamePMZ ? $gamePMZ.party() : [];
        var pkmn = party[idx];
        if (!pkmn) { console.warn('[PMZ] learnMove: no Pokemon at index', idx); return; }
        var result = PMZ.Pokemon.teachMove(pkmn, moveKey);
        if (!result.success) {
            if ($gameMessage) $gameMessage.add(result.msg);
            return;
        }
        if (result.learned) {
            if ($gameMessage) $gameMessage.add(result.msg);
        } else if (result.needReplace) {
            if ($gameMessage) $gameMessage.add(result.msg);
            SceneManager.push(Scene_PMZ_MoveLearn);
        }
    });

    // Give a TM item to the player
    PluginManager.registerCommand('PMZ_Menu', 'giveTM', function(args) {
        var tmKey = String(args.tm || '').toLowerCase();
        var amount = Number(args.amount) || 1;
        if (!PMZ.Data.item(tmKey)) { console.warn('[PMZ] giveTM: unknown item', tmKey); return; }
        PMZ.Items.add(tmKey, amount);
        if ($gameMessage) $gameMessage.add('Recibiste ' + PMZ.Data.item(tmKey).name + ' x' + amount);
    });

    PluginManager.registerCommand('PMZ_Menu', 'openPC', function(args) {
        SceneManager.push(Scene_PMZ_PC);
    });

    PluginManager.registerCommand('PMZ_Menu', 'openTrainerCard', function(args) {
        SceneManager.push(Scene_PMZ_TrainerCard);
    });

    PluginManager.registerCommand('PMZ_Menu', 'choosePokemon', function(args) {
        PMZ.Menu._chooseVarId = Number(args.variableId) || 1;
        PMZ.Menu._chooseMessage = String(args.message || 'Selecciona un Pokemon:');
        SceneManager.push(Scene_PMZ_ChoosePokemon);
    });

    console.log('[PMZ] Menu plugin loaded');
})();
