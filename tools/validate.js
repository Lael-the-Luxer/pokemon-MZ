//=============================================================================
// tools/validate.js — Validador automático de datos PMZ
// Uso: node tools/validate.js
// Exit code 0 = todo OK, 1 = hay errores
//=============================================================================
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.join(__dirname, '..');
var PMZ = path.join(ROOT, 'PMZ');

var errors = [];
var warnings = [];

function error(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

function load(name) {
    try {
        return JSON.parse(fs.readFileSync(path.join(PMZ, name + '.json'), 'utf8'));
    } catch (e) {
        error('FATAL: ' + name + '.json no parsea — ' + e.message);
        return null;
    }
}

function entries(obj) {
    if (!obj) return [];
    return Object.keys(obj)
        .filter(function(k) { return obj[k] && typeof obj[k] === 'object' && !k.startsWith('_'); })
        .map(function(k) { return { key: k, data: obj[k] }; });
}

// ============================================================================
// 1. Carga todos los archivos
// ============================================================================
var FILES = ['config', 'pokemon', 'moves', 'items', 'abilities', 'trainers',
             'encounters', 'badges', 'mechanics', 'types', 'natures'];
var D = {};
FILES.forEach(function(f) { D[f] = load(f); });
var ok = FILES.every(function(f) { return D[f] !== null; });
if (!ok) { report(); process.exit(1); }

var POKE = entries(D.pokemon);
var MOVES = entries(D.moves);
var ITEMS = entries(D.items);
var ABIL = entries(D.abilities);
var TRAIN = entries(D.trainers);
var TYPES = entries(D.types);
var MECH = (D.mechanics.mechanics || []);

var pokemonByName = {};
POKE.forEach(function(e) { pokemonByName[e.key] = e.data; });
var moveByName = {};
MOVES.forEach(function(e) { moveByName[e.key] = e.data; });
var itemByKey = {};
ITEMS.forEach(function(e) { itemByKey[e.key] = e.data; });
var abilityByName = {};
ABIL.forEach(function(e) { abilityByName[e.key] = e.data; });
var typeNames = TYPES.map(function(e) { return e.key; });

// ============================================================================
// 2. IDs — únicos y secuenciales
// ============================================================================
function checkIds(section, list) {
    var seen = {};
    var max = 0;
    list.forEach(function(e) {
        var id = e.data.id;
        if (id === undefined) { error(section + ' "' + e.key + '" sin id'); return; }
        if (typeof id !== 'number') { error(section + ' "' + e.key + '" id no numérico: ' + id); return; }
        if (seen[id] !== undefined) error(section + ' id duplicado ' + id + ' (' + e.key + ' vs ' + seen[id] + ')');
        else seen[id] = e.key;
        if (id > max) max = id;
    });
    if (Object.keys(seen).length === 0) return;
    for (var i = 1; i <= max; i++) {
        if (seen[i] === undefined) warn(section + ' id faltante: ' + i);
    }
}

checkIds('MOVES', MOVES);
checkIds('ITEMS', ITEMS);
checkIds('ABILITIES', ABIL);
checkIds('POKEMON', POKE);

// ============================================================================
// 3. Referencias de tipos
// ============================================================================
POKE.forEach(function(e) {
    (e.data.types || []).forEach(function(t) {
        if (typeNames.indexOf(t) < 0) error('POKEMON ' + e.key + ' tipo inválido: ' + t);
    });
});
MOVES.forEach(function(e) {
    if (e.data.type && typeNames.indexOf(e.data.type) < 0) error('MOVE ' + e.key + ' tipo inválido: ' + e.data.type);
});
ITEMS.forEach(function(e) {
    (e.data.megaTypes || []).forEach(function(t) {
        if (typeNames.indexOf(t) < 0) error('ITEM ' + e.key + ' megaTypes inválido: ' + t);
    });
});

// ============================================================================
// 4. Pokémon → moves / abilities / evoluciones
// ============================================================================
POKE.forEach(function(e) {
    var p = e.data;
    Object.keys(p.moves || {}).forEach(function(lvl) {
        (p.moves[lvl] || []).forEach(function(mv) {
            if (!moveByName[mv]) error('POKEMON ' + e.key + ' (lvl ' + lvl + ') move inexistente: ' + mv);
        });
    });
    (p.abilities || []).forEach(function(ab) {
        if (!abilityByName[ab]) error('POKEMON ' + e.key + ' habilidad inexistente: ' + ab);
    });
    (p.evolutions || []).forEach(function(ev) {
        if (!pokemonByName[ev.to]) error('POKEMON ' + e.key + ' evolución a especie inexistente: ' + ev.to);
        if (ev.item && !itemByKey[ev.item]) error('POKEMON ' + e.key + ' evolución item inexistente: ' + ev.item);
        if (ev.move && !moveByName[ev.move]) error('POKEMON ' + e.key + ' evolución move inexistente: ' + ev.move);
        if (ev.tradeItem && !itemByKey[ev.tradeItem]) error('POKEMON ' + e.key + ' evolución tradeItem inexistente: ' + ev.tradeItem);
        if (ev.time && ['day', 'night'].indexOf(ev.time) < 0) error('POKEMON ' + e.key + ' evolución time inválido: ' + ev.time);
        var hasCondition = ev.item || ev.move || ev.trade || ev.tradeItem || ev.happiness || ev.time || ev.level !== undefined;
        if (!hasCondition) error('POKEMON ' + e.key + ' evolución sin condición (necesita level/item/move/happiness/trade/time)');
    });
});

// ============================================================================
// 5. Items → mecánicas / megaTo
// ============================================================================
MECH.forEach(function(m) {
    if (m.triggerItemEffect) {
        var hasItemWithEffect = ITEMS.some(function(e) { return e.data.effect === m.triggerItemEffect; });
        if (!hasItemWithEffect) warn('MECHANIC ' + m.key + ' triggerItemEffect "' + m.triggerItemEffect + '" sin items con ese effect');
    }
    if (m.trigger === 'holdItem' && (m.maxPerBattle === undefined || m.maxPerBattle < 1))
        error('MECHANIC ' + m.key + ' con trigger holdItem sin maxPerBattle válido');
});
ITEMS.forEach(function(e) {
    if (e.data.mechanic && !MECH.some(function(m) { return m.key === e.data.mechanic; }))
        error('ITEM ' + e.key + ' mecánica inexistente: ' + e.data.mechanic);
    if (e.data.megaTo && !pokemonByName[e.data.megaTo])
        warn('ITEM ' + e.key + ' megaTo sin especie en pokemon.json: ' + e.data.megaTo);
});

// ============================================================================
// 6. Entrenadores → especies / moves / items
// ============================================================================
TRAIN.forEach(function(e) {
    var t = e.data;
    if (!t.pokemon || !t.pokemon.length) { warn('TRAINER ' + e.key + ' sin pokemon'); return; }
    t.pokemon.forEach(function(s) {
        if (s.species && !pokemonByName[s.species]) error('TRAINER ' + t.name + ' especie inexistente: ' + s.species);
        (s.moves || []).forEach(function(mv) {
            if (!moveByName[mv]) error('TRAINER ' + t.name + ' move inexistente: ' + mv);
        });
        if (s.item && !itemByKey[s.item]) error('TRAINER ' + t.name + ' item inexistente: ' + s.item);
    });
    if (!t.money) warn('TRAINER ' + t.name + ' sin money');
    if (!t.dialogue) warn('TRAINER ' + t.name + ' sin dialogue');
});

// ============================================================================
// 7. Encuentros → especies
// ============================================================================
['byType', 'byMap'].forEach(function(section) {
    var sec = (D.encounters[section] || {});
    Object.keys(sec).forEach(function(zone) {
        var slots = sec[zone].pokemon || [];
        if (!slots.length) warn('ENCOUNTER ' + section + ':' + zone + ' sin pokemon');
        slots.forEach(function(s) {
            if (!pokemonByName[s.species]) error('ENCOUNTER ' + section + ':' + zone + ' especie inexistente: ' + s.species);
            if (s.rate !== undefined && (s.rate < 0 || s.rate > 100)) error('ENCOUNTER ' + section + ':' + zone + ' rate fuera de rango: ' + s.rate);
        });
    });
});

// ============================================================================
// 8. Medallas
// ============================================================================
if (D.badges.badges && D.badges.badges.length) {
    var bnames = {};
    D.badges.badges.forEach(function(b) {
        if (!b.name) error('BADGE sin name');
        if (bnames[b.name]) error('BADGE nombre duplicado: ' + b.name);
        bnames[b.name] = 1;
    });
} else {
    error('BADGES: badges.json sin lista badges');
}

// ============================================================================
// 9. Sprites BW
// ============================================================================
var spriteDir = path.join(ROOT, 'img', 'enemies', 'Black-White', 'BW');
if (fs.existsSync(spriteDir)) {
    POKE.forEach(function(e) {
        var f1 = path.join(spriteDir, e.data.id + ' BW.png');
        var f2 = path.join(spriteDir, e.data.id + 'BW.png');
        if (!fs.existsSync(f1) && !fs.existsSync(f2))
            error('SPRITE faltante: ' + e.data.id + ' (' + e.key + ')');
    });
} else {
    warn('Carpeta de sprites BW no encontrada, saltando check de sprites');
}

// ============================================================================
// Reporte
// ============================================================================
function report() {
    console.log('========================================');
    console.log(' PMZ Data Validator');
    console.log('========================================');
    console.log('Pokemon:    ' + POKE.length);
    console.log('Moves:      ' + MOVES.length);
    console.log('Items:      ' + ITEMS.length);
    console.log('Abilities:  ' + ABIL.length);
    console.log('Trainers:   ' + TRAIN.length);
    console.log('Mechanics:  ' + MECH.length);
    console.log('----------------------------------------');
    if (warnings.length) {
        console.log('WARNINGS (' + warnings.length + '):');
        warnings.forEach(function(w) { console.log('  ! ' + w); });
    } else {
        console.log('WARNINGS: 0');
    }
    if (errors.length) {
        console.log('ERRORES (' + errors.length + '):');
        errors.forEach(function(e) { console.log('  X ' + e); });
    } else {
        console.log('ERRORES: 0 — datos limpios');
    }
    console.log('========================================');
}

report();
process.exit(errors.length ? 1 : 0);
