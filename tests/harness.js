// harness.js - Carga el motor PMZ (PMZ_Core + PMZ_GamePokemon + PMZ_BattleCore)
// en un sandbox de Node con stubs del runtime de RPG Maker MZ.
// Los datos se cargan desde los JSON reales de PMZ/ (deterministas, sin XHR).
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const PLUGINS = path.join(ROOT, 'js', 'plugins');

const DATA_FILES = ['config', 'pokemon', 'moves', 'items', 'trainers', 'types',
    'encounters', 'abilities', 'badges', 'mechanics', 'natures'];

function seededRandom(seed) {
    let s = (seed >>> 0) || 12345;
    return function () {
        s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
        return s / 4294967296;
    };
}

function makeMath(seed) {
    const m = Object.create(Math);
    m.random = seededRandom(seed);
    return m;
}

// --- Stubs mínimos del runtime de MZ (solo lo que PMZ_Core toca al cargar) ---
function makeStubs(math) {
    function WindowCtor() {
        this._list = [];
    }
    WindowCtor.prototype.initialize = function (rect) { this.rect = rect; return this; };
    WindowCtor.prototype.addCommand = function (name, symbol) { this._list.push({ name: name, symbol: symbol }); };
    WindowCtor.prototype.drawAllItems = function () {};
    WindowCtor.prototype.update = function () {};
    WindowCtor.prototype.hide = function () {};
    WindowCtor.prototype.show = function () {};
    WindowCtor.prototype.activate = function () {};
    WindowCtor.prototype.deactivate = function () {};

    function BitmapStub() {
        this.width = 0;
        this.height = 0;
    }
    BitmapStub.prototype.isReady = function () { return false; };

    const sandbox = {
        Math: math,
        Rectangle: class Rectangle {
            constructor(x, y, w, h) {
                this.x = x || 0; this.y = y || 0;
                this.width = w || 0; this.height = h || 0;
            }
        },
        Graphics: { boxWidth: 816, boxHeight: 624, frameCount: 0 },
        Window_Base: WindowCtor,
        Window_Scrollable: WindowCtor,
        Window_Selectable: WindowCtor,
        Window_Command: WindowCtor,
        Sprite: class Sprite {
            initialize() { this.visible = true; return this; }
            update() {}
            isReady() { return true; }
        },
        Bitmap: BitmapStub,
        ImageManager: {
            loadPicture() { return new BitmapStub(); }
        },
        DataManager: {
            createGameObjects() {},
            makeSaveContents() { return {}; },
            extractSaveContents() {}
        },
        Game_Player: class Game_Player {
            increaseSteps() {}
            checkEventTriggerThere() { return false; }
        },
        Scene_Map: class Scene_Map {
            update() {}
        },
        SceneManager: {
            stack: [],
            push(sceneClass) { this.stack.push(sceneClass); },
            pop() { return this.stack.pop(); }
        },
        Scene_Boot: class Scene_Boot {
            start() {}
        },
        PluginManager: {
            _commands: {},
            registerCommand(plugin, name, fn) {
                this._commands[plugin + '/' + name] = fn;
            },
            parameters() { return {}; }
        },
        Input: { isTriggered() { return false; } },
        AudioManager: { playSe() {} },
        SoundManager: { playBuzzer() {} },
        XMLHttpRequest: class XMLHttpRequest {
            open() {} send() {} get status() { return 404; }
        }
    };

    return sandbox;
}

function runScript(sandbox, relPath) {
    const code = fs.readFileSync(path.join(PLUGINS, relPath), 'utf8');
    vm.runInContext(code, sandbox, { filename: relPath });
}

function loadData(sandbox) {
    const PMZ = sandbox.PMZ;
    PMZ.Data._cache = {};
    for (const f of DATA_FILES) {
        try {
            PMZ.Data._cache[f] = JSON.parse(
                fs.readFileSync(path.join(ROOT, 'PMZ', f + '.json'), 'utf8'));
        } catch (e) {
            PMZ.Data._cache[f] = null;
        }
    }
    PMZ.Data._loaded = true;
    PMZ.Data._configCache = {};
    PMZ.Config._cache = {};
}

/**
 * Carga el motor completo. Devuelve el sandbox (contenedor de globals).
 * - seed: fija Math.random antes de cargar (determinista).
 * - withParty: crea $gamePMZ con el equipo inicial pedido.
 */
function loadPMZ(opts = {}) {
    const seed = opts.seed !== undefined ? opts.seed : 12345;
    const sandbox = makeStubs(makeMath(seed));
    sandbox.console = console;
    vm.createContext(sandbox);

    runScript(sandbox, 'PMZ_Core.js');
    runScript(sandbox, 'PMZ_GamePokemon.js');
    runScript(sandbox, 'PMZ_BattleCore.js');

    loadData(sandbox);

    sandbox.$gamePMZ = new sandbox.Game_PMZ();
    sandbox.$gameSwitches = {
        _v: {},
        setValue(id, v) { this._v[id] = v; },
        getValue(id) { return !!this._v[id]; },
        clear() { this._v = {}; }
    };
    sandbox.$gameTemp = {};
    sandbox.$gameMessage = { _msgs: [], add(m) { this._msgs.push(m); } };

    return sandbox;
}

/** Crea un Pokémon listo (usando datos reales). */
function makePokemon(sandbox, species, level) {
    const PMZ = sandbox.PMZ;
    const p = PMZ.Pokemon.create(species, level);
    if (!p) throw new Error('species no existe en PMZ/pokemon.json: ' + species);
    return p;
}

/** Crea una entrada de moveset estandar {key, name, pp, ...} desde un move key. */
function makeMoveEntry(sandbox, key) {
    const PMZ = sandbox.PMZ;
    const md = PMZ.Data.move(key);
    if (!md) throw new Error('move no existe en PMZ/moves.json: ' + key);
    return {
        key: key, name: md.name, pp: md.pp || 5, maxPp: md.pp || 5,
        power: md.power || 0, type: md.type || 'normal',
        category: md.category || 'physical',
        accuracy: md.accuracy !== undefined ? md.accuracy : 100,
        neverMiss: !!md.neverMiss, effect: md.effect || 'none'
    };
}

/** Equipo inicial en $gamePMZ (reemplaza cualquier equipo previo). Devuelve el primer Pokémon vivo. */
function setupParty(sandbox, entries) {
    const PMZ = sandbox.PMZ;
    const party = sandbox.$gamePMZ.party();
    party.length = 0; // aislamiento entre pruebas: el equipo es persistente en el motor
    for (const e of entries) {
        const p = makePokemon(sandbox, e.species, e.level || 5);
        if (e.manualMoves) {
            p.moves = e.manualMoves.map(m => makeMoveEntry(sandbox, m.key));
        }
        party.push(p);
    }
    return PMZ.Party.firstAlive();
}

/** Crea una batalla salvaje lista para usar (wild en PMZ.Battle). */
function startWild(sandbox, species, level, opts = {}) {
    const PMZ = sandbox.PMZ;
    const partyEntries = opts.party || [{ species: 'pikachu', level: 25 }];
    const player = setupParty(sandbox, partyEntries);
    PMZ.Battle.startWild(species, level);
    const wild = PMZ.Battle._wildPokemon;
    PMZ.Battle.initStatStages(player);
    PMZ.Battle.initStatStages(wild);
    return { sandbox, player, wild };
}

module.exports = { loadPMZ, makePokemon, makeMoveEntry, setupParty, startWild, ROOT };