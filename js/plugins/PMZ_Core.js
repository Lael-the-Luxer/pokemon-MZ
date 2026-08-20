//=============================================================================
// PMZ_Core.js
// Pokemon MZ Essential - Core System v0.2.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Pokemon MZ Essential - Core System
 * @author PMZ Team
 * @url
 * @help
 * ============================================================================
 * PMZ Core - Sistema base para juego estilo Pokemon en RPG Maker MZ.
 * Carga datos de PMZ/*.json y gestiona: equipo, PC, items, encuentros.
 * ============================================================================
 * 
 * @command healParty
 * @text Heal Party
 * @desc Cura todos los Pokemon del equipo.
 * 
 * @command giveMoney
 * @text Give Money
 * @desc Da dinero al jugador.
 * @arg amount
 * @text Amount
 * @desc Cantidad de dinero a dar
 * @type number
 * @default 500
 * 
 * @command takeMoney
 * @text Take Money
 * @desc Quita dinero al jugador.
 * @arg amount
 * @text Amount
 * @desc Cantidad de dinero a quitar
 * @type number
 * @default 500
 * 
 * @command giveItem
 * @text Give Item
 * @desc Da un objeto al jugador.
 * @arg itemKey
 * @text Item Key
 * @desc Clave del objeto (ej: pokeball, potion)
 * @type string
 * @default pokeball
 * @arg amount
 * @text Amount
 * @desc Cantidad a dar
 * @type number
 * @default 1
 * 
 * @command takeItem
 * @text Take Item
 * @desc Quita un objeto al jugador.
 * @arg itemKey
 * @text Item Key
 * @desc Clave del objeto (ej: pokeball, potion)
 * @type string
 * @default pokeball
 * @arg amount
 * @text Amount
 * @desc Cantidad a quitar
 * @type number
 * @default 1
 * 
 * @command givePokemon
 * @text Give Pokemon
 * @desc Da un Pokemon al jugador (al equipo o PC).
 * @arg species
 * @text Species
 * @desc Especie del Pokemon (ej: charmander, pikachu)
 * @type string
 * @default charmander
 * @arg level
 * @text Level
 * @desc Nivel del Pokemon
 * @type number
 * @default 5
 *
 * @command giveEgg
 * @text Give Egg
 * @desc Da un huevo de un Pokemon al jugador (al equipo o PC).
 * @arg species
 * @text Species
 * @desc Especie del Pokemon que saldra del huevo (ej: charmander, pikachu)
 * @type string
 * @default charmander
 * @arg steps
 * @text Hatch Steps
 * @desc Pasos necesarios para eclosionar (default aleatorio 2560-3840)
 * @type number
 * @default 0
 * @arg message
 * @text Custom Message
 * @desc Mensaje personalizado al recibir el huevo. {name} se reemplaza por la especie. Vacio = usar el mensaje por defecto de config.json
 * @type string
 * @default
 * 
 * @command openCenter
 * @text Open Pokemon Center
 * @desc Abre el menu del Centro Pokemon.
 * 
 * @command openMart
 * @text Open Pokemon Mart
 * @desc Abre la tienda Pokemon.
 * 
 * @command openBag
 * @text Open Bag
 * @desc Abre la mochila fuera de combate.
 * 
 * @command startSafari
 * @text Start Safari Zone
 * @desc Inicia la zona Safari.
 * @arg type
 * @text Encounter Type
 * @desc Tipo de encuentro (grass, water, etc.)
 * @type string
 * @default grass
 * 
 * @command daycareCheckEgg
 * @text Daycare - Check Egg
 * @desc Verifica si hay un huevo en la guarderia.
 * 
 * @command daycarePickupEgg
 * @text Daycare - Pickup Egg
 * @desc Recoge el huevo de la guarderia.
 * 
 * @command forceEncounter
 * @text Force Encounter
 * @desc Fuerza un encuentro salvaje (debug).
 * @arg species
 * @text Species
 * @desc Especie (opcional, si se omite usa aleatoria)
 * @type string
 * @default 
 * @arg level
 * @text Level
 * @desc Nivel del Pokemon
 * @type number
 * @default 5
 * 
 * @command debugEncounter
 * @text Debug Encounter
 * @desc Muestra informacion de debug del sistema de encuentros.
 * 
 * @param maxPartySize
 * @text Max Party Size
 * @desc Maximo de Pokemon en equipo (default: 6)
 * @type number
 * @min 1
 * @max 99
 * @default 6
 * 
 * @param boxCount
 * @text PC Box Count
 * @desc Numero de cajas en el PC (default: 24)
 * @type number
 * @min 1
 * @max 255
 * @default 24
 * 
 * @param boxSize
 * @text Pokemon per Box
 * @desc Maximo de Pokemon por caja (default: 30)
 * @type number
 * @min 1
 * @max 999
 * @default 30
 * 
 * @param battleMovesLimit
 * @text Battle Move Limit
 * @desc Limite de movimientos en combate (default: 4)
 * @type number
 * @min 1
 * @max 10
 * @default 4
 * 
 * @param encounterRate
 * @text Encounter Rate %
 * @desc Probabilidad base de encuentro salvaje (default: 15)
 * @type number
 * @min 0
 * @max 100
 * @default 15
 * 
 * @command openCenter
 * @text Open Pokemon Center
 * @desc Abre el Centro Pokemon para curar el equipo.
 * 
 * @command openMart
 * @text Open Poke Mart
 * @desc Abre la Tienda Pokemon para comprar y vender objetos.
 * 
 * @command openBag
 * @text Open Bag
 * @desc Abre la Mochila para usar objetos fuera de combate.
 * 
 * @command healParty
 * @text Heal Party
 * @desc Cura todo el equipo Pokemon.
 * 
 * @command giveMoney
 * @text Give Money
 * @desc Da dinero al jugador.
 * @arg amount
 * @text Amount
 * @type number
 * @default 100
 * 
 * @command takeMoney
 * @text Take Money
 * @desc Quita dinero al jugador.
 * @arg amount
 * @text Amount
 * @type number
 * @default 100
 */

var PMZ = PMZ || {};

PMZ.version = '0.2.0';
PMZ.Utils = PMZ.Utils || {};

// ============================================================================
// MZ Compatibility Patch - Convierte args MV (x,y,w,h) a Rectangle de MZ
// ============================================================================
(function() {
    // Patch Window_Base to accept both styles
    var _BaseInit = Window_Base.prototype.initialize;
    Window_Base.prototype.initialize = function(rect) {
        if (typeof rect === 'number') {
            rect = new Rectangle(arguments[0] || 0, arguments[1] || 0, 
                                 arguments[2] || Graphics.boxWidth, 
                                 arguments[3] || Graphics.boxHeight);
        }
        _BaseInit.call(this, rect);
    };
    
    // Patch Window_Scrollable to pass MV-style args through
    var _ScrollInit = Window_Scrollable.prototype.initialize;
    Window_Scrollable.prototype.initialize = function(rect) {
        if (typeof rect === 'number') {
            rect = new Rectangle(arguments[0] || 0, arguments[1] || 0, 
                                 arguments[2] || Graphics.boxWidth, 
                                 arguments[3] || Graphics.boxHeight);
        }
        _ScrollInit.call(this, rect);
    };
    
    // Patch Window_Selectable to pass MV-style args through
    var _SelInit = Window_Selectable.prototype.initialize;
    Window_Selectable.prototype.initialize = function(rect) {
        if (typeof rect === 'number') {
            rect = new Rectangle(arguments[0] || 0, arguments[1] || 0, 
                                 arguments[2] || Graphics.boxWidth, 
                                 arguments[3] || Graphics.boxHeight);
        }
        _SelInit.call(this, rect);
    };
    
    // Patch Window_Command to handle MV-style (x, y, commands, width)
    var _CmdInit = Window_Command.prototype.initialize;
    Window_Command.prototype.initialize = function(rect) {
        if (typeof rect === 'number') {
            var commands = arguments[2];
            var cmdWidth = typeof arguments[3] === 'number' ? arguments[3] : 0;
            rect = new Rectangle(arguments[0] || 0, arguments[1] || 0, 
                                 cmdWidth || Graphics.boxWidth, 
                                 arguments[4] || Graphics.boxHeight);
            _CmdInit.call(this, rect);
            // Set commands from MV-style array
            this._list = [];
            if (Array.isArray(commands)) {
                for (var i = 0; i < commands.length; i++) {
                    this.addCommand(commands[i], commands[i]);
                }
            }
            this.drawAllItems();
        } else {
            _CmdInit.call(this, rect);
        }
    };
    
    // Helper to make MV-style window creation cleaner
    PMZ.Utils.rect = function(x, y, w, h) {
        return new Rectangle(x || 0, y || 0, w || Graphics.boxWidth, h || Graphics.boxHeight);
    };
})();

// ============================================================================
// Sprite_PMZ_Pokemon - Carga sprites desde img/pokemon/{id}.png
// ============================================================================
function Sprite_PMZ_Pokemon() {
    this.initialize.apply(this, arguments);
}

Sprite_PMZ_Pokemon.prototype = Object.create(Sprite.prototype);
Sprite_PMZ_Pokemon.prototype.constructor = Sprite_PMZ_Pokemon;

Sprite_PMZ_Pokemon.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._pokemon = null;
    this._back = false;
};

Sprite_PMZ_Pokemon.prototype.setPokemon = function(pkmn, back) {
    this._pokemon = pkmn;
    this._back = back || false;
    this.refresh();
};

Sprite_PMZ_Pokemon.prototype.refresh = function() {
    this.bitmap = null;
    if (!this._pokemon) return;
    var id = this._pokemon.id || 1;
    var suffix = this._pokemon._formSuffix || this._pokemon._megaForm || '';
    var pad = String(id).padStart(3, '0');
    var path = PMZ.Sprites ? PMZ.Sprites.getPath(id, this._back, suffix) : 'img/pokemon/' + pad + (this._back ? 'b' : '') + '.png';
    this.bitmap = Bitmap.load(path);
};

// ============================================================================
// Sprite_PMZ_Icon - Muestra icono de Pokemon desde img/pictures/Gen 1-6 Icons
// ============================================================================
function Sprite_PMZ_Icon() {
    this.initialize.apply(this, arguments);
}

Sprite_PMZ_Icon.prototype = Object.create(Sprite.prototype);
Sprite_PMZ_Icon.prototype.constructor = Sprite_PMZ_Icon;

Sprite_PMZ_Icon.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._pokemon = null;
};

Sprite_PMZ_Icon.prototype.setPokemon = function(pkmn) {
    this._pokemon = pkmn;
    this.refresh();
};

Sprite_PMZ_Icon.prototype.refresh = function() {
    if (!this._pokemon) return;
    var suffix = this._pokemon._formSuffix || this._pokemon._megaForm || '';
    var bmp = PMZ.Icons.getBitmap(this._pokemon.id, suffix);
    // No borra el icono anterior si la carga falla (bitmap en error)
    if (bmp && !bmp.isError()) {
        this.bitmap = bmp;
    }
};

// ============================================================================
// PMZ.Config - Acceso a configuracion
// ============================================================================
PMZ.Config = {
    _cache: {},
    get: function(key, def) {
        if (key in this._cache) return this._cache[key];
        var cfg = PMZ.Data._cache.config;
        var val = cfg && cfg[key] !== undefined ? cfg[key] : def;
        this._cache[key] = val;
        return val;
    },
    isStatEvolution: function() { return this.get('evolutionMode', 'level') === 'stats'; },
    isOneShotCapture: function() { return this.get('captureMode', 'weak') === 'oneshot'; },
    megaPerBattle: function() { return this.get('megaPerBattle', 1); },
    equipSlots: function() { return this.get('equipSlots', 1); },
    spriteStyle: function() { return this.get('spriteStyle', 'auto'); },
    enableMechanics: function() { return this.get('enableMechanics', true); },
    healOnDefeat: function() { return this.get('healOnDefeat', true); }
};

// ============================================================================
// PMZ.Sprites - Resolucion de rutas de sprites con fallback
// ============================================================================
PMZ.Sprites = {
    styles: ['bw', 'frlg'],

    _getPriority: function() {
        var style = PMZ.Config.spriteStyle();
        if (style === 'bw') return ['bw'];
        if (style === 'frlg') return ['frlg'];
        return this.styles;
    },

    getPath: function(id, back, suffix) {
        suffix = suffix || '';
        var pad = String(id).padStart(3, '0');
        var priority = this._getPriority();
        // First try with suffix
        for (var i = 0; i < priority.length; i++) {
            var path = this._buildPath(priority[i], id, pad, back, suffix);
            if (this._fileExists(path)) return path;
        }
        // Fallback to normal (no suffix) if suffix version doesn't exist
        if (suffix) {
            for (var i = 0; i < priority.length; i++) {
                var path = this._buildPath(priority[i], id, pad, back, '');
                if (this._fileExists(path)) return path;
            }
        }
        return 'img/pokemon/' + pad + (back ? 'b' : '') + '.png';
    },

    _buildPath: function(style, id, pad, back, suffix) {
        suffix = suffix || '';
        if (style === 'bw') {
            return back
                ? 'img/enemies/Black-White/BW Back/' + id + suffix + ' BW-B.png'
                : 'img/enemies/Black-White/BW/' + id + suffix + ' BW.png';
        }
        if (style === 'frlg') {
            return back
                ? 'img/enemies/Fire Red- Leaf Green/FRLG Backs/FRLG-B ' + id + suffix + '.png'
                : 'img/enemies/Fire Red- Leaf Green/FRLG/' + id + suffix + ' FRLG.png';
        }
        return 'img/pokemon/' + pad + suffix + (back ? 'b' : '') + '.png';
    },

    _fileExists: function(url) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.send(null);
            return xhr.status === 0 || xhr.status === 200;
        } catch (e) {
            return false;
        }
    }
};

// ============================================================================
// PMZ.Data - Carga y acceso a datos de JSON
// ============================================================================
PMZ.Data = {
    _loaded: false,
    _cache: {},
    
    files: ['config', 'pokemon', 'moves', 'items', 'trainers', 'types', 'encounters', 'abilities', 'badges', 'mechanics', 'natures'],
    
    loadAll: function() {
        this.files.forEach(function(name) {
            this._loadFile(name);
        }, this);
        this._preloadTypeImages();
        this._loaded = true;
        console.log('[PMZ] All data loaded');
    },
    
    _typeImageCache: {},
    
    _typeImageMap: {
        'normal': 'Normal', 'fire': 'Fire', 'water': 'Water', 'electric': 'Electric',
        'grass': 'Grass', 'ice': 'Ice', 'fighting': 'Fight', 'poison': 'Poison',
        'ground': 'Ground', 'flying': 'Flying', 'psychic': 'Psychic', 'bug': 'Bug',
        'rock': 'Rock', 'ghost': 'Ghost', 'dragon': 'Dragon', 'dark': 'Dark',
        'steel': 'Steel', 'fairy': 'Fairy', 'question': 'Question'
    },
    
    _preloadTypeImages: function() {
        var td = this._cache.types;
        if (!td || !td._meta || !td._meta.imageFolder) return;
        var folder = td._meta.imageFolder;
        var self = this;
        Object.keys(this._typeImageMap).forEach(function(key) {
            var fileName = self._typeImageMap[key];
            var bmp = ImageManager.loadPicture(folder + '/' + fileName);
            self._typeImageCache[key] = bmp;
        });
        console.log('[PMZ] Type images preloaded from ' + folder);
    },
    
    typeImage: function(typeKey) {
        typeKey = String(typeKey || '').toLowerCase();
        return this._typeImageCache[typeKey] || null;
    },
    
    _loadFile: function(name) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'PMZ/' + name + '.json', false);
            xhr.overrideMimeType('application/json');
            xhr.send(null);
            
            if (xhr.status === 0 || xhr.status === 200) {
                this._cache[name] = JSON.parse(xhr.responseText);
                console.log('[PMZ] Loaded: ' + name + '.json');
            } else {
                console.warn('[PMZ] Failed: ' + name + '.json (status ' + xhr.status + ')');
            }
        } catch(e) {
            console.warn('[PMZ] Error loading ' + name + ': ' + e.message);
        }
    },
    
    get: function(name) {
        return this._cache[name] || null;
    },
    
    pokemon: function(key) { return this._cache.pokemon ? this._cache.pokemon[key] : null; },
    move: function(key) { return this._cache.moves ? this._cache.moves[key] : null; },
    item: function(key) { return this._cache.items ? this._cache.items[key] : null; },
    trainer: function(key) { return this._cache.trainers ? this._cache.trainers[key] : null; },
    type: function(key) { return this._cache.types ? this._cache.types[key] : null; },
    encounter: function() { return this._cache.encounters || null; },
    config: function() { return this._cache.config || null; },
    ability: function(key) { return this._cache.abilities ? this._cache.abilities[key] : null; },
    badges: function() { return this._cache.badges || null; },
    mechanics: function() { return this._cache.mechanics || null; },
    natures: function() { return this._cache.natures || null; },
    speciesId: function(key) { var p = this.pokemon(key); return p ? p.id : null; },
    
    configValue: function(key) {
        if (!this._configCache) this._configCache = {};
        if (key in this._configCache) return this._configCache[key];
        var c = this.config();
        var val = c ? c[key] : null;
        this._configCache[key] = val;
        return val;
    }
};

// ============================================================================
// Game_PMZ - Datos de guardado (Save/Load compatible)
// ============================================================================
function Game_PMZ() {
    this.initialize.apply(this, arguments);
}

Game_PMZ.prototype.initialize = function() {
    this._party = [];
    this._boxes = [];
    this._itemBag = {};
    this._steps = 0;
    this._money = 0;
    this._lastPokeCenter = null;
    this._badges = [];
    this._safariBalls = 0;
    this._safariSteps = 0;
    this._daycare = { pokemon: [null, null], egg: null };
    this._daycareSteps = 0;
    this._pokedexSeen = {};
    this._pokedexCaught = {};
    this._shopBought = {};
    this._startTime = Date.now();
    
    var cfg = PMZ.Data.config();
    var boxCount = cfg ? (cfg.boxCount || 24) : 24;
    var boxSize = cfg ? (cfg.maxBoxPokemon || 30) : 30;
    
    for (var i = 0; i < boxCount; i++) {
        this._boxes.push({ name: 'Box ' + (i + 1), pokemon: [] });
    }
    
    this._itemBag = { pokeball: 5, potion: 3 };
    this._money = cfg ? (cfg.startingMoney || 3000) : 3000;
};

Game_PMZ.prototype.party = function() { return this._party; };
Game_PMZ.prototype.money = function() { return this._money || 0; };
Game_PMZ.prototype.addMoney = function(v) { this._money = Math.max(0, (this._money || 0) + v); };
Game_PMZ.prototype.removeMoney = function(v) { this._money = Math.max(0, (this._money || 0) - v); };
Game_PMZ.prototype.boxes = function() { return this._boxes; };
Game_PMZ.prototype.itemBag = function() { return this._itemBag; };
Game_PMZ.prototype.steps = function() { return this._steps; };
Game_PMZ.prototype.addStep = function() { this._steps++; };
Game_PMZ.prototype.lastPokeCenter = function() { return this._lastPokeCenter; };
Game_PMZ.prototype.setLastPokeCenter = function(v) { this._lastPokeCenter = v; };
Game_PMZ.prototype.badges = function() { return this._badges; };
Game_PMZ.prototype.hasBadge = function(key) { return this._badges.indexOf(key) >= 0; };
Game_PMZ.prototype.giveBadge = function(key) { if (this._badges.indexOf(key) < 0) this._badges.push(key); };
Game_PMZ.prototype.badgeCount = function() { return this._badges.length; };
Game_PMZ.prototype.safariBalls = function() { return this._safariBalls; };
Game_PMZ.prototype.setSafariBalls = function(v) { this._safariBalls = Math.max(0, v); };
Game_PMZ.prototype.safariSteps = function() { return this._safariSteps; };
Game_PMZ.prototype.setSafariSteps = function(v) { this._safariSteps = Math.max(0, v); };
Game_PMZ.prototype.daycare = function() { return this._daycare; };
Game_PMZ.prototype.pokedexSeen = function() { return this._pokedexSeen; };
Game_PMZ.prototype.pokedexCaught = function() { return this._pokedexCaught; };
Game_PMZ.prototype.seenCount = function() { return Object.keys(this._pokedexSeen).length; };
Game_PMZ.prototype.caughtCount = function() { return Object.keys(this._pokedexCaught).length; };
Game_PMZ.prototype.playTime = function() { return Math.floor((Date.now() - (this._startTime || Date.now())) / 1000); };
Game_PMZ.prototype.pc = function() {
    // Return the first storage box (PC box 1)
    if (this._boxes && this._boxes.length > 0) return this._boxes[0].pokemon;
    return [];
};
Game_PMZ.prototype.addToPartyOrPC = function(pkmn) {
    var party = this._party;
    // Register species as caught in Pokedex
    if (pkmn && pkmn.species) PMZ.Pokedex.registerCaught(pkmn.species);
    var max = PMZ.Data.configValue('maxPartySize') || 6;
    if (party.length < max) {
        party.push(pkmn);
        return 'party';
    }
    var box1 = this.pc();
    if (box1) {
        box1.push(pkmn);
        return 'pc';
    }
    return null;
};

// ============================================================================
// PMZ.Money - Sistema de dinero
// ============================================================================
PMZ.Money = {
    get: function() { return $gamePMZ ? $gamePMZ.money() : 0; },
    add: function(v) { if ($gamePMZ) $gamePMZ.addMoney(v); },
    remove: function(v) { if ($gamePMZ) $gamePMZ.removeMoney(v); },
    has: function(v) { return this.get() >= v; }
};

// ============================================================================
// PMZ.Status - Estados en combate
// ============================================================================
PMZ.Status = {
    _sleepTurns: {},
    _confuseTurns: {},

    canApply: function(pokemon, status) {
        if (status === 'poison' && PMZ.Abilities.hasEffect(pokemon, 'status_immunity', 'poison')) return false;
        if (status === 'paralyze' && PMZ.Abilities.hasEffect(pokemon, 'status_immunity', 'paralyze')) return false;
        if (status === 'sleep' && PMZ.Abilities.hasEffect(pokemon, 'status_immunity', 'sleep')) return false;
        if (status === 'burn' && PMZ.Abilities.hasEffect(pokemon, 'status_immunity', 'burn')) return false;
        if (status === 'freeze' && PMZ.Abilities.hasEffect(pokemon, 'status_immunity', 'freeze')) return false;
        if (status === 'confusion' && PMZ.Abilities.hasEffect(pokemon, 'status_immunity', 'confusion')) return false;
        return true;
    },

    apply: function(pokemon, status) {
        if (!pokemon || pokemon.status) return false;
        if (!this.canApply(pokemon, status)) return false;
        pokemon.status = status;
        if (status === 'sleep') this._sleepTurns[pokemon._battleId] = Math.floor(Math.random() * 3) + 1;
        if (status === 'confusion') this._confuseTurns[pokemon._battleId] = Math.floor(Math.random() * 4) + 2;
        return true;
    },

    cure: function(pokemon) {
        if (!pokemon) return;
        pokemon.status = null;
        delete this._sleepTurns[pokemon._battleId];
        delete this._confuseTurns[pokemon._battleId];
    },

    hasStatus: function(pokemon, status) {
        return pokemon && pokemon.status === status;
    },

    // Apply status tick (poison/burn damage, sleep countdown, etc.)
    tick: function(pokemon) {
        if (!pokemon || pokemon.currentHp <= 0) return { damaged: false, msg: '' };

        // Hydration: cures status at end of turn if weather is rain
        if (PMZ.Abilities && PMZ.Abilities.hasEffect && PMZ.Abilities.hasEffect(pokemon, 'hydration') &&
            pokemon.status && PMZ.Weather && PMZ.Weather.is && PMZ.Weather.is('rain')) {
            var oldStatus = pokemon.status;
            this.cure(pokemon);
            return { damaged: false, msg: pokemon.name + ' se curo de ' + oldStatus + ' por Hydration!' };
        }

        if (pokemon.status === 'poison' || pokemon.status === 'toxic') {
            // Magic Guard: immune to indirect damage
            if (PMZ.Abilities && PMZ.Abilities.immuneIndirect && PMZ.Abilities.immuneIndirect(pokemon)) {
                return { damaged: false, msg: pokemon.name + ' no se ve afectado por el veneno (Magic Guard)!' };
            }
            var dmg = Math.max(1, Math.floor(pokemon.maxHp / 8));
            pokemon.currentHp = Math.max(0, pokemon.currentHp - dmg);
            // NOTE: Sturdy / Focus Band / Focus Sash do NOT trigger from status damage
            // (poison/toxic/burn/confusion). They only trigger from attacking moves.
            return { damaged: true, msg: pokemon.name + ' sufre dano por veneno!' };
        }

        if (pokemon.status === 'burn') {
            if (PMZ.Abilities && PMZ.Abilities.immuneIndirect && PMZ.Abilities.immuneIndirect(pokemon)) {
                return { damaged: false, msg: pokemon.name + ' no se ve afectado por la quemadura (Magic Guard)!' };
            }
            var dmg2 = Math.max(1, Math.floor(pokemon.maxHp / 16));
            pokemon.currentHp = Math.max(0, pokemon.currentHp - dmg2);
            // NOTE: Sturdy / Focus Band / Focus Sash do NOT trigger from status damage.
            return { damaged: true, msg: pokemon.name + ' sufre dano por quemadura!' };
        }

        if (pokemon.status === 'sleep') {
            if (this._sleepTurns[pokemon._battleId] !== undefined) {
                this._sleepTurns[pokemon._battleId]--;
                if (this._sleepTurns[pokemon._battleId] <= 0) {
                    this.cure(pokemon);
                    return { damaged: false, msg: pokemon.name + ' desperto!' };
                }
            }
            return { damaged: false, msg: pokemon.name + ' esta dormido...' };
        }

        if (pokemon.status === 'freeze') {
            if (Math.random() < 0.2) {
                this.cure(pokemon);
                return { damaged: false, msg: pokemon.name + ' se descongelo!' };
            }
            return { damaged: false, msg: pokemon.name + ' esta congelado!' };
        }

        if (pokemon.status === 'confusion') {
            if (this._confuseTurns[pokemon._battleId] !== undefined) {
                this._confuseTurns[pokemon._battleId]--;
                if (this._confuseTurns[pokemon._battleId] <= 0) {
                    this.cure(pokemon);
                    return { damaged: false, msg: pokemon.name + ' ya no esta confundido!' };
                }
            }
            // Check if hits itself
            if (Math.random() < 0.33) {
                if (PMZ.Abilities && PMZ.Abilities.immuneIndirect && PMZ.Abilities.immuneIndirect(pokemon)) {
                    return { damaged: false, msg: pokemon.name + ' resiste la confusion (Magic Guard)!' };
                }
                var selfDmg = Math.max(1, Math.floor(pokemon.maxHp / 10));
                pokemon.currentHp = Math.max(0, pokemon.currentHp - selfDmg);
                // NOTE: Sturdy / Focus Band / Focus Sash do NOT trigger from confusion self-hit.
                return { damaged: true, confusedHit: true, msg: pokemon.name + ' se golpea por confusion!' };
            }
            return { damaged: false, msg: pokemon.name + ' esta confundido!' };
        }

        return { damaged: false, msg: '' };
    },

    // Check if a Pokémon can act based on status
    canAct: function(pokemon) {
        if (!pokemon) return true;
        if (pokemon.status === 'sleep') return false;
        if (pokemon.status === 'freeze') return false;
        if (pokemon.status === 'paralyze') {
            // 25% chance of being fully paralyzed
            if (Math.random() < 0.25) return false;
        }
        // Flinch (set by King's Rock / Razor Fang / flinch_chance effect)
        if (pokemon._flinchNextTurn) {
            pokemon._flinchNextTurn = false;
            return false;
        }
        return true;
    },

    // Set flinch flag for next turn (called by King's Rock, Razor Fang, flinch_chance)
    setFlinch: function(pokemon) {
        if (pokemon) pokemon._flinchNextTurn = true;
    },

    // Modifier for speed based on status
    speedMod: function(pokemon) {
        if (!pokemon) return 1;
        if (pokemon.status === 'paralyze') return 0.5;
        return 1;
    },

    cleanBattle: function() {
        this._sleepTurns = {};
        this._confuseTurns = {};
    }
};

// ============================================================================
// PMZ.Effects - Registro de efectos de movimientos
// Cada efecto se define como { type: 'tipo', ...params }
// Soporta formato legacy (string) y nuevo (objeto con parámetros)
// ============================================================================
PMZ.Effects = {
    _registry: {},

    register: function(type, handler) {
        this._registry[type] = handler;
    },

    normalize: function(effect) {
        if (!effect) return { type: 'none' };
        if (typeof effect === 'string') return { type: effect };
        return effect;
    },

    getType: function(effect) {
        return this.normalize(effect).type;
    },

    getParams: function(effect) {
        var e = this.normalize(effect);
        var p = {};
        for (var k in e) { if (k !== 'type') p[k] = e[k]; }
        return p;
    },

    run: function(effect, attacker, defender, moveData, damage, battle) {
        var e = this.normalize(effect);
        var handler = this._registry[e.type];
        if (handler) return handler(attacker, defender, moveData, e, damage, battle);
        return '';
    },

    init: function() {
        var self = this;
        var r = Math.random;

        self.register('none', function(){return'';});

        self.register('status', function(a,d,md,e,dam,b){
            var msgs={poison:'fue envenenado!',toxic:'fue gravemente envenenado!',paralyze:'fue paralizado!',sleep:'se durmio!',freeze:'fue congelado!',confusion:'se confundio!',burn:'fue quemado!'};
            if(PMZ.Status.apply(d,e.status)) return d.name+' '+msgs[e.status]; return'';
        });

        self.register('status_chance', function(a,d,md,e,dam,b){
            var sg=a&&PMZ.Abilities.hasEffect(a,'serene_grace'), sd=d&&PMZ.Abilities.hasEffect(d,'block_secondary_effects');
            var fc=sd?0:((e.chance||0.3)*(sg?2:1));
            if(r()<fc&&PMZ.Status.apply(d,e.status)) return d.name+' fue '+(e.status==='burn'?'quemado':e.status)+'!';
            return'';
        });

        self.register('flinch_chance', function(a,d,md,e){
            var sg=a&&PMZ.Abilities.hasEffect(a,'serene_grace'), sd=d&&PMZ.Abilities.hasEffect(d,'block_secondary_effects');
            if(!sd&&r()<((e.chance||0.3)*(sg?2:1))) return d.name+' retrocedio!';
            return'';
        });

        self.register('random_status', function(a,d,md,e){
            var list=e.statuses||['poison','burn','paralyze'];
            var st=list[Math.floor(r()*list.length)];
            if(PMZ.Status.apply(d,st)) return d.name+' quedo '+(st==='burn'?'quemado':st)+'!';
            return'';
        });

        self.register('self_status', function(a,d,md,e,dam,b){
            if(e.status==='confusion'&&PMZ.Status.apply(a,'confusion')){
                if(b) b._confusedUser[a._battleId]={turns:Math.floor(r()*2)+2,moveKey:md.key};
                return a.name+' se confundio por el ataque!';
            }
            return'';
        });

        self.register('self_faint', function(a){a.currentHp=0;return a.name+' se autodestruyo!';});

        self.register('sleep_absorb', function(a,d,md,e,dam){
            if(dam>0&&d.status==='sleep'){a.currentHp=Math.min(a.maxHp,a.currentHp+Math.floor(dam*0.5));return a.name+' absorbe sueno!';}
            return'';
        });

        self.register('recoil', function(a,d,md,e,dam){
            if(dam>0&&!PMZ.Abilities.immuneRecoil(a)){var rd=Math.max(1,Math.floor(dam*((e.percent||25)/100)));a.currentHp=Math.max(1,a.currentHp-rd);return a.name+' recibe dano residual!';}
            return'';
        });

        self.register('crash', function(a,d,md,e,dam){
            if(dam===0&&!PMZ.Abilities.immuneRecoil(a)){var cd=Math.max(1,Math.floor(a.maxHp*((e.percent||50)/100)));a.currentHp=Math.max(1,a.currentHp-cd);return a.name+' se estrello!';}
            return'';
        });

        self.register('recoil_crash', function(a,d,md,e,dam){
            if(dam===0&&!PMZ.Abilities.immuneRecoil(a)){a.currentHp=Math.max(1,a.currentHp-Math.max(1,Math.floor(a.maxHp*0.5)));return a.name+' se estrello!';}
            return'';
        });

        self.register('drain', function(a,d,md,e,dam){
            if(dam>0){a.currentHp=Math.min(a.maxHp,a.currentHp+Math.floor(dam*((e.percent||50)/100)));return a.name+' absorbe energia!';}
            return'';
        });

        self.register('heal', function(a,d,md,e){
            a.currentHp=Math.min(a.maxHp,a.currentHp+Math.floor(a.maxHp*((e.percent||50)/100)));
            return a.name+' recupero PS!';
        });

        self.register('heal_weather', function(a,d,md,e){
            var w=PMZ.Weather.current?PMZ.Weather.current.type:null,pct=e.base||50;
            if(w==='rain'||w==='sandstorm'||w==='hail')pct=e.rain||25;else if(w==='sun')pct=e.sun||67;
            a.currentHp=Math.min(a.maxHp,a.currentHp+Math.floor(a.maxHp*(pct/100)));
            return a.name+' recupero PS!';
        });

        self.register('rest', function(a,d,md,e,dam,b){
            if(!a.status){a.currentHp=a.maxHp;PMZ.Status.apply(a,'sleep');if(b)b._sleepTurns[a._battleId]=3;return a.name+' se durmio y recupero PS!';}
            return'';
        });

        self.register('stat_stage', function(a,d,md,e){
            var t=e.target==='self'?a:d,msg='';
            if(e.stat){var m=PMZ.Battle.statStageMsg(t,e.stat,e.stages||1);if(m)msg=m;}
            if(e.stat2){var m2=PMZ.Battle.statStageMsg(t,e.stat2,e.stages2||1);if(m2)msg=msg?msg+' '+m2:m2;}
            return msg;
        });

        self.register('stat_stage_chance', function(a,d,md,e){
            var sg=a&&PMZ.Abilities.hasEffect(a,'serene_grace'), sd=d&&PMZ.Abilities.hasEffect(d,'block_secondary_effects');
            if(e.target!=='self'&&sd)return'';
            if(r()<((e.chance||0.3)*(sg?2:1))) return PMZ.Battle.statStageMsg(e.target==='self'?a:d,e.stat,e.stages||-1);
            return'';
        });

        self.register('stat_stage_self', function(a,d,md,e){
            if(e.selfStat)PMZ.Battle.boostStat(a,e.selfStat,e.selfStages||-1);
            if(e.selfStat2)PMZ.Battle.boostStat(a,e.selfStat2,e.selfStages2||-1);
            return a.name+' modifico sus stats!';
        });

        self.register('reset_stats', function(a,d){
            if(a._statStages)for(var s in a._statStages)a._statStages[s]=0;
            if(d._statStages)for(var s2 in d._statStages)d._statStages[s2]=0;
            return'Todos los stats volvieron a la normalidad!';
        });

        self.register('shell_smash', function(a){
            PMZ.Battle.boostStat(a,'defense',-1);PMZ.Battle.boostStat(a,'spDefense',-1);
            PMZ.Battle.boostStat(a,'attack',2);PMZ.Battle.boostStat(a,'spAttack',2);PMZ.Battle.boostStat(a,'speed',2);
            return a.name+' uso Rompecascara!';
        });

        self.register('dragon_dance', function(a){
            PMZ.Battle.boostStat(a,'attack',1);PMZ.Battle.boostStat(a,'speed',1);
            return a.name+' Danza Dragon!';
        });

        self.register('screen', function(a,d,md,e){
            var side=a===PMZ.Battle._playerPokemon?'player':'enemy',t=e.turns||5;
            if(e.screen==='reflect')PMZ.Battle._reflect[side]=t;
            else if(e.screen==='light_screen')PMZ.Battle._lightScreen[side]=t;
            else if(e.screen==='mist')PMZ.Battle._mist[side]=t;
            var msgs={reflect:'Reflect protege al equipo!',light_screen:'Pantalla de luz protege!',mist:'Niebla protege stats!',safeguard:'Safeguard protege!'};
            return msgs[e.screen]||'Pantalla colocada!';
        });

        self.register('weather', function(a,d,md,e,dam,b){
            PMZ.Weather.set(e.weather||'rain',e.turns||5);
            if(b)PMZ.Weather.applyToBattleScene(b);
            var msgs={rain:'!Empezo a llover!',sun:'!El sol comenzo a brillar!',sandstorm:'!Se levanto tormenta de arena!',hail:'!Empezo a granizar!'};
            return msgs[e.weather]||'Clima cambiado!';
        });

        self.register('substitute', function(a){
            var sh=Math.max(1,Math.floor(a.maxHp*0.25));a.currentHp-=sh;
            PMZ.Battle._substitute[a._battleId]=sh;
            return a.name+' creo un sustituto!';
        });

        self.register('leech_seed', function(a,d){
            if(!PMZ.Battle._leechSeed[d._battleId]){PMZ.Battle._leechSeed[d._battleId]=a._battleId;return d.name+' fue sembrado!';}
            return'';
        });

        self.register('trap', function(a,d,md,e,dam){
            if(dam>0&&!PMZ.Battle._bind[d._battleId]){PMZ.Battle._bind[d._battleId]={turns:Math.floor(r()*3)+2,attackerId:a._battleId};return d.name+' fue atrapado!';}
            return'';
        });

        self.register('protect', function(a){
            PMZ.Battle._protect[a._battleId]={turns:1,success:Math.random()<0.5};
            return a.name+' se protege!';
        });

        self.register('bide', function(a){
            if(!PMZ.Battle._bide[a._battleId]){PMZ.Battle._bide[a._battleId]={turns:3,damage:0};return a.name+' aguanta el ataque!';}
            return'';
        });

        self.register('focus_energy', function(a){
            PMZ.Battle._focusEnergy[a._battleId]=true;
            return a.name+' concentra su energia!';
        });

        self.register('rage', function(a){PMZ.Battle._rage[a._battleId]=true;return'';});

        self.register('disable', function(a,d){
            if(d.moves&&d.moves.length>0){
                var lk=PMZ.Battle._lastMoveUsed[d._battleId];
                for(var i=0;i<d.moves.length;i++){if(d.moves[i].key===lk){PMZ.Battle._disable[d._battleId]={moveIndex:i,turns:Math.floor(r()*4)+2};return d.moves[i].name+' de '+d.name+' fue desactivado!';}}
            }
            return'';
        });

        self.register('transform', function(a,d){
            if(d.moves){a.types=d.types.slice();a.moves=[];for(var i=0;i<Math.min(d.moves.length,4);i++){var sm=d.moves[i];a.moves.push({key:sm.key,name:sm.name,pp:sm.maxPp||5,maxPp:sm.maxPp||5,power:sm.power||0,type:sm.type||'normal',category:sm.category||'status',accuracy:sm.accuracy!==undefined?sm.accuracy:100,neverMiss:!!sm.neverMiss,effect:sm.effect||{type:'none'}});}return a.name+' se transformo en '+d.name+'!';}
            return'';
        });

        self.register('counter', function(a,d,md,e,dam,b){
            if(b&&b._lastDamageTaken){d.currentHp=Math.max(0,d.currentHp-Math.floor(b._lastDamageTaken*2));return d.name+' recibe Contraataque!';}
            return'';
        });

        self.register('mirrorcoat', function(a,d,md,e,dam,b){
            if(b&&b._lastDamageTaken){d.currentHp=Math.max(0,d.currentHp-Math.floor(b._lastDamageTaken*2));return d.name+' recibe Espejo!';}
            return'';
        });

        self.register('conversion', function(a){
            if(a.moves&&a.moves.length>0){a.types=[a.moves[0].type||'normal'];return a.name+' se volvio tipo '+a.types[0]+'!';}
            return'';
        });

        self.register('mimic', function(a,d,md,e,dam,b){
            if(d.moves&&d.moves.length>0){var lk=PMZ.Battle._lastMoveUsed[d._battleId];if(lk){var m=PMZ.Data.move(lk);if(m&&a.moves){var mm={key:lk,name:m.name,pp:m.pp,maxPp:m.pp,power:m.power||0,type:m.type,category:m.category||'status',accuracy:m.accuracy!==undefined?m.accuracy:100,neverMiss:!!m.neverMiss,effect:m.effect||{type:'none'}};if(a.moves.length<4)a.moves.push(mm);else a.moves[0]=mm;return a.name+' copio '+m.name+'!';}}}
            return'';
        });

        self.register('never_miss', function(a,d,md){PMZ.Battle._lastMoveUsed[a._battleId]=md.key;return'';});

        self.register('money', function(a){PMZ.Money.add(5*a.level);return'Entrego dinero extra!';});

        // --- Damage computation registry (fixed_damage, psywave, ohko) ---
        self.registerDamage('fixed_damage', function(a,d,e){
            if(e.amount==='level')return a.level;
            if(e.amount==='half_hp')return Math.max(1,Math.floor(d.currentHp/2));
            return Number(e.amount)||0;
        });
        self.registerDamage('psywave', function(a){
            return Math.floor(a.level*(0.5+r()*0.5));
        });
        self.registerDamage('ohko', function(a,d){
            if(a.level>=d.level&&r()<0.3+(a.level-d.level)*0.01)return d.currentHp;
            return -1;
        });

        // --- Multi-hit param registry ---
        self.registerHit('multi_hit', function(a,e){
            var mn=e.min||2,mx=e.max||2;
            var sl=PMZ.Abilities.hasEffect(a,'skill_link');
            var h=sl?mx:(mn===mx?mn:(r()<0.375?2:(r()<0.5?3:(r()<0.5?4:5))));
            return Math.min(mx,Math.max(mn,h));
        });
    },

    // --- Damage computation registry ---
    _damageRegistry: {},
    registerDamage: function(type, handler){this._damageRegistry[type]=handler;},
    computeDamage: function(effect,attacker,defender){
        var e=this.normalize(effect);
        var h=this._damageRegistry[e.type];
        if(h)return h(attacker,defender,e);
        return null;
    },

    // --- Multi-hit registry ---
    _hitRegistry: {},
    registerHit: function(type, handler){this._hitRegistry[type]=handler;},
    getHitParams: function(effect,attacker){
        var e=this.normalize(effect);
        var h=this._hitRegistry[e.type];
        if(h)return h(attacker,e);
        return null;
    },

    // Quick effect type check
    isMarker: function(effect,type){return this.normalize(effect).type===type;},
};

PMZ.Effects.init();
PMZ.Abilities = {
    _priority: {
        entry: { 'drizzle': 1, 'drought': 1, 'sandstream': 1, 'snowwarning': 1,
                 'intimidate': 10, 'trace': 20, 'download': 25 },
        contact: { 'static': 1, 'flamebody': 1, 'poisonpoint': 1, 'roughskin': 5 },
        faint: { 'aftermath': 1 },
        turnEnd: { 'raindish': 1, 'dryskin': 2, 'shedskin': 3 }
    },

    // --- Hook system ---
    _hooks: {},

    registerHook: function(hookName, handler) {
        if (!this._hooks[hookName]) this._hooks[hookName] = [];
        this._hooks[hookName].push(handler);
    },

    triggerHook: function(hookName, context) {
        var hooks = this._hooks[hookName] || [];
        var results = [];
        for (var i = 0; i < hooks.length; i++) {
            var r = hooks[i](context);
            if (r) results.push(r);
        }
        return results;
    },

    getPriority: function(effect, category) {
        var cat = this._priority[category] || {};
        return cat[effect] || 50;
    },

    getAllAbilityNames: function(pokemon) {
        var keys = this.getAll(pokemon);
        return keys.map(function(k) {
            var d = PMZ.Data.ability(k);
            return d ? d.name || k : k;
        }).filter(function(n) { return n; });
    },

    getAll: function(pokemon) {
        var base = PMZ.Data.pokemon(pokemon.species);
        var keys = [];
        if (base && base.abilities) { keys = base.abilities; }
        return keys;
    },

    hasEffect: function(pokemon, effect, param) {
        var keys = this.getAll(pokemon);
        for (var i = 0; i < keys.length; i++) {
            var data = PMZ.Data.ability(keys[i]);
            if (data && data.effect === effect) {
                if (param !== undefined && data.status !== param) continue;
                return true;
            }
        }
        return false;
    },

    hasHook: function(pokemon, hookName) {
        var keys = this.getAll(pokemon);
        for (var i = 0; i < keys.length; i++) {
            var data = PMZ.Data.ability(keys[i]);
            if (data && data.hook === hookName) return true;
        }
        return false;
    },

    getAbilityData: function(pokemon, effect) {
        var keys = this.getAll(pokemon);
        for (var i = 0; i < keys.length; i++) {
            var data = PMZ.Data.ability(keys[i]);
            if (data && data.effect === effect) return data;
        }
        return null;
    },

    getAbilitiesByHook: function(pokemon, hookName) {
        var keys = this.getAll(pokemon);
        var result = [];
        for (var i = 0; i < keys.length; i++) {
            var data = PMZ.Data.ability(keys[i]);
            if (data && data.hook === hookName) result.push(data);
        }
        return result;
    },

    // --- Weather speed modifier ---
    weatherSpeedMult: function(pokemon) {
        if (!pokemon) return 1;
        if (!PMZ.Weather||!PMZ.Weather.is) return 1;
        var w=PMZ.Weather.is('sun'),r=PMZ.Weather.is('rain'),s=PMZ.Weather.is('sandstorm'),h=PMZ.Weather.is('hail');
        if(this.hasEffect(pokemon,'chlorophyll')&&w)return 2;
        if(this.hasEffect(pokemon,'swiftswim')&&r)return 2;
        if(this.hasEffect(pokemon,'sandrush')&&s)return 2;
        if(this.hasEffect(pokemon,'slushrush')&&h)return 2;
        return 1;
    },

    // --- Sturdy / Focus Sash survival ---
    preventKO: function(pokemon, wasFullHp) {
        if(!pokemon||pokemon.currentHp>0)return false;
        if(wasFullHp&&this.hasEffect(pokemon,'sturdy')){pokemon.currentHp=1;return true;}
        if(wasFullHp&&PMZ.HoldItems&&PMZ.HoldItems.hasItem&&PMZ.HoldItems.hasItem(pokemon,'focussash')){
            pokemon.currentHp=1;if(PMZ.HoldItems.consumeItem)PMZ.HoldItems.consumeItem(pokemon);return true;
        }
        return false;
    },

    // --- Crit prevention (via hook) ---
    preventCrit: function(pokemon) {
        if(!pokemon)return false;
        var ctx={defender:pokemon,attacker:null};
        var r=this.triggerHook('onCritCheck',ctx);
        for(var i=0;i<r.length;i++){if(r[i]&&r[i].preventCrit)return true;}
        return false;
    },

    // --- Cloud Nine weather cancel ---
    cloudNine: function(pokemon){return pokemon&&this.hasEffect(pokemon,'cloudnine');},

    // --- Magic Guard indirect immunity ---
    immuneIndirect: function(pokemon){return pokemon&&this.hasEffect(pokemon,'magicguard');},

    // --- Rock Head / Magic Guard recoil immunity ---
    immuneRecoil: function(pokemon){return pokemon&&(this.hasEffect(pokemon,'rockhead')||this.hasEffect(pokemon,'magicguard'));},

    // Storage for modifyDefense message
    _lastModifyMsg: null,

    // --- Damage modifier (calls onDamageCalc hook) ---
    modifyDefense: function(attacker, defender, moveData, damage) {
        if(!defender||!moveData)return damage;
        this._lastModifyMsg=null;
        var ctx={attacker:attacker,defender:defender,moveData:moveData,damage:damage};
        var r=this.triggerHook('onDamageCalc',ctx);
        for(var i=0;i<r.length;i++){
            var o=r[i];
            if(o&&o.immune){
                if(o.msg)this._lastModifyMsg=o.msg;
                return o.damage!==undefined?o.damage:0;
            }
        }
        return damage;
    },

    // --- Get message from last modifyDefense call ---
    getModifyMsg: function(){var m=this._lastModifyMsg;this._lastModifyMsg=null;return m;},

    // --- Built-in hook handlers ---
    initHooks: function() {
        var self = this;
        var r = Math.random;

        // ======== onDamageCalc: type immunity, absorption, damage modifiers ========
        self.registerHook('onDamageCalc', function(ctx) {
            var a = ctx.attacker, d = ctx.defender, md = ctx.moveData, dam = ctx.damage;
            if (!d || !md) return null;

            // Type immunity (Levitate type)
            if (self.hasEffect(d, 'type_immunity', md.type)) return { damage: 0, immune: true };

            // Type absorb (Water Absorb, Volt Absorb)
            if (self.hasEffect(d, 'type_absorb', md.type)) {
                var heal = Math.floor(dam * 0.25);
                d.currentHp = Math.min(d.maxHp, d.currentHp + heal);
                return { damage: 0, immune: true, msg: d.name + ' absorbe el ataque!' };
            }

            // Levitate
            if (self.hasEffect(d, 'levitate') && md.type === 'ground') return { damage: 0, immune: true };

            // Soundproof
            if (self.hasEffect(d, 'soundproof') && md.isSound) return { damage: 0, immune: true };

            // Scrappy (attacker side)
            if (self.hasEffect(a, 'scrappy') && (md.type === 'normal' || md.type === 'fighting') &&
                d.types && d.types.indexOf('ghost') >= 0) { /* bypass */ }

            // === Damage modifiers (moved from calcDamage) ===

            // Adaptability: STAB 2.0 instead of 1.5
            if (self.hasEffect(a, 'adaptability')) return { stabMult: 2.0 };

            // Thick Fat: half Fire/Ice damage
            if (self.hasEffect(d, 'thick_fat') && (md.type === 'fire' || md.type === 'ice')) {
                return { damageMult: 0.5 };
            }

            // Filter / Solid Rock: reduce super-effective by 25%
            if (dam > 0 && (self.hasEffect(d, 'filter') || self.hasEffect(d, 'solid_rock'))) {
                return { damageMult: 0.75, condition: 'super_effective' };
            }

            // Tinted Lens: double not-very-effective damage
            if (self.hasEffect(a, 'tinted_lens')) {
                return { damageMult: 2.0, condition: 'not_very_effective' };
            }

            // Technician: boost <=60 power moves
            if (self.hasEffect(a, 'technician') && md.power && md.power <= 60) {
                return { damageMult: 1.5 };
            }

            // Reckless: boost recoil moves
            if (self.hasEffect(a, 'reckless') && md.recoil) {
                return { damageMult: 1.2 };
            }

            // Iron Fist: boost punching moves
            if (self.hasEffect(a, 'iron_fist') && md.isPunch) {
                return { damageMult: 1.2 };
            }

            // type_boost_low_hp: Overgrow/Blaze/Torrent/Swarm
            if (a && a.currentHp < a.maxHp * 0.33) {
                var ab = self.getAbilityData(a, 'type_boost_low_hp');
                if (ab && ab.type === md.type) {
                    return { damageMult: ab.multiplier || 1.5 };
                }
            }

            // Mold Breaker check
            if (self.hasEffect(a, 'mold_breaker')) return null;
            return null;
        });

        // ======== onStatusCheck: status immunity ========
        self.registerHook('onStatusCheck', function(ctx) {
            if (!ctx.defender || !ctx.status) return null;
            if (self.hasEffect(ctx.defender, 'status_immunity', ctx.status)) {
                return { blocked: true, msg: ctx.defender.name + ' es inmune!' };
            }
            return null;
        });

        // ======== onCritCheck: crit modifiers ========
        self.registerHook('onCritCheck', function(ctx) {
            if (!ctx.defender) return null;
            if (self.hasEffect(ctx.defender, 'shell_armor') || self.hasEffect(ctx.defender, 'battle_armor')) {
                return { preventCrit: true };
            }
            if (ctx.attacker && self.hasEffect(ctx.attacker, 'sniper')) {
                return { critMult: 2.25 };
            }
            return null;
        });

        // ======== onWeather: weather-related effects ========
        self.registerHook('onWeather', function(ctx) {
            if (!ctx.pokemon) return null;
            if (self.hasEffect(ctx.pokemon, 'overcoat')) return { immune: true };
            if (self.hasEffect(ctx.pokemon, 'solarpower') && ctx.weather === 'sun') {
                return { spAtkBoost: 1.5, hpLoss: Math.floor(ctx.pokemon.maxHp / 8) };
            }
            if (self.hasEffect(ctx.pokemon, 'raindish') && ctx.weather === 'rain') {
                return { healPct: 0.0625 };
            }
            if (self.hasEffect(ctx.pokemon, 'dryskin') && ctx.weather === 'rain') {
                return { healPct: 0.0625 };
            }
            if (self.hasEffect(ctx.pokemon, 'sandrush') && ctx.weather === 'sandstorm') {
                return { spDefBoost: 1.5 };
            }
            return null;
        });

        // ======== onAccuracy: accuracy/evasion modifiers ========
        self.registerHook('onAccuracy', function(ctx) {
            if (!ctx.attacker || !ctx.defender) return null;
            // No Guard: always hit
            if (self.hasEffect(ctx.attacker, 'noguard') || self.hasEffect(ctx.defender, 'noguard')) {
                return { alwaysHit: true };
            }
            // Compound Eyes: boost accuracy 1.3x
            if (self.hasEffect(ctx.attacker, 'compoundeyes')) {
                return { accuracyMult: 1.3 };
            }
            // Hustle: physical moves accuracy 0.8x
            if (self.hasEffect(ctx.attacker, 'hustle') && ctx.moveData && ctx.moveData.category === 'physical') {
                return { accuracyMult: 0.8 };
            }
            // Sand Veil / Snow Cloak: evasion 1.25x in weather
            if (PMZ.Weather && PMZ.Weather.is) {
                if (self.hasEffect(ctx.defender, 'sandveil') && PMZ.Weather.is('sandstorm')) return { evasionMult: 1.25 };
                if (self.hasEffect(ctx.defender, 'snowcloak') && PMZ.Weather.is('hail')) return { evasionMult: 1.25 };
            }
            return null;
        });

        // ======== onEntry: entry abilities ========
        self.registerHook('onEntry', function(ctx) {
            if (!ctx.attacker || !ctx.defender) return null;
            // Intimidate: lower opponent Attack by 1
            if (self.hasEffect(ctx.attacker, 'intimidate') && !PMZ.Pokemon.isFainted(ctx.defender)) {
                var ch = PMZ.Battle.boostStat(ctx.defender, 'attack', -1);
                if (ch < 0) return { msg: 'Intimidate de ' + ctx.attacker.name + ' baja el Ataque!' };
            }
            return null;
        });

        // ======== onContact: contact abilities ========
        self.registerHook('onContact', function(ctx) {
            if (!ctx.defender || !ctx.attacker) return null;
            if (PMZ.Pokemon.isFainted(ctx.attacker)) return null;
            // Static: 30% paralyze
            if (self.hasEffect(ctx.defender, 'contact_paralyze') && r() < 0.3) {
                if (PMZ.Status.apply(ctx.attacker, 'paralyze')) return { msg: ctx.attacker.name + ' se paralizo por Static!' };
            }
            // Flame Body: 30% burn
            if (self.hasEffect(ctx.defender, 'contact_burn') && r() < 0.3) {
                if (PMZ.Status.apply(ctx.attacker, 'burn')) return { msg: ctx.attacker.name + ' se quemo!' };
            }
            // Poison Point: 30% poison
            if (self.hasEffect(ctx.defender, 'contact_poison') && r() < 0.3) {
                if (PMZ.Status.apply(ctx.attacker, 'poison')) return { msg: ctx.attacker.name + ' fue envenenado!' };
            }
            // Rough Skin / Iron Barbs: damage 12.5% of max HP
            if (self.hasEffect(ctx.defender, 'roughskin')) {
                var rd = Math.max(1, Math.floor(ctx.attacker.maxHp * 0.125));
                ctx.attacker.currentHp = Math.max(1, ctx.attacker.currentHp - rd);
                return { msg: ctx.attacker.name + ' recibe dano por Rough Skin!' };
            }
            return null;
        });

        // ======== onTurnEnd: end-of-turn effects ========
        self.registerHook('onTurnEnd', function(ctx) {
            if (!ctx.pokemon || PMZ.Pokemon.isFainted(ctx.pokemon)) return null;
            // Shed Skin: 30% cure status
            if (self.hasEffect(ctx.pokemon, 'shedskin') && ctx.pokemon.status && r() < 0.3) {
                ctx.pokemon.status = null;
                return { msg: ctx.pokemon.name + ' se curo por Mudar Piel!' };
            }
            // Speed Boost: +1 Speed
            if (self.hasEffect(ctx.pokemon, 'speedboost')) {
                PMZ.Battle.boostStat(ctx.pokemon, 'speed', 1);
                return { msg: ctx.pokemon.name + ' aumento su Velocidad!' };
            }
            // Rain Dish / Dry Skin: heal in rain
            if (PMZ.Weather && PMZ.Weather.is && PMZ.Weather.is('rain')) {
                if (self.hasEffect(ctx.pokemon, 'raindish') || self.hasEffect(ctx.pokemon, 'dryskin')) {
                    ctx.pokemon.currentHp = Math.min(ctx.pokemon.maxHp, ctx.pokemon.currentHp + Math.floor(ctx.pokemon.maxHp / 16));
                    return { msg: ctx.pokemon.name + ' recupero PS por la lluvia!' };
                }
            }
            return null;
        });

        // ======== onSecondaryEffect: secondary effect modifiers ========
        self.registerHook('onSecondaryEffect', function(ctx) {
            if (!ctx.defender) return null;
            // Shield Dust: block secondary effects
            if (self.hasEffect(ctx.defender, 'shielddust')) return { blocked: true };
            // Serene Grace: double chance
            if (ctx.attacker && self.hasEffect(ctx.attacker, 'serenegrace')) return { chanceMult: 2.0 };
            return null;
        });

        // ======== onPreventFlinch: flinch immunity ========
        self.registerHook('onPreventFlinch', function(ctx) {
            if (!ctx.defender) return null;
            if (self.hasEffect(ctx.defender, 'innerfocus') || self.hasEffect(ctx.defender, 'steadfast')) {
                return { preventFlinch: true };
            }
            return null;
        });

        // ======== onOverride: special overrides ========
        self.registerHook('onOverride', function(ctx) {
            if (!ctx.attacker) return null;
            // Mold Breaker: ignore defender abilities
            if (self.hasEffect(ctx.attacker, 'moldbreaker')) return { ignoreDefAbilities: true };
            // Skill Link: handled in multi_hit effect
            return null;
        });
    }
};

PMZ.Abilities.initHooks();
PMZ.AI = {
    chooseMove: function(attacker, defender, availMoves) {
        if (!attacker || !attacker.moves || attacker.moves.length === 0) return null;
        var moves = availMoves || attacker.moves.filter(function(m) { return m.pp > 0; });
        if (moves.length === 0) return null;

        var scored = moves.map(function(move) {
            var score = 0;
            var md = PMZ.Data.move(move.key);
            if (!md) return { move: move, score: -999 };

            // Power score
            score += (md.power || 0) * 0.5;

            // STAB
            if (attacker.types.indexOf(md.type) >= 0) score += 15;

            // Type effectiveness
            var eff = PMZ.Battle.typeEffectiveness(md.type, defender.types);
            if (eff > 1) score += 25;
            else if (eff === 0) score -= 50;
            else if (eff < 1) score -= 10;

            // Status moves
            if (md.category === 'status') {
                if (md.effect === 'sleep' || md.effect === 'paralyze' || md.effect === 'poison' ||
                    md.effect === 'burn' || md.effect === 'confuse' || md.effect === 'freeze') {
                    if (!defender.status) score += 20;
                    else score -= 10;
                }
                if (md.effect === 'raise_attack_2' || md.effect === 'raise_defense_2' ||
                    md.effect === 'lower_defense' || md.effect === 'lower_attack') {
                    score += 10;
                }
            }

            // Accuracy
            score += (md.accuracy || 100) * 0.2;

            // Win percentage (prefer finishing move if defender is low HP)
            if (defender.currentHp > 0 && (md.power || 0) > 0) {
                var estDmg = PMZ.Battle.calcDamage(attacker, defender, md);
                if (estDmg >= defender.currentHp) score += 40;
            }

            return { move: move, score: score, moveData: md };
        });

        // Add randomness so AI isn't perfectly predictable
        scored.forEach(function(s) { s.score += Math.random() * 10; });

        // Sort by score descending
        scored.sort(function(a, b) { return b.score - a.score; });
        var best = scored[0];
        return best ? best.move : null;
    },

    shouldSwitch: function(attacker, defender, trainerParty) {
        // If current Pokémon is at a big type disadvantage, consider switching
        if (!attacker || !defender) return false;
        if (!trainerParty || trainerParty.length <= 1) return false;

        // Check if current Pokémon is fainted or very low HP
        if (attacker.currentHp <= 0 || attacker.currentHp < attacker.maxHp * 0.3) {
            return true;
        }

        return false;
    },

    chooseSwitch: function(current, defender, trainerParty) {
        if (!trainerParty || trainerParty.length === 0) return null;
        var best = null;
        var bestScore = -999;

        for (var i = 0; i < trainerParty.length; i++) {
            var p = trainerParty[i];
            if (p.currentHp <= 0 || p === current) continue;

            var score = 0;
            // Check type advantage against defender
            var bestMove = this.chooseMove(p, defender);
            if (bestMove) {
                var md = PMZ.Data.move(bestMove.key);
                if (md) {
                    var eff = PMZ.Battle.typeEffectiveness(md.type, defender.types);
                    if (eff > 1) score += 30;
                    if (eff === 0) score -= 30;
                }
            }
            score += p.level * 2;
            score += p.currentHp / p.maxHp * 20;

            if (score > bestScore) {
                bestScore = score;
                best = p;
            }
        }
        return best;
    }
};

// ============================================================================
// DataManager hooks - Save/Load
// ============================================================================
(function() {
    var aliasCreate = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        aliasCreate.call(this);
        $gamePMZ = new Game_PMZ();
    };
    
    var aliasMake = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        var contents = aliasMake.call(this);
        contents.pmz = $gamePMZ;
        return contents;
    };
    
    var aliasExtract = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        aliasExtract.call(this, contents);
        $gamePMZ = contents.pmz || new Game_PMZ();
    };
})();

// ============================================================================
// PMZ.Pokemon - Creacion y gestion de Pokemon
// ============================================================================
PMZ.Pokemon = {
    create: function(speciesKey, level) {
        if (!PMZ.Data.pokemon(speciesKey)) return null;
        return new Game_Pokemon(speciesKey, level);
    },
    generateIVs: function() { return Game_Pokemon.prototype.generateIVs(); },
    randomNature: function() { return Game_Pokemon.prototype.randomNature(); },
    natureModifier: function(nature, stat) { return Game_Pokemon.natureModifier(nature, stat); },
    natureUpDown: function(nature) { return Game_Pokemon.natureUpDown(nature); },
    getGender: function(species) { return Game_Pokemon.getGender(species); },
    moveLimit: function() { return Game_Pokemon.moveLimit(); },
    calcExp: function(level, rate) { return Game_Pokemon.prototype.calcExp(level, rate); },
    calculateStats: function(p, base) { if (p) p.calculateStats(base); },
    assignMoves: function(p, base) { if (p) p.assignMoves(base); },
    heal: function(p) { if (p) p.heal(); },
    isFainted: function(p) { return p ? p.isFainted() : true; },
    gainEVs: function(p, defeatedSpecies) { if (p) p.gainEVs(defeatedSpecies); },
    gainExp: function(p, amount) { return p ? p.gainExp(amount) : { leveled: false, evolved: false, newMoves: [], pendingMoves: [] }; },
    learnNewMoves: function(p, base) { return p ? p.learnNewMoves(base) : { learned: [], pending: [] }; },
    replaceMove: function(p, index, newMove) { return p ? p.replaceMove(index, newMove) : false; },
    canLearn: function(p, moveKey) { return p ? p.canLearn(moveKey) : false; },
    teachMove: function(p, moveKey) { return p ? p.teachMove(moveKey) : { success: false, msg: 'Invalid' }; },
    _pushMove: function(p, moveKey, moveData) { if (p) p._pushMove(moveKey, moveData); },
};

// ============================================================================
// PMZ.Party - Equipo
// ============================================================================
PMZ.Party = {
    add: function(p) {
        var max = PMZ.Data.configValue('maxPartySize') || 6;
        if ($gamePMZ.party().length >= max) return false;
        $gamePMZ.party().push(p);
        return true;
    },
    remove: function(i) {
        if (i < 0 || i >= $gamePMZ.party().length) return null;
        return $gamePMZ.party().splice(i, 1)[0];
    },
    get: function(i) { return $gamePMZ.party()[i]; },
    all: function() { return $gamePMZ.party(); },
    count: function() { return $gamePMZ.party().length; },
    isFull: function() {
        var max = PMZ.Data.configValue('maxPartySize') || 6;
        return $gamePMZ.party().length >= max;
    },
    healAll: function() {
        $gamePMZ.party().forEach(function(p) { PMZ.Pokemon.heal(p); });
    },
    firstAlive: function() {
        var party = $gamePMZ.party();
        for (var i = 0; i < party.length; i++) {
            if (party[i].currentHp > 0) return party[i];
        }
        return null;
    },
    firstAliveIndex: function() {
        var party = $gamePMZ.party();
        for (var i = 0; i < party.length; i++) {
            if (party[i].currentHp > 0) return i;
        }
        return -1;
    },
    allFainted: function() {
        var party = $gamePMZ.party();
        for (var i = 0; i < party.length; i++) {
            if (party[i].currentHp > 0) return false;
        }
        return true;
    }
};

// ============================================================================
// PMZ.PC - Banco / Cajas
// ============================================================================
PMZ.PC = {
    deposit: function(p) {
        var max = PMZ.Data.configValue('maxBoxPokemon') || 30;
        var boxes = $gamePMZ.boxes();
        for (var i = 0; i < boxes.length; i++) {
            if (boxes[i].pokemon.length < max) {
                boxes[i].pokemon.push(p);
                return true;
            }
        }
        return false;
    },
    withdraw: function(boxIdx, slotIdx) {
        var boxes = $gamePMZ.boxes();
        if (!boxes[boxIdx] || slotIdx >= boxes[boxIdx].pokemon.length) return null;
        return boxes[boxIdx].pokemon.splice(slotIdx, 1)[0];
    },
    box: function(i) { return $gamePMZ.boxes()[i] || null; },
    allBoxes: function() { return $gamePMZ.boxes(); },
    renameBox: function(i, name) {
        if ($gamePMZ.boxes()[i]) $gamePMZ.boxes()[i].name = name;
    }
};

// ============================================================================
// PMZ.Items - Bolsa / Inventario
// ============================================================================
PMZ.Items = {
    add: function(key, amount) {
        amount = amount || 1;
        key = key.toLowerCase();
        var bag = $gamePMZ.itemBag();
        bag[key] = (bag[key] || 0) + amount;
        return true;
    },
    remove: function(key, amount) {
        amount = amount || 1;
        key = key.toLowerCase();
        var bag = $gamePMZ.itemBag();
        if (!bag[key] || bag[key] < amount) return false;
        bag[key] -= amount;
        if (bag[key] <= 0) delete bag[key];
        return true;
    },
    has: function(key, amount) {
        amount = amount || 1;
        key = key.toLowerCase();
        return ($gamePMZ.itemBag()[key] || 0) >= amount;
    },
    count: function(key) {
        key = key.toLowerCase();
        return $gamePMZ.itemBag()[key] || 0;
    },
    all: function() { return $gamePMZ.itemBag(); },
    
    useItem: function(key, target) {
        var itemData = PMZ.Data.item(key);
        if (!itemData) return { success: false, msg: 'Item not found' };
        if (target && PMZ.Pokemon.isFainted(target) && itemData.effect !== 'revive') {
            return { success: false, msg: 'Cannot use on fainted Pokemon' };
        }
        if (itemData.type === 'medicine') {
            if (!target) return { success: false, msg: 'Select a Pokemon' };
            if (itemData.effect === 'heal') {
                if (target.currentHp >= target.maxHp) return { success: false, msg: 'HP is already full' };
                var healAmt = itemData.power === 'full' ? target.maxHp : itemData.power;
                target.currentHp = Math.min(target.maxHp, target.currentHp + healAmt);
                PMZ.Items.remove(key);
                return { success: true, msg: 'Used ' + itemData.name };
            }
            if (itemData.effect === 'full_heal') {
                target.currentHp = target.maxHp;
                target.status = null;
                PMZ.Items.remove(key);
                return { success: true, msg: 'Fully restored ' + target.name };
            }
            if (itemData.effect === 'cure_status') {
                if (!target.status || target.status !== itemData.status) return { success: false, msg: 'No effect' };
                target.status = null;
                PMZ.Items.remove(key);
                return { success: true, msg: 'Cured ' + target.name };
            }
            if (itemData.effect === 'cure_all_status') {
                if (!target.status) return { success: false, msg: 'No status to cure' };
                target.status = null;
                PMZ.Items.remove(key);
                return { success: true, msg: 'Cured ' + target.name };
            }
            if (itemData.effect === 'revive') {
                if (!PMZ.Pokemon.isFainted(target)) return { success: false, msg: 'Not fainted' };
                var halfHp = Math.floor(target.maxHp / 2);
                target.currentHp = itemData.power === 'full' ? target.maxHp : halfHp;
                if (target.currentHp <= 0) target.currentHp = 1;
                PMZ.Items.remove(key);
                return { success: true, msg: 'Revived ' + target.name };
            }
            if (itemData.effect === 'restore_pp' || itemData.effect === 'restore_all_pp') {
                var restored = false;
                for (var j = 0; j < target.moves.length; j++) {
                    var m = target.moves[j];
                    var amount = itemData.power === 'full' ? m.maxPp : (itemData.power || 10);
                    if (m.pp < m.maxPp) {
                        m.pp = Math.min(m.maxPp, m.pp + amount);
                        restored = true;
                    }
                    if (itemData.effect === 'restore_pp' && restored) break;
                }
                if (!restored) return { success: false, msg: 'PP already full' };
                PMZ.Items.remove(key);
                return { success: true, msg: 'Restored PP' };
            }
            return { success: false, msg: 'Cannot use that item' };
        }
        if (itemData.type === 'evolution') {
            if (!target) return { success: false, msg: 'Select a Pokemon' };
            var evo = PMZ.Evolution.checkStone(target, key);
            if (evo) {
                PMZ.Evolution.evolve(target, evo);
                PMZ.Items.remove(key);
                return { success: true, msg: target.name + ' evolved!', evolved: true };
            }
            return { success: false, msg: 'Wont have any effect' };
        }
        if (itemData.type === 'field') {
            if (itemData.effect === 'repel') {
                PMZ.Items.remove(key);
                return { success: true, msg: 'Used ' + itemData.name, repel: itemData.steps || 100 };
            }
            if (itemData.effect === 'escape') {
                PMZ.Items.remove(key);
                return { success: true, msg: 'Used Escape Rope', escape: true };
            }
            return { success: false, msg: 'Cannot use that here' };
        }
        if (itemData.effect === 'fish') {
            return { success: true, msg: 'Casting ' + itemData.name + '...', fish: itemData.rodTier || 'old' };
        }
        if (itemData.type === 'tm' || itemData.type === 'hm') {
            if (!target) return { success: false, msg: 'Select a Pokemon' };
            if (!itemData.move) return { success: false, msg: 'TM corrupted' };
            var moveData = PMZ.Data.move(itemData.move);
            if (!moveData) return { success: false, msg: 'Move not found' };
            if (!PMZ.Pokemon.canLearn(target, itemData.move)) {
                return { success: false, msg: target.name + ' no puede aprender ' + moveData.name };
            }
            var limit = PMZ.Pokemon.moveLimit();
            if (target.moves.length < limit) {
                PMZ.Pokemon._pushMove(target, itemData.move, moveData);
                PMZ.Items.remove(key);
                if (itemData.type === 'tm') {
                    return { success: true, learned: true, msg: target.name + ' aprendio ' + moveData.name + '! (TM consumido)' };
                } else {
                    return { success: true, learned: true, msg: target.name + ' aprendio ' + moveData.name + '!' };
                }
            }
            // Party full: open MoveLearn scene. TM is consumed only if learned.
            $gameTemp._pmzMoveLearn = { pokemon: target, newMove: itemData.move, tmKey: key };
            return { success: true, learned: false, needReplace: true, msg: target.name + ' debe olvidar un movimiento para aprender ' + moveData.name };
        }
        return { success: false, msg: 'Cannot use that item' };
    }
};

// ============================================================================
// PMZ.HoldItems - Objetos equipables
// ============================================================================
PMZ.HoldItems = {
    maxSlots: function() {
        var cfg = PMZ.Data.config();
        return cfg ? (cfg.equipSlots || 1) : 1;
    },
    canEquip: function(pokemon) {
        var held = pokemon.heldItems || [];
        return held.length < this.maxSlots();
    },
    equip: function(pokemon, itemKey) {
        var held = pokemon.heldItems || [];
        if (held.length >= this.maxSlots()) return false;
        var data = PMZ.Data.item(itemKey);
        if (!data || (data.type !== 'hold' && data.type !== 'megastone')) return false;
        if (held.indexOf(itemKey) >= 0) return false;
        held.push(itemKey);
        pokemon.heldItems = held;
        PMZ.Items.remove(itemKey);
        return true;
    },
    unequip: function(pokemon, itemKey) {
        var held = pokemon.heldItems || [];
        var idx = held.indexOf(itemKey);
        if (idx < 0) return false;
        held.splice(idx, 1);
        pokemon.heldItems = held;
        PMZ.Items.add(itemKey);
        return true;
    },
    hasItem: function(pokemon, itemKey) {
        var held = pokemon.heldItems || [];
        return held.indexOf(itemKey) >= 0;
    },
    heldItems: function(pokemon) {
        return pokemon.heldItems || [];
    },
    getItemData: function(itemKey) {
        return PMZ.Data.item(itemKey);
    },
    // Apply held item effects to damage calculation
    // Data-driven: lee `stat`, `category`, `type`, `multiplier`, `damageMult` de items.json
    modifyAttack: function(attacker, defender, moveData, damage) {
        var items = this.heldItems(attacker);
        for (var i = 0; i < items.length; i++) {
            var data = this.getItemData(items[i]);
            if (!data) continue;
            // Choice items (band/specs): boost damage when stat matches category
            if (data.effect === 'choice' && data.multiplier) {
                if ((data.stat === 'attack' && moveData.category === 'physical') ||
                    (data.stat === 'spAttack' && moveData.category === 'special')) {
                    damage = Math.floor(damage * data.multiplier);
                }
            }
            // Type-boost items (Charcoal, Mystic Water, etc.): boost if move.type matches
            if (data.effect === 'type_boost' && data.type === moveData.type && data.multiplier) {
                damage = Math.floor(damage * data.multiplier);
            }
            // Life Orb: flat damage multiplier
            if (data.effect === 'life_orb' && data.damageMult) {
                damage = Math.floor(damage * data.damageMult);
            }
        }
        return damage;
    },
    // Apply held item recoil/penalty after attacking
    afterAttack: function(attacker) {
        var items = this.heldItems(attacker);
        for (var i = 0; i < items.length; i++) {
            var data = this.getItemData(items[i]);
            if (!data) continue;
            if (data.effect === 'life_orb' && data.recoil) {
                var recoil = Math.max(1, Math.floor(attacker.maxHp * data.recoil));
                attacker.currentHp = Math.max(0, attacker.currentHp - recoil);
            }
        }
    },
    // Get held item speed multiplier (e.g., Choice Scarf)
    speedMultiplier: function(pokemon) {
        var items = this.heldItems(pokemon);
        for (var i = 0; i < items.length; i++) {
            var data = this.getItemData(items[i]);
            if (data && data.stat === 'speed' && data.effect === 'choice' && data.multiplier) {
                return data.multiplier;
            }
        }
        return 1;
    },
    // Apply held item effects at end of turn
    endOfTurn: function(pokemon) {
        var items = this.heldItems(pokemon);
        var consumed = [];
        for (var i = 0; i < items.length; i++) {
            var data = this.getItemData(items[i]);
            if (!data) continue;
            if (data.effect === 'leftovers' && pokemon.currentHp > 0 && pokemon.currentHp < pokemon.maxHp) {
                var heal = Math.max(1, Math.floor(pokemon.maxHp / 16));
                pokemon.currentHp = Math.min(pokemon.maxHp, pokemon.currentHp + heal);
            }
            if (data.effect === 'berry') {
                if (PMZ.Berries.apply(pokemon, items[i])) consumed.push(items[i]);
            }
        }
        for (var j = 0; j < consumed.length; j++) {
            var idx = pokemon.heldItems.indexOf(consumed[j]);
            if (idx >= 0) pokemon.heldItems.splice(idx, 1);
        }
        return consumed;
    },

    // Focus Band: chance to survive a KO hit with 1 HP
    // Returns true if item saved the pokemon (caller must NOT register KO)
    surviveKO: function(pokemon) {
        if (!pokemon || pokemon.currentHp > 0) return false;
        var items = this.heldItems(pokemon);
        for (var i = 0; i < items.length; i++) {
            var data = this.getItemData(items[i]);
            if (data && data.effect === 'focus_band') {
                var ch = data.chance || 0.1;
                if (Math.random() < ch) {
                    pokemon.currentHp = 1;
                    return true;
                }
            }
        }
        return false;
    },

    // King's Rock / Razor Fang: chance to flinch the target on hit
    // Returns true if the target should flinch this turn
    tryFlinchOnHit: function(attacker) {
        if (!attacker) return false;
        var items = this.heldItems(attacker);
        for (var i = 0; i < items.length; i++) {
            var data = this.getItemData(items[i]);
            if (data && data.effect === 'kings_rock' && data.flinchChance) {
                if (Math.random() < data.flinchChance) return true;
            }
        }
        return false;
    },

    // Bright Powder: multiplicative evasion boost (e.g. 1.1 = +10% evasion)
    evasionMultiplier: function(pokemon) {
        if (!pokemon) return 1;
        var items = this.heldItems(pokemon);
        for (var i = 0; i < items.length; i++) {
            var data = this.getItemData(items[i]);
            if (data && data.effect === 'bright_powder' && data.evasionMult) {
                return data.evasionMult;
            }
        }
        return 1;
    }
};

// ============================================================================
// PMZ.Berries - Sistema de bayas (lee de items.json)
// ============================================================================
// Cada baya se define 100% en items.json con type="hold" y effect="berry".
// Campos JSON leídos:
//   berryCure:        "paralyze" | "sleep" | "poison" | "burn" | "freeze" | "confusion" | "all"
//   berryHeal:        número fijo de PS a restaurar (Oran, Sitrus, etc.)
//   berryHealPercent: porcentaje de maxHp a restaurar (e.g. 0.25 para Sitrus)
//   berryHealPp:      PP a restaurar (Leppa)
//   berryThreshold:   % de HP por debajo del cual se activa (default 0.5)
//   berryConfuses:    true → aplica confusion tras curar (Figy, Wiki, etc.)
// El campo interno _legacyData se mantiene solo como fallback para berries
// definidas en JS que aún no se han migrado a items.json.
// ============================================================================
PMZ.Berries = {
    _legacyData: {
        leppa:  { berryHealPp: 10 },
        figy:   { berryHealPercent: 0.125, berryThreshold: 0.25, berryConfuses: true },
        wiki:   { berryHealPercent: 0.125, berryThreshold: 0.25, berryConfuses: true },
        mago:   { berryHealPercent: 0.125, berryThreshold: 0.25, berryConfuses: true },
        aguav:  { berryHealPercent: 0.125, berryThreshold: 0.25, berryConfuses: true },
        iapapa: { berryHealPercent: 0.125, berryThreshold: 0.25, berryConfuses: true }
    },

    apply: function(pokemon, berryKey) {
        if (!berryKey) return false;
        // Read from items.json first (data-driven path)
        var itemData = PMZ.Data.item(berryKey);
        var cfg = null;
        if (itemData && itemData.effect === 'berry') {
            cfg = {
                berryCure:        itemData.berryCure || null,
                berryHeal:        itemData.berryHeal || 0,
                berryHealPercent: itemData.berryHealPercent || 0,
                berryHealPp:      itemData.berryHealPp || 0,
                berryThreshold:   itemData.berryThreshold || 0.5,
                berryConfuses:    !!itemData.berryConfuses
            };
        } else {
            // Fallback: legacy JS data (e.g. leppa, figy, wiki, mago, aguav, iapapa)
            var lookupKey = berryKey.replace(/berry$/, '');
            if (this._legacyData[lookupKey]) cfg = this._legacyData[lookupKey];
        }
        if (!cfg) return false;

        var ate = false;

        // Status cure branch
        if (cfg.berryCure) {
            if (cfg.berryCure === 'all' && pokemon.status) {
                pokemon.status = null; ate = true;
            } else if (pokemon.status === cfg.berryCure) {
                pokemon.status = null; ate = true;
            }
        }

        // HP heal branch (fixed or percent)
        if (cfg.berryHeal > 0 || cfg.berryHealPercent > 0) {
            var threshold = cfg.berryThreshold || 0.5;
            if (pokemon.currentHp > 0 && pokemon.currentHp < pokemon.maxHp * threshold) {
                var heal = cfg.berryHealPercent > 0
                    ? Math.floor(pokemon.maxHp * cfg.berryHealPercent)
                    : cfg.berryHeal;
                pokemon.currentHp = Math.min(pokemon.maxHp, pokemon.currentHp + heal);
                ate = true;
                if (cfg.berryConfuses) PMZ.Status.apply(pokemon, 'confusion');
            }
        }

        // PP heal branch
        if (cfg.berryHealPp > 0 && pokemon.moves) {
            for (var i = 0; i < pokemon.moves.length; i++) {
                if (pokemon.moves[i].pp < pokemon.moves[i].maxPp) {
                    pokemon.moves[i].pp = Math.min(pokemon.moves[i].maxPp, pokemon.moves[i].pp + cfg.berryHealPp);
                    ate = true;
                    break;
                }
            }
        }
        return ate;
    },

    consume: function(pokemon, berryKey) {
        if (!pokemon.heldItems) return;
        var idx = pokemon.heldItems.indexOf(berryKey);
        if (idx >= 0) pokemon.heldItems.splice(idx, 1);
    }
};

// ============================================================================
// genderRatio en pokemon.json: % macho (0=100% hembra, 100=100% macho, null=sin género)
// ============================================================================

PMZ.Pokemon.getGender = function(species) { return Game_Pokemon.getGender(species); };

// ============================================================================
// PMZ.Evolution - Sistema de evolucion
// ============================================================================
PMZ.Evolution = {
    checkLevel: function(p) {
        var base = PMZ.Data.pokemon(p.species);
        if (!base || !base.evolutions) return null;
        for (var i = 0; i < base.evolutions.length; i++) {
            var evo = base.evolutions[i];
            if (evo.level && p.level >= evo.level) {
                // Check for a move precondition
                if (evo.move && !this._knowsMove(p, evo.move)) continue;
                // Check for time precondition
                if (evo.time && !this._checkTimeCondition(evo.time)) continue;
                // Check for location precondition (trigger: specific map displayName or terrainTag)
                if (evo.location && !this._checkLocation(evo.location)) continue;
                // Check for gender precondition
                if (evo.gender && p.gender !== evo.gender) continue;
                return evo;
            }
        }
        return null;
    },
    checkStone: function(p, itemKey) {
        var base = PMZ.Data.pokemon(p.species);
        if (!base || !base.evolutions) return null;
        for (var i = 0; i < base.evolutions.length; i++) {
            var evo = base.evolutions[i];
            if (evo.item === itemKey) return evo;
        }
        return null;
    },
    checkTrade: function(p, heldItem) {
        var base = PMZ.Data.pokemon(p.species);
        if (!base || !base.evolutions) return null;
        for (var i = 0; i < base.evolutions.length; i++) {
            var evo = base.evolutions[i];
            if (!evo.trade) continue;
            if (evo.tradeItem && heldItem !== evo.tradeItem) continue;
            return evo;
        }
        return null;
    },
    checkHappiness: function(p) {
        var base = PMZ.Data.pokemon(p.species);
        if (!base || !base.evolutions) return null;
        for (var i = 0; i < base.evolutions.length; i++) {
            var evo = base.evolutions[i];
            if (evo.happiness && (p.happiness || 0) >= (evo.happinessValue || 220)) {
                if (evo.time && !this._checkTimeCondition(evo.time)) continue;
                if (evo.move && !this._knowsMove(p, evo.move)) continue;
                return evo;
            }
        }
        return null;
    },
    checkItem: function(p) {
        // Evolution by leveling up while holding a specific item
        // Check all held item slots, not just [0]
        if (!p.heldItems || p.heldItems.length === 0) return null;
        var base = PMZ.Data.pokemon(p.species);
        if (!base || !base.evolutions) return null;
        for (var i = 0; i < base.evolutions.length; i++) {
            var evo = base.evolutions[i];
            if (evo.holdItem && p.heldItems.indexOf(evo.holdItem) >= 0) {
                if (evo.time && !this._checkTimeCondition(evo.time)) continue;
                return evo;
            }
        }
        return null;
    },
    checkBeauty: function(p) {
        var base = PMZ.Data.pokemon(p.species);
        if (!base || !base.evolutions) return null;
        for (var i = 0; i < base.evolutions.length; i++) {
            var evo = base.evolutions[i];
            if (evo.beauty && (p.beauty || 0) >= (evo.beautyValue || 170)) return evo;
        }
        return null;
    },
    // Run all checks when a pokemon levels up
    checkStats: function(p) {
        // Stat-based evolution mode: pokemon evolves when its stats
        // reach the midpoint between current species and evolution
        var base = PMZ.Data.pokemon(p.species);
        if (!base || !base.evolutions) return null;
        var statNames = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];
        for (var i = 0; i < base.evolutions.length; i++) {
            var evo = base.evolutions[i];
            if (evo.level) continue; // skip level-based evos in stat mode
            var evoBase = PMZ.Data.pokemon(evo.to);
            if (!evoBase) continue;
            var allMet = true;
            for (var s = 0; s < statNames.length; s++) {
                var st = statNames[s];
                var curBase = base.baseStats[st] || 50;
                var evoBaseStat = evoBase.baseStats[st] || 50;
                var midpoint = Math.floor((curBase + evoBaseStat) / 2);
                var pokemonStat = p[st] || 0;
                if (st === 'hp') pokemonStat = p.maxHp || 0;
                if (pokemonStat < midpoint) {
                    allMet = false;
                    break;
                }
            }
            if (allMet) return evo;
        }
        return null;
    },

    checkAll: function(p) {
        if (PMZ.Config.isStatEvolution()) {
            var evo = this.checkStats(p);
            if (evo) return evo;
        } else {
            var evo = this.checkLevel(p);
            if (evo) return evo;
        }
        evo = this.checkHappiness(p);
        if (evo) return evo;
        evo = this.checkItem(p);
        if (evo) return evo;
        evo = this.checkBeauty(p);
        if (evo) return evo;
        return null;
    },
    _knowsMove: function(p, moveName) {
        if (!p.moves) return false;
        for (var i = 0; i < p.moves.length; i++) {
            if (p.moves[i].name === moveName) return true;
        }
        return false;
    },
    _checkTimeCondition: function(time) {
        var hour = PMZ.Time ? PMZ.Time.getHour() : 12;
        var ranges = time.split('-');
        if (ranges.length === 2) {
            var start = parseInt(ranges[0]);
            var end = parseInt(ranges[1]);
            if (start <= end) return hour >= start && hour < end;
            return hour >= start || hour < end; // wraps around midnight
        }
        return true;
    },
    _checkLocation: function(location) {
        if (!$gameMap) return false;
        if (typeof location === 'string') {
            return $gameMap.displayName() === location;
        }
        if (typeof location === 'object') {
            // e.g., { terrainTag: n }
            var x = $gamePlayer.x;
            var y = $gamePlayer.y;
            if (location.terrainTag !== undefined) {
                return $gameMap.terrainTag(x, y) === location.terrainTag;
            }
            if (location.regionId !== undefined) {
                return $gameMap.regionId(x, y) === location.regionId;
            }
        }
        return false;
    },
    evolve: function(p, evoData) {
        var base = PMZ.Data.pokemon(evoData.to);
        if (!base) return null;
        p.species = evoData.to;
        p.name = base.name;
        p.types = base.types.slice();
        p.catchRate = base.catchRate || p.catchRate;
        p.id = base.id;
        PMZ.Pokemon.calculateStats(p, base);
        p.maxHp = p.hp;
        p.currentHp = Math.min(p.currentHp, p.maxHp);
        p.moves = [];
        PMZ.Pokemon.assignMoves(p, base);
        return p;
    }
};

// ============================================================================
// ============================================================================
// PMZ.Time - Ciclo dia/noche
// ============================================================================
PMZ.Time = {
    getHour: function() {
        if ($gameSystem && $gameSystem._pmzTimeHour !== undefined) {
            return $gameSystem._pmzTimeHour;
        }
        // Map frame count to time: 0 = 6am
        var frames = $gameSystem ? ($gameSystem._frameCount || Graphics.frameCount || 0) : 0;
        var totalMinutes = Math.floor(frames / 60 / 2); // 2 real seconds = 1 game minute
        var hour = (6 + Math.floor(totalMinutes / 60)) % 24;
        return hour;
    },
    getPeriod: function() {
        var h = this.getHour();
        if (h >= 5 && h < 10) return 'morning';
        if (h >= 10 && h < 17) return 'day';
        if (h >= 17 && h < 20) return 'evening';
        return 'night';
    },
    isNight: function() {
        var p = this.getPeriod();
        return p === 'night' || p === 'evening';
    },
    getTint: function() {
        switch (this.getPeriod()) {
            case 'morning': return { r: 180, g: 180, b: 180, gray: 0 };
            case 'day': return { r: 0, g: 0, b: 0, gray: 0 };
            case 'evening': return { r: 140, g: 80, b: 40, gray: 20 };
            case 'night': return { r: 40, g: 40, b: 120, gray: 60 };
        }
    },
    setHour: function(h) {
        if (!$gameSystem) return;
        $gameSystem._pmzTimeHour = h % 24;
    },
    resetToSystem: function() {
        if ($gameSystem) delete $gameSystem._pmzTimeHour;
    }
};

// ============================================================================
// PMZ.Weather - Clima en batalla
// ============================================================================
PMZ.Weather = {
    _weather: 'none',
    _duration: 0,
    
    get weather() { return this._weather; },
    get duration() { return this._duration; },
    
    set: function(w, dur) {
        this._weather = w;
        this._duration = dur || 5;
    },
    clear: function() {
        this._weather = 'none';
        this._duration = 0;
    },
    tick: function() {
        if (this._duration > 0) {
            this._duration--;
            if (this._duration <= 0) this._weather = 'none';
        }
    },
    getEffect: function() {
        switch (this._weather) {
            case 'rain': return {
                typeResist: { fire: 0.5, water: 1.5 },
                solarBeamFail: true,
                synthesisHeal: 0.25,
                thunderAcc: 1.3
            };
            case 'sun': return {
                typeResist: { fire: 1.5, water: 0.5 },
                solarBeamSkip: true,
                synthesisHeal: 0.667,
                thunderAcc: 0.5
            };
            case 'sandstorm': return {
                typeResist: { rock: 1.5, ground: 1.5 },
                endDamage: 1/16,
                rockSpDefBoost: true
            };
            case 'hail': return {
                endDamage: 1/16,
                iceDefBoost: true
            };
            default: return {};
        }
    },
    // Apply weather effects in the battle scene
    applyToBattleScene: function(scene) {
        var effect = this.getEffect();
        // scene.updateBackground is updated to show weather
        if (this._weather === 'rain') {
            scene._msgWindow.setText('¡Esta lloviendo!');
        } else if (this._weather === 'sun') {
            scene._msgWindow.setText('¡El sol brilla intensamente!');
        } else if (this._weather === 'sandstorm') {
            scene._msgWindow.setText('¡Hay una tormenta de arena!');
        } else if (this._weather === 'hail') {
            scene._msgWindow.setText('¡Esta granizando!');
        }
    }
};

// ============================================================================
// PMZ.Overworld - HM Surf integration with MZ vehicle system
// ============================================================================
// Uses the native MZ 'boat' vehicle exactly as configured in Database → System.
// No sprite overrides — whatever you set for "Bote" in the database is what shows.
// Tiles marked as boat-passable in the tileset (A3 water) are where surf works.
PMZ.Overworld = {
    _surfing: false,

    // Returns true if the player is currently standing on a water tile.
    // Detection uses multiple strategies in priority order, configurable
    // via `config.json > surfDetection`:
    //   "boat"       — uses $gameMap.isBoatPassable (tile flag 0x0200)
    //   "ship"       — uses $gameMap.isShipPassable (tile flag 0x0400)
    //   "terrain1"   — uses terrainTag === 1
    //   "terrain2"   — uses terrainTag === 2
    //   "boat_or_ship" — either flag
    //   "all"        — any of the above (most permissive)
    isOnWater: function() {
        if (!$gamePlayer || !$gameMap) return false;
        var direction = $gamePlayer.direction();
        var x = $gameMap.roundXWithDirection($gamePlayer.x, direction);
        var y = $gameMap.roundYWithDirection($gamePlayer.y, direction);
        var mode = (PMZ.Config && PMZ.Config.configValue)
            ? (PMZ.Config.configValue('surfDetection') || 'all')
            : 'all';
        return this._checkWater(x, y, mode);
    },

    // Returns true if the tile at (x, y) is water (per the chosen detection mode)
    isWaterAt: function(x, y, mode) {
        if (!$gameMap) return false;
        mode = mode || ((PMZ.Config && PMZ.Config.configValue)
            ? (PMZ.Config.configValue('surfDetection') || 'all')
            : 'all');
        return this._checkWater(x, y, mode);
    },

    // Internal: check water at (x, y) using given mode
    _checkWater: function(x, y, mode) {
        if (!$gameMap.isValid(x, y)) return false;
        switch (mode) {
            case 'boat':       return $gameMap.isBoatPassable(x, y);
            case 'ship':       return $gameMap.isShipPassable(x, y);
            case 'terrain1':   return $gameMap.terrainTag(x, y) === 1;
            case 'terrain2':   return $gameMap.terrainTag(x, y) === 2;
            case 'boat_or_ship': return $gameMap.isBoatPassable(x, y) || $gameMap.isShipPassable(x, y);
            case 'all':
            default:
                return $gameMap.isBoatPassable(x, y)
                    || $gameMap.isShipPassable(x, y)
                    || $gameMap.terrainTag(x, y) === 1
                    || $gameMap.terrainTag(x, y) === 2;
        }
    },

    // Returns true if the player has a non-fainted pokemon that knows 'surf'
    hasSurfPokemon: function() {
        if (!$gamePMZ) return false;
        var party = $gamePMZ.party();
        for (var i = 0; i < party.length; i++) {
            var p = party[i];
            if (!p || PMZ.Pokemon.isFainted(p)) continue;
            if (!p.moves) continue;
            for (var j = 0; j < p.moves.length; j++) {
                if (p.moves[j].name === 'surf' || p.moves[j].key === 'surf') return true;
            }
        }
        return false;
    },

    // Returns true if the player is currently surfing
    isSurfing: function() {
        return $gamePlayer && ($gamePlayer.isInBoat() || $gamePlayer.isInShip());
    },

    // Returns the name of the pokemon carrying the player (first with surf)
    getSurfPokemonName: function() {
        if (!$gamePMZ) return 'Pokemon';
        var party = $gamePMZ.party();
        for (var i = 0; i < party.length; i++) {
            var p = party[i];
            if (!p || PMZ.Pokemon.isFainted(p) || !p.moves) continue;
            for (var j = 0; j < p.moves.length; j++) {
                if (p.moves[j].name === 'surf' || p.moves[j].key === 'surf') {
                    return p.nickname || p.name;
                }
            }
        }
        return 'Pokemon';
    },

    // Try to start surfing. Uses native MZ vehicle mounting:
    //  - places the vehicle on the water tile in front of the player
    //  - calls getOnVehicle() which steps forward, hides player, shows vehicle
    // Returns true on success, false otherwise.
    startSurf: function() {
        if (this.isSurfing()) return true;
        if (!this.hasSurfPokemon()) {
            if ($gameMessage) $gameMessage.add('Ningun Pokemon puede usar Surf.');
            return false;
        }
        if (!this.isOnWater()) {
            if ($gameMessage) $gameMessage.add('Aqui no hay agua.');
            return false;
        }
        var d = $gamePlayer.direction();
        var x2 = $gameMap.roundXWithDirection($gamePlayer.x, d);
        var y2 = $gameMap.roundYWithDirection($gamePlayer.y, d);
        var vehicleType = (PMZ.Config && PMZ.Config.configValue)
            ? (PMZ.Config.configValue('surfVehicle') || 'boat')
            : 'boat';
        var vehicle = $gameMap.vehicle(vehicleType);
        if (!vehicle) {
            if ($gameMessage) $gameMessage.add('No se puede usar Surf aqui.');
            return false;
        }
        // Reload settings from System.json to ensure correct sprite
        vehicle.loadSystemSettings();
        // Apply speed boost
        var speed = (PMZ.Config && PMZ.Config.configValue)
            ? (PMZ.Config.configValue('surfSpeed') || 5)
            : 5;
        vehicle.setMoveSpeed(Math.min(6, Math.max(4, speed)));
        // Place the vehicle on the water tile and mount natively
        vehicle.setLocation($gameMap.mapId(), x2, y2);
        vehicle.refresh();
        if ($gamePlayer.getOnVehicle()) {
            this._surfing = true;
            if ($gameMessage) {
                $gameMessage.add(this.getSurfPokemonName() + ' usa Surf!');
            }
            return true;
        }
        return false;
    },

    // Exit surfing. Uses native MZ dismounting:
    //  - calls getOffVehicle() which steps forward, shows player, hides vehicle
    endSurf: function() {
        if (!this.isSurfing()) return false;
        if ($gamePlayer.getOffVehicle()) {
            this._surfing = false;
            if ($gameMessage) {
                $gameMessage.add(this.getSurfPokemonName() + ' dejo de surfear.');
            }
            return true;
        }
        return false;
    }
};

// Aliases for cuttable trees, etc. (placeholder for future HMs)
PMZ.Overworld.canCut = function() { return false; };
PMZ.Overworld.canStrength = function() { return false; };

// ============================================================================
// PMZ.Encounter - Encuentros salvajes
// ============================================================================
PMZ.Encounter = {
    inBattle: false,
    stepsSinceLast: 0,
    
    addStep: function() {
        if (this.inBattle) return null;
        this.stepsSinceLast++;
        
        try {
            var enc = PMZ.Data.encounter();
            var rate = enc ? (enc.settings.stepRate || 15) : 15;
            
            if ($gamePMZ && PMZ.Party.count() > 0 && Math.random() * 100 < rate) {
                console.log('[PMZ] Encounter rate passed, attempting rollWild...');
                this.stepsSinceLast = 0;
                return true;
            }
        } catch (e) {
            console.warn('[PMZ] Encounter step error:', e.message);
        }
        return false;
    },
    
    rollWild: function(forcedType) {
        this.inBattle = true;
        var data = this._getData(forcedType);
        
        if (!data || !data.pokemon || data.pokemon.length === 0) return null;
        
        var chosen = this._select(data.pokemon);
        if (!chosen) return null;
        
        var level = chosen.minLevel + Math.floor(Math.random() * (chosen.maxLevel - chosen.minLevel + 1));
        return PMZ.Pokemon.create(chosen.species, level);
    },
    
    _getData: function(forcedType) {
        var enc = PMZ.Data.encounter();
        if (!enc) return null;
        
        if (forcedType) {
            return enc.byType ? enc.byType[forcedType] : null;
        }
        
        // 1. Por nombre de mapa (displayName del editor)
        if ($gameMap && $gameMap.displayName) {
            var name = $gameMap.displayName();
            var byMap = enc.byMap || {};
            if (byMap[name] && byMap[name].pokemon && byMap[name].pokemon.length > 0) {
                return byMap[name];
            }
        }
        
        if (!$gamePlayer) return null;
        var x = $gamePlayer.x, y = $gamePlayer.y;
        
        var byType = enc.byType || {};
        
        // 2. Por Region ID (capa R del editor)
        var rid = $gameMap.regionId(x, y);
        if (rid > 0) {
            var rMap = enc.regionMap || {};
            var type = rMap[String(rid)];
            if (type) return byType[type] || null;
        }
        
        // 3. Por Terrain Tag (etiqueta T de tileset)
        var tag = $gameMap.terrainTag(x, y);
        if (tag > 0) {
            var tMap = enc.regionMap || {};
            var type2 = tMap[String(tag)];
            if (type2) return byType[type2] || null;
        }
        
        return null;
    },
    
    _select: function(list) {
        var total = 0;
        for (var i = 0; i < list.length; i++) total += list[i].rate;
        var r = Math.random() * total;
        for (var j = 0; j < list.length; j++) {
            r -= list[j].rate;
            if (r <= 0) return list[j];
        }
        return list[list.length - 1];
    },
    
    endBattle: function() {
        this.inBattle = false;
    },
    
    // Fishing encounter
    rollFish: function(rodTier) {
        this.inBattle = true;
        var enc = PMZ.Data.encounter();
        if (!enc) return null;
        var data = enc.byType ? enc.byType['water_fish'] : null;
        if (!data || !data.pokemon || data.pokemon.length === 0) return null;
        
        // Filter by rod tier
        var available = data.pokemon.filter(function(p) {
            if (rodTier === 'super') return true;
            if (rodTier === 'good') return (p.minLevel || 1) <= 25;
            // old rod: low level only
            return (p.minLevel || 1) <= 10;
        });
        if (available.length === 0) available = data.pokemon;
        
        var chosen = this._select(available);
        if (!chosen) return null;
        var level = chosen.minLevel + Math.floor(Math.random() * (chosen.maxLevel - chosen.minLevel + 1));
        return PMZ.Pokemon.create(chosen.species, level);
    }
};

// Fishing
PMZ.Fishing = {
    useRod: function(rodKey) {
        var itemData = PMZ.Data.item(rodKey);
        if (!itemData || itemData.effect !== 'fish') return { ok: false, msg: 'No es una caña de pescar!' };
        
        var tier = itemData.rodTier || 'old';
        var wild = PMZ.Encounter.rollFish(tier);
        if (!wild) {
            return { ok: false, msg: 'No hay peces aqui!' };
        }
        return { ok: true, pokemon: wild, msg: 'Un ' + wild.name + ' salvaje mordio el anzuelo!' };
    }
};

// ============================================================================
// PMZ.Badges - Sistema de medallas
// ============================================================================
PMZ.Badges = {
    list: function() {
        var data = PMZ.Data._cache.badges;
        return data && data.badges ? data.badges : [];
    },
    get: function(key) {
        var list = this.list();
        for (var i = 0; i < list.length; i++) {
            if (list[i].key === key) return list[i];
        }
        return null;
    },
    levelCap: function() {
        var caps = this.list().map(function(b) { return b.levelCap || 100; });
        caps.sort(function(a, b) { return a - b; });
        var count = $gamePMZ ? $gamePMZ.badgeCount() : 0;
        if (count <= 0) return Math.min(caps[0] || 20, 20);
        var index = Math.min(count - 1, caps.length - 1);
        return caps[index];
    },
    canUseHM: function(hmKey) {
        if (!hmKey) return true;
        var list = this.list();
        for (var i = 0; i < list.length; i++) {
            if (list[i].hm === hmKey) {
                return $gamePMZ ? $gamePMZ.hasBadge(list[i].key) : false;
            }
        }
        return false;
    },
    obeyCheck: function(pokemon) {
        // Returns true if the Pokémon obeys based on badges
        var cap = PMZ.Badges.levelCap();
        return pokemon.level <= cap;
    }
};

// ============================================================================
// PMZ.HM - Movimientos de MO (campo)
// ============================================================================
PMZ.HM = {
    isHM: function(moveKey) {
        var md = PMZ.Data.move(moveKey);
        return md && md.hm === true;
    },
    isHMMove: function(move) {
        return move && move.key && this.isHM(move.key);
    },
    canUse: function(moveKey) {
        // Check if any party Pokémon knows this HM and player has the badge
        var md = PMZ.Data.move(moveKey);
        if (!md || !md.hm) return { can: false, reason: '' };
        // Find badge required
        var badges = PMZ.Badges.list();
        var requiredBadge = '';
        for (var i = 0; i < badges.length; i++) {
            if (badges[i].hm === moveKey) { requiredBadge = badges[i].key; break; }
        }
        if (requiredBadge && $gamePMZ && !$gamePMZ.hasBadge(requiredBadge)) {
            return { can: false, reason: 'Necesitas la Medalla ' + (PMZ.Badges.get(requiredBadge) ? PMZ.Badges.get(requiredBadge).name : requiredBadge) + '!' };
        }
        // Find a Pokémon that knows this move
        var party = $gamePMZ ? $gamePMZ.party() : [];
        for (var j = 0; j < party.length; j++) {
            var pkmn = party[j];
            if (!pkmn || pkmn.currentHp <= 0) continue;
            for (var k = 0; k < pkmn.moves.length; k++) {
                if (pkmn.moves[k].key === moveKey) {
                    return { can: true, pokemon: pkmn, reason: '' };
                }
            }
        }
        return { can: false, reason: 'Ningun Pokemon conoce ese MO!' };
    },
    useHM: function(moveKey, user) {
        return { used: true };
    }
};

// ============================================================================
// PMZ.Safari - Zona Safari
// ============================================================================
PMZ.Safari = {
    start: function(type) {
        $gamePMZ.setSafariBalls(30);
        $gamePMZ.setSafariSteps(500);
    },
    
    encounter: function() {
        var enc = PMZ.Data.encounter();
        if (!enc) return null;
        var data = enc.byType ? (enc.byType['safari_grass'] || enc.byType['safari_water']) : null;
        if (!data || !data.pokemon || data.pokemon.length === 0) return null;
        var chosen = PMZ.Encounter._select(data.pokemon);
        if (!chosen) return null;
        var level = chosen.minLevel + Math.floor(Math.random() * (chosen.maxLevel - chosen.minLevel + 1));
        return PMZ.Pokemon.create(chosen.species, level);
    },
    
    calcCapture: function(pokemon, baitCount, rockCount) {
        var a = pokemon.catchRate || 45;
        var hpMax = pokemon.maxHp;
        var hpCur = pokemon.currentHp;
        // Safari formula: ((3*max - 2*cur) * rate) / (3*max) * bait/rock modifiers
        var baitMod = baitCount > 0 ? Math.pow(0.9, baitCount) : 1;
        var rockMod = rockCount > 0 ? Math.pow(1.1, rockCount) : 1;
        var rate = Math.floor(((3 * hpMax - 2 * hpCur) * a * 1.5) / (3 * hpMax) * baitMod * rockMod);
        if (rate >= 255) return { rate: 255, shakes: 4, captured: true };
        var shake = Math.floor(1048560 / Math.sqrt(Math.sqrt(16711680 / Math.max(1, rate))));
        var shakes = 0;
        for (var i = 0; i < 4; i++) {
            if (Math.floor(Math.random() * 65536) < shake) shakes++;
        }
        return { rate: rate, shakes: shakes, captured: shakes >= 4 };
    },
    
    step: function() {
        var steps = $gamePMZ.safariSteps();
        if (steps <= 0) return { over: true, msg: 'Se acabo el tiempo en la Zona Safari!' };
        $gamePMZ.setSafariSteps(steps - 1);
        if ($gamePMZ.safariSteps() <= 0) return { over: true, msg: 'Se acabo el tiempo en la Zona Safari!' };
        return { over: false };
    },
    
    fleeChance: function(pokemon, baitCount) {
        return Math.min(50, 10 + baitCount * 5 + Math.floor((50 - pokemon.catchRate) / 5));
    },
    
    stepCheck: function() {
        var result = this.step();
        if (result.over) {
            PMZ.Encounter.endBattle();
        }
        return result;
    }
};

// ============================================================================
// PMZ.Daycare - Guarderia / Cria
// ============================================================================
PMZ.Daycare = {
    // Simple egg group mapping for Gen 1
    _eggGroups: {
        'bulbasaur': ['monster', 'grass'], 'ivysaur': ['monster', 'grass'], 'venusaur': ['monster', 'grass'],
        'charmander': ['monster', 'dragon'], 'charmeleon': ['monster', 'dragon'], 'charizard': ['monster', 'dragon'],
        'squirtle': ['monster', 'water1'], 'wartortle': ['monster', 'water1'], 'blastoise': ['monster', 'water1'],
        'caterpie': ['bug'], 'metapod': ['bug'], 'butterfree': ['bug'],
        'weedle': ['bug'], 'kakuna': ['bug'], 'beedrill': ['bug'],
        'pidgey': ['flying'], 'pidgeotto': ['flying'], 'pidgeot': ['flying'],
        'rattata': ['field'], 'raticate': ['field'],
        'spearow': ['flying'], 'fearow': ['flying'],
        'ekans': ['field', 'dragon'], 'arbok': ['field', 'dragon'],
        'pikachu': ['field', 'fairy'], 'raichu': ['field', 'fairy'],
        'sandshrew': ['field'], 'sandslash': ['field'],
        'nidoranf': ['monster', 'field'], 'nidorina': ['monster', 'field'], 'nidoqueen': ['undiscovered'],
        'nidoranm': ['monster', 'field'], 'nidorino': ['monster', 'field'], 'nidoking': ['monster', 'field'],
        'clefairy': ['fairy'], 'clefable': ['fairy'],
        'vulpix': ['field'], 'ninetales': ['field'],
        'jigglypuff': ['fairy'], 'wigglytuff': ['fairy'],
        'zubat': ['flying'], 'golbat': ['flying'],
        'oddish': ['grass'], 'gloom': ['grass'], 'vileplume': ['grass'],
        'paras': ['bug', 'grass'], 'parasect': ['bug', 'grass'],
        'venonat': ['bug'], 'venomoth': ['bug'],
        'diglett': ['field'], 'dugtrio': ['field'],
        'meowth': ['field'], 'persian': ['field'],
        'psyduck': ['water1', 'field'], 'golduck': ['water1', 'field'],
        'mankey': ['field'], 'primeape': ['field'],
        'growlithe': ['field'], 'arcanine': ['field'],
        'poliwag': ['water1'], 'poliwhirl': ['water1'], 'poliwrath': ['water1'],
        'abra': ['humanlike'], 'kadabra': ['humanlike'], 'alakazam': ['humanlike'],
        'machop': ['humanlike'], 'machoke': ['humanlike'], 'machamp': ['humanlike'],
        'bellsprout': ['grass'], 'weepinbell': ['grass'], 'victreebel': ['grass'],
        'tentacool': ['water3'], 'tentacruel': ['water3'],
        'geodude': ['mineral'], 'graveler': ['mineral'], 'golem': ['mineral'],
        'ponyta': ['field'], 'rapidash': ['field'],
        'slowpoke': ['monster', 'water1'], 'slowbro': ['monster', 'water1'],
        'magnemite': ['mineral'], 'magneton': ['mineral'],
        'farfetchd': ['flying', 'field'],
        'doduo': ['flying'], 'dodrio': ['flying'],
        'seel': ['water1', 'field'], 'dewgong': ['water1', 'field'],
        'grimer': ['amorphous'], 'muk': ['amorphous'],
        'shellder': ['water3'], 'cloyster': ['water3'],
        'gastly': ['amorphous'], 'haunter': ['amorphous'], 'gengar': ['amorphous'],
        'onix': ['mineral'],
        'drowzee': ['humanlike'], 'hypno': ['humanlike'],
        'krabby': ['water3'], 'kingler': ['water3'],
        'voltorb': ['mineral'], 'electrode': ['mineral'],
        'exeggcute': ['grass'], 'exeggutor': ['grass'],
        'cubone': ['monster'], 'marowak': ['monster'],
        'hitmonlee': ['humanlike'], 'hitmonchan': ['humanlike'],
        'lickitung': ['monster'],
        'koffing': ['amorphous'], 'weezing': ['amorphous'],
        'rhyhorn': ['monster', 'field'], 'rhydon': ['monster', 'field'],
        'chansey': ['fairy'],
        'tangela': ['grass'],
        'kangaskhan': ['monster'],
        'horsea': ['water1', 'dragon'], 'seadra': ['water1', 'dragon'],
        'goldeen': ['water2'], 'seaking': ['water2'],
        'staryu': ['water3'], 'starmie': ['water3'],
        'mrmime': ['humanlike'],
        'scyther': ['bug'],
        'jynx': ['humanlike'],
        'electabuzz': ['humanlike'],
        'magmar': ['humanlike'],
        'pinsir': ['bug'],
        'tauros': ['field'],
        'magikarp': ['water2', 'dragon'], 'gyarados': ['water2', 'dragon'],
        'lapras': ['monster', 'water1'],
        'ditto': ['ditto'],
        'eevee': ['field'], 'vaporeon': ['field'], 'jolteon': ['field'], 'flareon': ['field'],
        'porygon': ['mineral'],
        'omanyte': ['water1', 'water3'], 'omastar': ['water1', 'water3'],
        'kabuto': ['water1', 'water3'], 'kabutops': ['water1', 'water3'],
        'aerodactyl': ['flying'],
        'snorlax': ['monster'],
        'articuno': ['undiscovered'], 'zapdos': ['undiscovered'], 'moltres': ['undiscovered'],
        'dratini': ['water1', 'dragon'], 'dragonair': ['water1', 'dragon'], 'dragonite': ['water1', 'dragon'],
        'mewtwo': ['undiscovered'], 'mew': ['undiscovered']
    },
    
    getEggGroups: function(species) {
        return this._eggGroups[species.toLowerCase()] || ['field'];
    },
    
    compatible: function(p1, p2) {
        if (!p1 || !p2) return false;
        if (p1.species === p2.species) return false;
        var g1 = this.getEggGroups(p1.species);
        var g2 = this.getEggGroups(p2.species);
        if (g1.indexOf('undiscovered') >= 0 || g2.indexOf('undiscovered') >= 0) return false;
        if (g1.indexOf('ditto') >= 0 || g2.indexOf('ditto') >= 0) return true;
        for (var i = 0; i < g1.length; i++) {
            if (g2.indexOf(g1[i]) >= 0) return true;
        }
        return false;
    },
    
    deposit: function(slot, pokemon) {
        if (slot < 0 || slot > 1) return false;
        this._daycare[slot] = pokemon;
        // Remove from party
        var idx = $gamePMZ.party().indexOf(pokemon);
        if (idx >= 0) $gamePMZ.party().splice(idx, 1);
        return true;
    },
    
    withdraw: function(slot) {
        var p = this._daycare[slot];
        if (!p) return null;
        this._daycare[slot] = null;
        return p;
    },
    
    daycarePokemon: function(slot) {
        return this._daycare[slot];
    },
    
    _daycare: [null, null],
    
    produceEgg: function() {
        var p1 = this._daycare[0];
        var p2 = this._daycare[1];
        if (!this.compatible(p1, p2)) return null;
        // Determine mother (female or non-Ditto)
        var father = p1, mother = p2;
        var p1Data = PMZ.Data.pokemon(p1.species);
        var p2Data = PMZ.Data.pokemon(p2.species);
        var p1Ratio = p1Data ? p1Data.genderRatio : undefined;
        var p2Ratio = p2Data ? p2Data.genderRatio : undefined;
        if (p1.species === 'ditto') { mother = p2; father = p1; }
        else if (p2.species === 'ditto') { mother = p1; father = p2; }
        else if (p2Ratio !== undefined && p2Ratio === 0) { mother = p2; father = p1; }
        else { mother = p1; father = p2; }
        // If both are the same species, first slot is mother
        if (p1.species === p2.species) { mother = p1; father = p2; }
        // Determine baby species
        var babySpecies = mother.species;
        // If mother is Nidoran♀ and father is Nidoran♂, baby is Nidoran♀
        if (mother.species === 'nidoranf' && father.species === 'nidoranm') babySpecies = 'nidoranf';
        // Create egg
        var egg = {
            species: babySpecies,
            name: 'Huevo',
            types: ['normal'],
            level: 1,
            hp: 10, maxHp: 10, attack: 5, defense: 5, spAttack: 5, spDefense: 5, speed: 5,
            moves: [{ key: 'splash', name: 'Splash', pp: 40, maxPp: 40, power: 0, type: 'normal', category: 'status', accuracy: 100, effect: 'none' }],
            exp: 0, expToNext: 100,
            status: null, currentHp: 10,
            ivs: PMZ.Pokemon.generateIVs(),
            evs: { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
            nature: PMZ.Pokemon.randomNature(),
            catchRate: 45,
            gender: PMZ.Pokemon.getGender(babySpecies),
            shiny: false,
            happiness: 70,
            heldItems: [],
            isEgg: true,
            eggSteps: 0,
            hatchSteps: 2560 + Math.floor(Math.random() * 1280)
        };
        // Inherit some IVs from parents (3 random from either parent)
        var statNames = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];
        for (var i = 0; i < 3; i++) {
            var stat = statNames[Math.floor(Math.random() * statNames.length)];
            var parent = Math.random() < 0.5 ? mother : father;
            egg.ivs[stat] = parent.ivs[stat];
        }
        // Inherit nature: only the parent holding Everstone passes nature; else random
        // Check all held item slots, not just [0]
        var motherHasEverstone = mother.heldItems && mother.heldItems.indexOf('everstone') >= 0;
        var fatherHasEverstone = father.heldItems && father.heldItems.indexOf('everstone') >= 0;
        if (motherHasEverstone) {
            egg.nature = mother.nature;
        } else if (fatherHasEverstone) {
            egg.nature = father.nature;
        }
        // If neither holds Everstone, egg.nature stays as PMZ.Pokemon.randomNature() (set above)
        // Egg moves: if father knows a move that the baby species can learn as egg move, pass it
        var base = PMZ.Data.pokemon(babySpecies);
        if (base && base.eggMoves && father && father.moves) {
            for (var mi = 0; mi < father.moves.length; mi++) {
                if (base.eggMoves.indexOf(father.moves[mi].key) >= 0 ||
                    base.eggMoves.indexOf(father.moves[mi].name) >= 0) {
                    // Add this move to egg's moves (up to 4)
                    if (egg.moves.length > 0 && egg.moves[0].key === 'splash') egg.moves = [];
                    if (egg.moves.length < 4) {
                        var moveData = PMZ.Data.move(father.moves[mi].key || father.moves[mi].name);
                        if (moveData) egg.moves.push({
                            key: moveData.key || moveData.name.toLowerCase().replace(/[^a-z]/g, ''),
                            name: moveData.name,
                            pp: moveData.pp || 20,
                            maxPp: moveData.pp || 20,
                            power: moveData.power || 0,
                            type: moveData.type || 'normal',
                            category: moveData.category || 'status',
                            accuracy: moveData.accuracy !== undefined ? moveData.accuracy : 100,
                            neverMiss: !!moveData.neverMiss,
                            effect: moveData.effect || 'none'
                        });
                    }
                }
            }
        }
        // Ability inheritance: 80% mother's ability, else father's
        var motherAbilities = PMZ.Data.pokemon(mother.species);
        var fatherAbilities = PMZ.Data.pokemon(father.species);
        if (motherAbilities && motherAbilities.abilities && motherAbilities.abilities.length > 0) {
            if (fatherAbilities && fatherAbilities.abilities && fatherAbilities.abilities.length > 0 && Math.random() < 0.2) {
                egg.ability = fatherAbilities.abilities[0];
            } else {
                egg.ability = motherAbilities.abilities[0];
            }
        }
        return egg;
    },
    
    hatchCheck: function(pokemon) {
        if (!pokemon.isEgg) return { hatched: false };
        pokemon.eggSteps = (pokemon.eggSteps || 0) + 1;
        if (pokemon.eggSteps >= (pokemon.hatchSteps || 2560)) {
            // Hatches!
            var base = PMZ.Data.pokemon(pokemon.species);
            if (base) {
                var hatched = PMZ.Pokemon.create(pokemon.species, 1);
                // Copy IVs and nature from egg
                hatched.ivs = pokemon.ivs;
                hatched.nature = pokemon.nature;
                hatched.shiny = pokemon.shiny;
                return { hatched: true, pokemon: hatched };
            }
        }
        return { hatched: false };
    },

    // Create an egg for a specific species (used by giveEgg plugin command and NPCs)
    createEgg: function(species, hatchSteps) {
        var base = PMZ.Data.pokemon(species);
        if (!base) return null;
        var steps = hatchSteps && hatchSteps > 0 ? hatchSteps : (2560 + Math.floor(Math.random() * 1280));
        return {
            species: species.toLowerCase(),
            name: 'Huevo',
            types: ['normal'],
            level: 1,
            hp: 10, maxHp: 10, attack: 5, defense: 5, spAttack: 5, spDefense: 5, speed: 5,
            moves: [{ key: 'splash', name: 'Splash', pp: 40, maxPp: 40, power: 0, type: 'normal', category: 'status', accuracy: 100, effect: 'none' }],
            exp: 0, expToNext: 100,
            status: null, currentHp: 10,
            ivs: PMZ.Pokemon.generateIVs(),
            evs: { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
            nature: PMZ.Pokemon.randomNature(),
            catchRate: base.catchRate || 45,
            gender: PMZ.Pokemon.getGender(species),
            shiny: false,
            happiness: 70,
            heldItems: [],
            isEgg: true,
            eggSteps: 0,
            hatchSteps: steps
        };
    }
};

// ============================================================================
// PMZ.Pokedex - Registro de especies
// ============================================================================
PMZ.Pokedex = {
    _descriptions: {
        'bulbasaur': 'Un Pokemon de tipo Planta/Veneno. La semilla en su lomo crece absorbiendo nutrientes.',
        'charmander': 'Un Pokemon de tipo Fuego. La llama en su cola indica su vitalidad y emocion.',
        'squirtle': 'Un Pokemon de tipo Agua. Su caparazon lo protege y puede lanzar potentes chorros de agua.',
        'pikachu': 'Un Pokemon de tipo Electrico. Las bolsas de sus mejillas almacenan electricidad estatica.',
        'mewtwo': 'Un Pokemon legendario de tipo Psiquico, creado por manipulacion genetica de Mew.',
        'mew': 'Un Pokemon legendario de tipo Psiquico que contiene el ADN de todas las especies.',
        'ditto': 'Un Pokemon de tipo Normal con la capacidad de transformarse en cualquier otra especie.'
    },
    
    isSeen: function(key) { return $gamePMZ && !!$gamePMZ.pokedexSeen()[key.toLowerCase()]; },
    
    isCaught: function(key) { return $gamePMZ && !!$gamePMZ.pokedexCaught()[key.toLowerCase()]; },
    
    registerSeen: function(key) {
        if (!$gamePMZ) return;
        key = key.toLowerCase();
        $gamePMZ.pokedexSeen()[key] = true;
    },
    
    registerCaught: function(key) {
        if (!$gamePMZ) return;
        key = key.toLowerCase();
        $gamePMZ.pokedexCaught()[key] = true;
        $gamePMZ.pokedexSeen()[key] = true;
    },
    
    getDescription: function(key) {
        var base = PMZ.Data.pokemon(key);
        if (!base) return 'No hay datos.';
        var k = key.toLowerCase();
        if (this._descriptions[k]) return this._descriptions[k];
        return base.name + ' es un Pokemon de tipo ' + (base.types || ['normal']).join('/') + '.';
    },
    
    search: function(query) {
        query = query.toLowerCase().trim();
        if (!query) return this.allSpecies();
        var cache = PMZ.Data._cache.pokemon;
        if (!cache) return [];
        return Object.keys(cache).filter(function(k) {
            return k.indexOf(query) >= 0 || (cache[k].name || '').toLowerCase().indexOf(query) >= 0;
        }).sort(function(a, b) {
            return (cache[a].id || 0) - (cache[b].id || 0);
        });
    },
    
    registerAllSeen: function() {
        if (!$gamePMZ) return;
        var cache = PMZ.Data._cache.pokemon;
        if (!cache) return;
        var seen = $gamePMZ.pokedexSeen();
        Object.keys(cache).forEach(function(k) { seen[k] = true; });
    },
    
    getArea: function(key) {
        // Search encounter data for this species
        var enc = PMZ.Data.encounter();
        if (!enc) return [];
        var areas = [];
        var k = key.toLowerCase();
        // Check byMap
        if (enc.byMap) {
            for (var mapName in enc.byMap) {
                var list = enc.byMap[mapName].pokemon || [];
                for (var i = 0; i < list.length; i++) {
                    if (list[i].species === k) {
                        areas.push({ map: mapName, type: enc.byMap[mapName].type || 'grass', levels: list[i].minLevel + '-' + list[i].maxLevel });
                    }
                }
            }
        }
        // Check byType
        if (enc.byType) {
            for (var type in enc.byType) {
                var tList = enc.byType[type].pokemon || [];
                for (var j = 0; j < tList.length; j++) {
                    if (tList[j].species === k) {
                        areas.push({ map: 'Tipo ' + type, type: type, levels: tList[j].minLevel + '-' + tList[j].maxLevel });
                    }
                }
            }
        }
        return areas;
    },
    
    allSpecies: function() {
        var cache = PMZ.Data._cache.pokemon;
        if (!cache) return [];
        return Object.keys(cache).sort(function(a, b) {
            return (cache[a].id || 0) - (cache[b].id || 0);
        });
    },
    
    seen: function() { return $gamePMZ ? $gamePMZ.seenCount() : 0; },
    
    caught: function() { return $gamePMZ ? $gamePMZ.caughtCount() : 0; }
};

// ============================================================================
// PMZ.Battle - Calculos de combate
// ============================================================================
PMZ.Battle = {
    
    // Battle type
    _battleType: 'wild', // 'wild' or 'trainer'
    _enemyTrainer: null,
    _trainerParty: [],
    _trainerActiveIndex: 0,
    _battleIdCounter: 0,
    
    // Battle tracking data for effects
    _leechSeed: {},     // targetBattleId: attackerBattleId
    _bind: {},          // targetBattleId: {turns, attackerId}
    _confusedUser: {},  // pokemonBattleId: {turns, moveKey}
    _recharge: {},      // pokemonBattleId: true
    _substitute: {},    // pokemonBattleId: hp
    _disable: {},       // pokemonBattleId: {moveIndex, turns}
    _mist: { player: 0, enemy: 0 },
    _lightScreen: { player: 0, enemy: 0 },
    _reflect: { player: 0, enemy: 0 },
    _bide: {},          // pokemonBattleId: {stored, turn}
    _protect: {},       // pokemonBattleId: true
    _focusEnergy: {},   // pokemonBattleId: true
    _rage: {},          // pokemonBattleId: true (attack boosts when hit)
    _lastMoveUsed: {},  // pokemonBattleId: moveKey

    // Battle result tracking (for plugin command switches)
    _result: null,       // {outcome, species, level, trainer, capturedSpecies, defeatedSpecies}
    _resultSwitches: { win: 0, lose: 0, flee: 0, catch: 0, defeatTarget: 0 },
    _defeatedThisBattle: [],   // species of enemies fainted in this battle
    _battleInitialSpecies: null,  // the species the battle was started against (for trainer / wild lead)

    setBattleSwitches: function(sw) {
        // Called by plugin commands to configure which switches to set on each outcome
        this._resultSwitches = {
            win: Number(sw.win) || 0,
            lose: Number(sw.lose) || 0,
            flee: Number(sw.flee) || 0,
            catch: Number(sw.catch) || 0,
            defeatTarget: Number(sw.defeatTarget) || 0
        };
        // Preserve defeat-target key for species matching
        if (sw._defeatTargetKey !== undefined) {
            this._resultSwitches._defeatTargetKey = sw._defeatTargetKey;
        }
        this._defeatedThisBattle = [];
        this._result = null;
    },

    addDefeatedSpecies: function(species) {
        if (!species) return;
        var key = String(species).toLowerCase();
        if (this._defeatedThisBattle.indexOf(key) === -1) {
            this._defeatedThisBattle.push(key);
        }
    },

    setResultOutcome: function(outcome, extras) {
        // Called from scene when outcome is known. extras may include capturedSpecies, species, level, trainer
        if (!this._result) this._result = {};
        this._result.outcome = outcome;
        if (extras) {
            for (var k in extras) {
                if (extras.hasOwnProperty(k)) this._result[k] = extras[k];
            }
        }
        if (!this._result.defeatedSpecies) {
            this._result.defeatedSpecies = this._defeatedThisBattle.slice();
        }
    },

    getResult: function() {
        return this._result;
    },

    getOutcome: function() {
        return this._result ? this._result.outcome : null;
    },

    clearResult: function() {
        this._result = null;
        this._defeatedThisBattle = [];
        this._battleInitialSpecies = null;
    },

    applyResultSwitches: function() {
        // Set the configured switches based on outcome. Called from trainerEndBattle.
        // First clears ALL configured switches (so a previous battle's state doesn't leak)
        // then sets only the ones that match the current outcome.
        if (!$gameSwitches) return;
        if (!this._resultSwitches) return;
        var sw = this._resultSwitches;
        var r = this._result;
        function setSwitch(id) {
            if (id > 0) $gameSwitches.setValue(id, true);
        }
        function clearSwitch(id) {
            if (id > 0) $gameSwitches.setValue(id, false);
        }
        // Clear all configured switches first
        clearSwitch(sw.win); clearSwitch(sw.lose); clearSwitch(sw.flee);
        clearSwitch(sw.catch); clearSwitch(sw.defeatTarget);
        if (!r) return;
        if (r.outcome === 'won' && sw.win) setSwitch(sw.win);
        if (r.outcome === 'lost' && sw.lose) setSwitch(sw.lose);
        if (r.outcome === 'fled' && sw.flee) setSwitch(sw.flee);
        if (r.outcome === 'caught' && sw.catch) setSwitch(sw.catch);
        if (sw.defeatTarget && r.defeatedSpecies && sw._defeatTargetKey) {
            for (var i = 0; i < r.defeatedSpecies.length; i++) {
                if (r.defeatedSpecies[i] === sw._defeatTargetKey) {
                    setSwitch(sw.defeatTarget);
                    break;
                }
            }
        }
    },

    initBattleTracking: function() {
        this._leechSeed = {};
        this._bind = {};
        this._confusedUser = {};
        this._recharge = {};
        this._substitute = {};
        this._disable = {};
        this._mist = { player: 0, enemy: 0 };
        this._lightScreen = { player: 0, enemy: 0 };
        this._reflect = { player: 0, enemy: 0 };
        this._bide = {};
        this._protect = {};
        this._focusEnergy = {};
        this._rage = {};
        this._lastMoveUsed = {};
        this.initParticipants();
    },

    // Participant tracking for EXP distribution
    // Any pokemon that entered the field at any point during the battle gets a share
    initParticipants: function() {
        this._participants = [];
        this._participantIds = [];
    },
    addParticipant: function(pokemon) {
        if (!pokemon) return;
        if (!this._participants) this.initParticipants();
        var id = pokemon._battleId;
        if (id !== undefined && this._participantIds.indexOf(id) >= 0) return;
        this._participants.push(pokemon);
        if (id !== undefined) this._participantIds.push(id);
    },
    getParticipants: function() {
        if (!this._participants) this.initParticipants();
        return this._participants;
    },
    
    hasSubstitute: function(p) { return this._substitute[p._battleId] > 0; },
    getSubstituteHp: function(p) { return this._substitute[p._battleId] || 0; },
    
    startWild: function(species, level) {
        this._battleType = 'wild';
        PMZ.Encounter.inBattle = true;
        this._enemyTrainer = null;
        this._trainerParty = [];
        this._trainerActiveIndex = 0;
        this.Mechanics.clearCounts();
        this._doubleBattle = false;
        this._playerPokemon2 = null;
        this._wildPokemon2 = null;
        this.initBattleTracking();
        var wild = PMZ.Pokemon.create(species, level);
        this._wildPokemon = wild;
        this._activePlayerIndex = PMZ.Party.firstAliveIndex();
        this._playerPokemon = PMZ.Party.get(this._activePlayerIndex);
        if (this._playerPokemon) this._playerPokemon._battleId = ++this._battleIdCounter;
        this.addParticipant(this._playerPokemon);
        if (wild) wild._battleId = ++this._battleIdCounter;
        this._battleInitialSpecies = String(species || '').toLowerCase();
    },

    startDoubleWild: function(species1, level1, species2, level2) {
        this.startWild(species1, level1);
        this._doubleBattle = true;
        var wild2 = PMZ.Pokemon.create(species2, level2);
        this._wildPokemon2 = wild2;
        if (wild2) wild2._battleId = ++this._battleIdCounter;
        // Second player pokemon (first alive after current)
        var party = PMZ.Party.all();
        var idx1 = party.indexOf(this._playerPokemon);
        for (var i = idx1 + 1; i < party.length; i++) {
            if (party[i] && !PMZ.Pokemon.isFainted(party[i]) && this._playerPokemon2 !== party[i]) {
                this._playerPokemon2 = party[i];
                this._playerPokemon2._battleId = ++this._battleIdCounter;
                break;
            }
        }
        if (!this._playerPokemon2 && party.length > 0) {
            this._playerPokemon2 = party[0];
            this._playerPokemon2._battleId = ++this._battleIdCounter;
        }
        this.addParticipant(this._playerPokemon2);
    },

    startDoubleTrainer: function(trainerKey) {
        var tData = this.startTrainer(trainerKey);
        if (!tData) return null;
        this._doubleBattle = true;
        // Second trainer pokemon
        if (this._trainerParty.length > 1) {
            this._wildPokemon2 = this._trainerParty[1];
            if (this._wildPokemon2) this._wildPokemon2._battleId = ++this._battleIdCounter;
        }
        // Second player pokemon
        var party = PMZ.Party.all();
        for (var i = 0; i < party.length; i++) {
            if (party[i] && !PMZ.Pokemon.isFainted(party[i]) && party[i] !== this._playerPokemon && party[i] !== this._playerPokemon2) {
                this._playerPokemon2 = party[i];
                this._playerPokemon2._battleId = ++this._battleIdCounter;
                break;
            }
        }
        this.addParticipant(this._playerPokemon2);
        return tData;
    },
    
    startTrainer: function(trainerKey) {
        var tData = PMZ.Data.trainer(trainerKey);
        if (!tData) return null;
        this._battleType = 'trainer';
        PMZ.Encounter.inBattle = true;
        this._enemyTrainer = tData;
        this._trainerParty = [];
        this._trainerActiveIndex = 0;
        this.Mechanics.clearCounts();
        this._doubleBattle = false;
        this._playerPokemon2 = null;
        this._wildPokemon2 = null;
        this.initBattleTracking();
        for (var i = 0; i < tData.pokemon.length; i++) {
            var pd = tData.pokemon[i];
            var pkmn = PMZ.Pokemon.create(pd.species, pd.level);
            if (pkmn) {
                // Override moves if specified
                if (pd.moves && pd.moves.length > 0) {
                    pkmn.moves = [];
                    var limit = PMZ.Data.configValue('battleMovesLimit') || 4;
                    for (var j = 0; j < Math.min(pd.moves.length, limit); j++) {
                        var md = PMZ.Data.move(pd.moves[j]);
                        if (md) {
                            pkmn.moves.push({
                                key: pd.moves[j].toLowerCase(),
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
                }
                pkmn._battleId = ++this._battleIdCounter;
                this._trainerParty.push(pkmn);
            }
        }
        this._wildPokemon = this._trainerParty[0];
        // Register all trainer pokemon as seen in Pokedex
        for (var k = 0; k < this._trainerParty.length; k++) {
            if (this._trainerParty[k] && this._trainerParty[k].species) {
                PMZ.Pokedex.registerSeen(this._trainerParty[k].species);
            }
        }
        this._activePlayerIndex = PMZ.Party.firstAliveIndex();
        this._playerPokemon = PMZ.Party.get(this._activePlayerIndex);
        if (this._playerPokemon) this._playerPokemon._battleId = ++this._battleIdCounter;
        this.addParticipant(this._playerPokemon);
        this._battleInitialSpecies = (this._trainerParty[0] && this._trainerParty[0].species) || null;
        return tData;
    },
    
    isTrainerBattle: function() {
        return this._battleType === 'trainer';
    },
    
    getTrainerNextPokemon: function() {
        for (var i = 0; i < this._trainerParty.length; i++) {
            if (this._trainerParty[i].currentHp > 0) {
                this._trainerActiveIndex = i;
                return this._trainerParty[i];
            }
        }
        return null;
    },
    
    trainerAllFainted: function() {
        for (var i = 0; i < this._trainerParty.length; i++) {
            if (this._trainerParty[i].currentHp > 0) return false;
        }
        return true;
    },
    
    getTrainerMoney: function() {
        if (!this._enemyTrainer) return 0;
        var mult = 1;
        // Add per-Pokemon level scaling
        return this._enemyTrainer.money || 0;
    },
    
    sendNextTrainerPokemon: function(excludePkmn) {
        console.log('[PMZ] sendNextTrainerPokemon trainerPartyLen=' + (this._trainerParty ? this._trainerParty.length : 0) + ' exclude=' + (excludePkmn ? excludePkmn.species : 'none'));
        if (!this._trainerParty) return null;
        for (var i = 0; i < this._trainerParty.length; i++) {
            if (excludePkmn && this._trainerParty[i] === excludePkmn) continue;
            console.log('[PMZ] sendNextTrainerPokemon i=' + i + ' species=' + this._trainerParty[i].species + ' hp=' + this._trainerParty[i].currentHp);
            if (this._trainerParty[i].currentHp > 0) {
                var pkmn = this._trainerParty[i];
                pkmn._battleId = ++this._battleIdCounter;
                PMZ.Battle.initStatStages(pkmn);
                return pkmn;
            }
        }
        return null;
    },
    
    trainerEndBattle: function() {
        // Apply any battle-result switches BEFORE clearing state
        this.applyResultSwitches();
        this._battleType = 'wild';
        this._enemyTrainer = null;
        this._trainerParty = [];
        this._wildPokemon = null;
        this._playerPokemon = null;
        this._activePlayerIndex = 0;
        this._trainerActiveIndex = 0;
        // Clear all active mechanics on party pokemon
        var party = $gamePMZ ? $gamePMZ.party() : [];
        for (var i = 0; i < party.length; i++) {
            PMZ.Battle.Mechanics.clearAll(party[i]);
        }
        PMZ.Battle.Mechanics.clearCounts();
        // Keep _result and _defeatedThisBattle for the event to query (via getResult/getOutcome).
        // They are cleared at the start of the next battle (setBattleSwitches) or via resetBattleResult.
    },
    
    // Stat stages for battle
    initStatStages: function(pokemon) {
        if (!pokemon) return;
        pokemon._statStages = { attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0, accuracy: 0, evasion: 0 };
        this.Mechanics.clearAll(pokemon);
        pokemon._guardSpec = 0;
    },
    
    statMultiplier: function(stage) {
        if (stage >= 0) return (2 + stage) / 2;
        return 2 / (2 - stage);
    },

    // Accuracy check: returns true if move hits
    // Considers move.accuracy, attacker accuracy stage, defender evasion stage,
    // defender Bright Powder (evasion mult), and No-Guard ability.
    // Moves with neverMiss:true (Swift, Aerial Ace, etc.) bypass ALL evasion.
    checkHit: function(attacker, defender, moveData) {
        if (!moveData) return true;
        // Never-miss flag (Swift, Aerial Ace, Shock Wave, Vital Throw, etc.)
        if (moveData.neverMiss === true) return true;
        // Legacy: accuracy === 0 also treated as never-miss
        if (moveData.accuracy === 0) return true;
        // No-Guard: both always hit
        if (PMZ.Abilities && PMZ.Abilities.hasEffect) {
            if (PMZ.Abilities.hasEffect(attacker, 'no_guard') ||
                PMZ.Abilities.hasEffect(defender, 'no_guard')) return true;
        }
        var baseAcc = moveData.accuracy;
        var accStage = this.getStatStage(attacker, 'accuracy') || 0;
        var evaStage = this.getStatStage(defender, 'evasion') || 0;
        var accMult = this.statMultiplier(accStage);
        var evaMult = this.statMultiplier(evaStage);
        var finalAcc = baseAcc * accMult / evaMult;
        // Bright Powder: multiplicative evasion on top
        var brightMult = (PMZ.HoldItems && PMZ.HoldItems.evasionMultiplier) ? PMZ.HoldItems.evasionMultiplier(defender) : 1;
        finalAcc = finalAcc / brightMult;
        return Math.random() * 100 < finalAcc;
    },

    getStatStage: function(pokemon, stat) {
        if (!pokemon._statStages) this.initStatStages(pokemon);
        return pokemon._statStages[stat] || 0;
    },
    
    boostStat: function(pokemon, stat, stages) {
        if (!pokemon._statStages) this.initStatStages(pokemon);
        var current = pokemon._statStages[stat] || 0;
        var newStage = Math.max(-6, Math.min(6, current + stages));
        pokemon._statStages[stat] = newStage;
        return newStage - current; // actual change
    },

    statStageMsg: function(pokemon, stat, stages) {
        var change = this.boostStat(pokemon, stat, stages);
        if (change === 0) return '';
        var statNames = { attack: 'Ataque', defense: 'Defensa', spAttack: 'At.Esp.', spDefense: 'Def.Esp.',
            speed: 'Velocidad', accuracy: 'Precision', evasion: 'Evasion', crit: 'Critico' };
        var sname = statNames[stat] || stat;
        var verb = change > 0 ? 'subio' : 'bajo';
        var intens = Math.abs(change) >= 2 ? ' mucho' : '';
        return pokemon.name + ' ' + sname + ' ' + verb + intens + '!';
    },
    
    // ============================================================================
    // PMZ.Battle.Mechanics - Sistema generico de mecanicas de combate (mega, primal, formas, etc.)
    // ============================================================================
    Mechanics: {
        _counts: {},
        
        list: function() {
            var md = PMZ.Data.mechanics();
            return md && md.mechanics ? md.mechanics : [];
        },
        
        get: function(key) {
            var list = this.list();
            for (var i = 0; i < list.length; i++) {
                if (list[i].key === key) return list[i];
            }
            return null;
        },
        
        canActivate: function(pokemon, mechanicKey) {
            if (!PMZ.Config.enableMechanics()) return false;
            var mech = this.get(mechanicKey);
            if (!mech) return false;
            if (!pokemon) return false;
            if (pokemon._megaEvolved) return false;
            if (pokemon._activeMechanics && pokemon._activeMechanics[mechanicKey]) return false;
            if ((this._counts[mechanicKey] || 0) >= (mech.maxPerBattle || 1)) return false;
            
            if (mech.trigger === 'holdItem') {
                if (!pokemon.heldItems || pokemon.heldItems.length === 0) return false;
                for (var i = 0; i < pokemon.heldItems.length; i++) {
                    var data = PMZ.Data.item(pokemon.heldItems[i]);
                    if (data && data.effect === mech.triggerItemEffect) return true;
                }
            }
            return false;
        },
        
        getActivationData: function(pokemon, mechanicKey) {
            var mech = this.get(mechanicKey);
            if (!mech) return null;
            if (mech.trigger === 'holdItem') {
                if (!pokemon.heldItems) return null;
                for (var i = 0; i < pokemon.heldItems.length; i++) {
                    var data = PMZ.Data.item(pokemon.heldItems[i]);
                    if (data && data.effect === mech.triggerItemEffect) return data;
                }
            }
            return null;
        },
        
        activate: function(pokemon, mechanicKey) {
            if (!PMZ.Config.enableMechanics()) return false;
            var mech = this.get(mechanicKey);
            var data = this.getActivationData(pokemon, mechanicKey);
            if (!mech || !data) return false;
            if ((this._counts[mechanicKey] || 0) >= (mech.maxPerBattle || 1)) return false;
            
            // Save original stats/types for later restoration
            if (!pokemon._mechanicBackup) pokemon._mechanicBackup = {};
            var backup = pokemon._mechanicBackup;
            
            if (!pokemon._activeMechanics) pokemon._activeMechanics = {};
            pokemon._activeMechanics[mechanicKey] = true;
            pokemon._megaEvolved = true;
            
            var suffixField = mech.suffixField || 'suffix';
            var suffix = data[suffixField] || ('-' + mechanicKey);
            pokemon._formSuffix = suffix;
            pokemon._megaForm = suffix;
            
            this._counts[mechanicKey] = (this._counts[mechanicKey] || 0) + 1;
            
            if (mech.overrideTypes && mech.typesField) {
                if (!backup.types) backup.types = pokemon.types ? pokemon.types.slice() : null;
                var types = data[mech.typesField];
                if (types) pokemon.types = types.slice();
            }
            
            var stats = mech.stats || ['attack', 'defense', 'spAttack', 'spDefense', 'speed'];
            var mult = 1 + (mech.statBoost || 0);
            stats.forEach(function(s) {
                if (pokemon[s] !== undefined && backup[s] === undefined) backup[s] = pokemon[s];
                if (pokemon[s]) pokemon[s] = Math.floor(pokemon[s] * mult);
            });
            if (stats.indexOf('hp') >= 0) {
                if (backup.maxHp === undefined) backup.maxHp = pokemon.maxHp;
                if (backup.hp === undefined) backup.hp = pokemon.hp;
                pokemon.maxHp = pokemon.hp;
            }
            
            return true;
        },
        
        clearAll: function(pokemon) {
            if (!pokemon) return;
            if (pokemon._mechanicBackup) {
                var backup = pokemon._mechanicBackup;
                if (backup.types !== undefined) pokemon.types = backup.types;
                ['attack', 'defense', 'spAttack', 'spDefense', 'speed', 'hp', 'maxHp'].forEach(function(s) {
                    if (backup[s] !== undefined) pokemon[s] = backup[s];
                });
                pokemon._mechanicBackup = null;
            }
            pokemon._activeMechanics = null;
            pokemon._megaEvolved = false;
            pokemon._formSuffix = null;
            pokemon._megaForm = null;
        },
        
        clearCounts: function() {
            this._counts = {};
        }
    },
    
    canMegaEvolve: function(pokemon) {
        return this.Mechanics.canActivate(pokemon, 'mega');
    },
    
    getMegaData: function(pokemon) {
        return this.Mechanics.getActivationData(pokemon, 'mega');
    },
    
    megaEvolve: function(pokemon) {
        return this.Mechanics.activate(pokemon, 'mega');
    },
    
    typeEffectiveness: function(attackType, defenderTypes) {
        var mult = 1;
        
        for (var i = 0; i < defenderTypes.length; i++) {
            var def = PMZ.Data.type(defenderTypes[i]);
            if (!def) continue;
            
            if (def.immunities && def.immunities.indexOf(attackType) >= 0) mult *= 0;
            else if (def.resistances && def.resistances.indexOf(attackType) >= 0) mult *= 0.5;
            else if (def.weaknesses && def.weaknesses.indexOf(attackType) >= 0) mult *= 2;
        }
        
        return mult;
    },
    
    calcDamage: function(attacker, defender, moveData) {
        if (!moveData || !moveData.power || moveData.power === 0) return 0;

        var isSpecial = moveData.category === 'special';
        var atkStage = PMZ.Battle.getStatStage(attacker, isSpecial ? 'spAttack' : 'attack');
        var defStage = PMZ.Battle.getStatStage(defender, isSpecial ? 'spDefense' : 'defense');
        var rawAtk = isSpecial ? attacker.spAttack : attacker.attack;
        var rawDef = isSpecial ? defender.spDefense : defender.defense;
        var atkStat = Math.floor(rawAtk * PMZ.Battle.statMultiplier(atkStage));
        var defStat = Math.floor(rawDef * PMZ.Battle.statMultiplier(defStage));

        var level = attacker.level || 50;

        var damage = Math.floor(
            Math.floor(
                Math.floor(2 * level / 5 + 2) * moveData.power * atkStat / defStat
            ) / 50 + 2
        );

        // Critical hit (focus_energy x2, Shell Armor previene, Sniper x2.25)
        var critChance = PMZ.Effects.isMarker(moveData.effect, 'critical_high') ? 0.125 : 0.0625;
        if (PMZ.Battle._focusEnergy && PMZ.Battle._focusEnergy[attacker._battleId]) critChance *= 2;
        var defenderHasShellArmor = defender && PMZ.Abilities && PMZ.Abilities.preventCrit && PMZ.Abilities.preventCrit(defender);
        var isCrit = !defenderHasShellArmor && Math.random() < critChance;
        if (isCrit) {
            var critCtx = { attacker: attacker, defender: defender };
            var critResults = PMZ.Abilities.triggerHook('onCritCheck', critCtx);
            var critMult = 1.5;
            for (var ci = 0; ci < critResults.length; ci++) {
                if (critResults[ci] && critResults[ci].critMult) critMult = critResults[ci].critMult;
            }
            damage = Math.floor(damage * critMult);
        }

        // Modificador de clima (fuego/agua reforzado o debilitado, Solar Beam en sol)
        if (PMZ.Weather && PMZ.Weather._weather !== 'none') {
            var wEffect = PMZ.Weather.getEffect();
            if (moveData.type === 'fire' && wEffect.typeResist && wEffect.typeResist.fire) {
                damage = Math.floor(damage * wEffect.typeResist.fire);
            }
            if (moveData.type === 'water' && wEffect.typeResist && wEffect.typeResist.water) {
                damage = Math.floor(damage * wEffect.typeResist.water);
            }
            if (moveData.key === 'solarbeam' && PMZ.Weather._weather === 'sun') {
                damage = Math.floor(damage * 1.5);
            }
        }

        // STAB: 1.5x, o 2x con Adaptability
        var hasStab = attacker.types && attacker.types.indexOf(moveData.type) >= 0;
        var stab = hasStab ? (PMZ.Abilities.hasEffect(attacker, 'adaptability') ? 2.0 : 1.5) : 1;

        // Type effectiveness
        var typeEff = this.typeEffectiveness(moveData.type, defender.types);

        // Hold items (Choice, tipo, Life Orb)
        damage = PMZ.HoldItems.modifyAttack(attacker, defender, moveData, damage);

        // Random factor
        var random = 0.85 + Math.random() * 0.15;

        damage = Math.floor(damage * stab * typeEff * random);

        if (typeEff === 0) return 0;

        // Ability: type_immunity / type_absorb / levitate / soundproof (defender side)
        var abilityZero = PMZ.Abilities.modifyDefense(attacker, defender, moveData, damage);
        if (abilityZero === 0) return 0;
        damage = abilityZero;

        // Ability: thick_fat (defender): 0.5x damage from fire/ice
        if (PMZ.Abilities.hasEffect(defender, 'thick_fat') &&
            (moveData.type === 'fire' || moveData.type === 'ice')) {
            damage = Math.floor(damage * 0.5);
        }

        // Ability: filter / solid_rock (defender): 0.75x super-effective damage
        if (typeEff > 1 &&
            (PMZ.Abilities.hasEffect(defender, 'filter') || PMZ.Abilities.hasEffect(defender, 'solid_rock'))) {
            damage = Math.floor(damage * 0.75);
        }

        // Ability: tinted_lens (attacker): 2x super-effective damage
        if (typeEff > 1 && PMZ.Abilities.hasEffect(attacker, 'tinted_lens')) {
            damage = Math.floor(damage * 2.0);
        }

        // Ability: technician (attacker): 1.5x for moves with power <= 60
        if (PMZ.Abilities.hasEffect(attacker, 'technician') && moveData.power <= 60) {
            damage = Math.floor(damage * 1.5);
        }

        // Ability: reckless (attacker): 1.2x for recoil moves
        if (PMZ.Abilities.hasEffect(attacker, 'reckless') && moveData.recoil) {
            damage = Math.floor(damage * 1.2);
        }

        // Ability: iron_fist (attacker): 1.2x for punch moves
        if (PMZ.Abilities.hasEffect(attacker, 'iron_fist') && moveData.isPunch) {
            damage = Math.floor(damage * 1.2);
        }

        // Ability: type_boost_low_hp (Overgrow, Blaze, Torrent, Swarm)
        if (attacker.currentHp < attacker.maxHp * 0.33) {
            var abilityBoost = PMZ.Abilities.getAbilityData(attacker, 'type_boost_low_hp');
            if (abilityBoost && abilityBoost.type === moveData.type) {
                damage = Math.floor(damage * abilityBoost.multiplier);
            }
        }

        return Math.max(1, damage);
    },
    
    calcCapture: function(pokemon, ballMultiplier) {
        var a = pokemon.catchRate || 45;
        var hpMax = pokemon.maxHp;
        var hpCur = pokemon.currentHp;
        var statusMul = 1;

        if (pokemon.status === 'sleep' || pokemon.status === 'freeze') statusMul = 2.5;
        else if (pokemon.status) statusMul = 1.5;

        var rate = Math.floor(((3 * hpMax - 2 * hpCur) * a * (ballMultiplier || 1)) / (3 * hpMax) * statusMul);

        if (rate >= 255) return { rate: rate, shakes: 4, captured: true };

        var shake = Math.floor(1048560 / Math.sqrt(Math.sqrt(16711680 / Math.max(1, rate))));
        var shakes = 0;
        for (var i = 0; i < 4; i++) {
            if (Math.floor(Math.random() * 65536) < shake) shakes++;
        }

        return { rate: rate, shakes: shakes, captured: shakes >= 4 };
    }
};

// ============================================================================
// PMZ.Utils
// ============================================================================
PMZ.Utils = {
    capitalize: function(s) {
        if (!s) return '';
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    },
    
    typeColor: function(t) {
        var td = PMZ.Data.type(t);
        return td ? td.color : '#A8A878';
    },
    
    drawTypeBadge: function(contents, typeKey, x, y, w, h) {
        var bmp = PMZ.Data.typeImage(typeKey);
        if (bmp && bmp.isReady()) {
            contents.blt(bmp, 0, 0, bmp.width, bmp.height, x, y, w, h);
        } else {
            var tc = this.typeColor(typeKey);
            contents.fillRect(x, y, w, h, tc);
        }
    },
    
    getConfigText: function(key, fallback) {
        var cfg = PMZ.Data.config();
        if (!cfg || !cfg.textSettings) return fallback;
        return cfg.textSettings[key] || fallback;
    }
};

// ============================================================================
// PMZ.Icons - Carga y cache de iconos de Pokemon desde img/pictures/Gen 1-6 Icons
// ============================================================================
PMZ.Icons = {
    _folder: 'Gen 1-6 Icons',
    _cache: {},
    
    getBitmap: function(id, suffix) {
        if (id == null) id = 'egg';
        suffix = suffix || '';
        var key = String(id) + suffix;
        if (this._cache[key]) return this._cache[key];
        if (key === 'egg') {
            this._cache[key] = ImageManager.loadPicture(this._folder + '/egg');
        } else {
            this._cache[key] = ImageManager.loadPicture(this._folder + '/' + key);
        }
        return this._cache[key];
    },
    
    drawIcon: function(contents, id, x, y, w, h, suffix, onReady) {
        var bmp = this.getBitmap(id, suffix);
        if (bmp.isReady()) {
            contents.blt(bmp, 0, 0, bmp.width, bmp.height, x, y, w, h);
        } else if (!bmp.isError()) {
            // El bitmap carga asincronico: dibuja SOLO el icono cuando este
            // listo (blt directo). No se redibuja el contenedor completo:
            // con listas grandes (pokedex 386) un refresh por carga encadena
            // cientos de refrescos y congela el juego. Los bitmaps que
            // fallaron (icono inexistente) no registran listener, evitando
            // acumular callbacks muertos en cada refresh.
            bmp.addLoadListener(function(loaded) {
                if (contents && loaded && loaded.isReady()) {
                    try { contents.blt(loaded, 0, 0, loaded.width, loaded.height, x, y, w, h); } catch (e) {}
                }
            });
        }
    }
};

// ============================================================================
// PMZ.ItemIcons - Iconos de objetos desde img/pictures/Gen 1-6 Items.
// Cada item puede definir "icon": "nombre" (sin extension) en items.json;
// si no lo define, se intenta con el key del item. Cuando el icono no existe
// en la carpeta (carga fallida), se cae a un fallback de color por tipo.
// ============================================================================
PMZ.ItemIcons = {
    _folder: 'Gen 1-6 Items',
    _cache: {},
    // Keys cuyo archivo no coincide con el nombre del item
    // ("Caña Vieja" -> old-rod, "TwistedSpoon" -> twisted-spoon, ...)
    _aliases: {
        'kingsrock': 'kings-rock',
        'guardspec': 'guard-spec',
        'oldrod': 'old-rod',
        'goodrod': 'good-rod',
        'superrod': 'super-rod',
        'cheriberry': 'cheri-berry',
        'oranberry': 'oran-berry',
        'sitrusberry': 'sitrus-berry',
        'lumberry': 'lum-berry',
        'rawstberry': 'rawst-berry',
        'aspearberry': 'aspear-berry',
        'pechaberry': 'pecha-berry',
        'persimberry': 'persim-berry',
        'chestoberry': 'chesto-berry',
        'leppaberry': 'leppa-berry',
        'redorb': 'red-orb',
        'blueorb': 'blue-orb',
        'upgrade': 'up-grade',
        'twistedspoon': 'twisted-spoon',
        'silverpowder': 'silver-powder',
        'blackglasses': 'black-glasses',
        'deepseatooth': 'deep-sea-tooth',
        'deepseascale': 'deep-sea-scale'
    },
    // Items sin arte en la carpeta; no intentar cargar
    _noArt: { 'miracleberry': true, 'berserkgene': true },

    // "Super Potion" -> "super-potion", "X Attack" -> "x-attack", "Poké Ball" -> "poke-ball"
    _slug: function(str) {
        return String(str || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    iconName: function(key, itemData) {
        var d = itemData || PMZ.Data.item(key);
        if (!d) return null;
        if (d.icon) return d.icon;
        if (this._aliases[key]) return this._aliases[key];
        // TMs/HMs: el archivo se nombra por el tipo del movimiento
        if (d.type === 'tm' || d.type === 'hm') {
            var mv = PMZ.Data.move ? PMZ.Data.move(d.move) : null;
            var mt = (mv && mv.type) ? String(mv.type).toLowerCase() : '';
            if (mt) return (d.type === 'hm' ? 'hm-' : 'tm-') + mt;
        }
        var slug = this._slug(d.name);
        if (slug) return slug;
        return this._slug(key);
    },

    // Devuelve la ruta del archivo (con o sin sufijo -B)
    resolvePath: function(name) {
        var base = 'img/pictures/' + this._folder + '/' + name;
        return base;
    },

    getBitmap: function(key, itemData) {
        var name = this.iconName(key, itemData);
        if (!name) return null;
        if (this._noArt[key]) return null;
        var cacheKey = name;
        if (this._cache[cacheKey]) return this._cache[cacheKey];
        var bmp = ImageManager.loadPicture(this._folder + '/' + name + '-B');
        if (!bmp || !bmp.isReady || bmp.isError()) {
            bmp = ImageManager.loadPicture(this._folder + '/' + name);
        }
        this._cache[cacheKey] = bmp;
        return bmp;
    },

    drawIcon: function(contents, key, itemData, x, y, w, h, onReady) {
        var bmp = this.getBitmap(key, itemData);
        if (!bmp) return;
        if (bmp.isReady()) {
            contents.blt(bmp, 0, 0, bmp.width, bmp.height, x, y, w, h);
        } else if (onReady) {
            bmp.addLoadListener(function() { onReady(); });
        }
    }
};
// ============================================================================
// Hooks a Game_Player - Pasos y encuentros
// ============================================================================
(function() {
    var _increaseSteps = Game_Player.prototype.increaseSteps;
    Game_Player.prototype.increaseSteps = function() {
        _increaseSteps.call(this);
        
        if (PMZ.Encounter.addStep()) {
            $gameTemp._pmzEncounter = true;
        }
    };
    
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        
        if ($gameTemp._pmzEncounter) {
            $gameTemp._pmzEncounter = false;
            this._startPmzEncounter();
        }
    };
    
    // Process daycare eggs each step
    var _Game_Player_increaseSteps = Game_Player.prototype.increaseSteps;
    Game_Player.prototype.increaseSteps = function() {
        _Game_Player_increaseSteps.call(this);
        var party = $gamePMZ ? $gamePMZ.party() : [];
        // Daycare egg hatching
        for (var i = 0; i < party.length; i++) {
            if (party[i] && party[i].isEgg) {
                var close = party[i].hatchSteps && party[i].eggSteps >= party[i].hatchSteps - 100;
                var result = PMZ.Daycare.hatchCheck(party[i]);
                if (result && result.hatched) {
                    var species = party[i].species;
                    var speciesName = (PMZ.Data.pokemon(species) && PMZ.Data.pokemon(species).name) || species;
                    party[i] = result.pokemon;
                    $gameTemp._pmzEggHatched = true;
                    $gameTemp._pmzEggHatchedName = speciesName;
                    $gameTemp._pmzEggHatchedSpecies = species;
                    // Register the hatched Pokemon in the Pokedex (caught + seen)
                    PMZ.Pokedex.registerCaught(species);
                    // Queue notification messages (shown on next free moment)
                    if ($gameMessage) {
                        var hatchedMsg = PMZ.Utils.getConfigText('eggHatchedMsg', '¡{name} salio del huevo!');
                        $gameMessage.add(hatchedMsg.replace(/\{name\}/g, speciesName));
                    }
                } else if (close && !party[i]._crackingNotified) {
                    // Egg is getting close to hatching (last 100 steps) - show message once
                    party[i]._crackingNotified = true;
                    if ($gameMessage) {
                        var crackingMsg = PMZ.Utils.getConfigText('eggCrackingMsg', '¡El huevo se esta agrietando!');
                        $gameMessage.add(crackingMsg);
                    }
                }
            }
            // Happiness gain for walking
            if (party[i] && !party[i].isEgg && !PMZ.Pokemon.isFainted(party[i])) {
                party[i].happiness = Math.min(255, (party[i].happiness || 70) + 1);
            }
        }
        // Safari step tracking
        if ($gamePMZ && $gamePMZ.safariBalls() > 0 && $gamePMZ.safariSteps() > 0) {
            var result2 = PMZ.Safari.stepCheck();
            if (result2.over && !PMZ.Encounter.inBattle) {
                $gamePMZ.setSafariBalls(0);
                $gamePMZ.setSafariSteps(0);
            }
        }
    };
    
    // Day/Night tint on map
    var _Scene_Map_update2 = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update2.call(this);
        if (PMZ.Time && Graphics.frameCount % 120 === 0 && typeof $gameScreen.startTone === 'function') {
            var tint = PMZ.Time.getTint();
            if (tint) {
                $gameScreen.startTone([tint.r - 128, tint.g - 128, tint.b - 128, tint.gray || 0], 60);
            }
        }
    };
    
    Scene_Map.prototype._startPmzEncounter = function() {
        var isSafari = $gamePMZ && $gamePMZ.safariBalls() > 0 && $gamePMZ.safariSteps() > 0;
        var wild = isSafari ? PMZ.Safari.encounter() : PMZ.Encounter.rollWild();
        if (wild && typeof PMZ.Battle !== 'undefined') {
            PMZ.Pokedex.registerSeen(wild.species);
            PMZ.Battle.startWild(wild.species, wild.level);
            if (typeof Scene_PMZ_Battle !== 'undefined') {
                SceneManager.push(Scene_PMZ_Battle);
            }
        }
    };
})();

// ============================================================================
// Replace default MZ menu with Pokemon main menu
// ============================================================================
(function() {
    var _push = SceneManager.push;
    SceneManager.push = function(sceneClass) {
        if (sceneClass === Scene_Menu && typeof Scene_PMZ_MainMenu !== 'undefined' && $gamePMZ) {
            sceneClass = Scene_PMZ_MainMenu;
        }
        _push.call(this, sceneClass);
    };
})();

// ============================================================================
// Boot - Cargar datos al iniciar
// ============================================================================
(function() {
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        
        var params = PluginManager.parameters('PMZ_Core');
        PMZ._params = params;
        
        PMZ.Data.loadAll();
        console.log('[PMZ] Core v' + PMZ.version + ' initialized');
    };
})();

// ============================================================================
// Plugin Command Registration
// ============================================================================
(function() {
    PluginManager.registerCommand('PMZ_Core', 'openCenter', function(args) {
        if (typeof Scene_PMZ_Center !== 'undefined') {
            SceneManager.push(Scene_PMZ_Center);
        }
    });

    PluginManager.registerCommand('PMZ_Core', 'openMart', function(args) {
        if (typeof Scene_PMZ_Shop !== 'undefined') {
            SceneManager.push(Scene_PMZ_Shop);
        }
    });

    PluginManager.registerCommand('PMZ_Core', 'openBag', function(args) {
        if (typeof Scene_PMZ_Bag !== 'undefined') {
            SceneManager.push(Scene_PMZ_Bag);
        }
    });

    PluginManager.registerCommand('PMZ_Core', 'healParty', function(args) {
        PMZ.Party.healAll();
        if ($gameMessage) {
            $gameMessage.add('¡Tus Pokémon han sido curados!');
        }
    });

    PluginManager.registerCommand('PMZ_Core', 'useSurf', function(args) {
        // Triggered by the player (button/action) when adjacent to a water tile.
        // Returns silently with a message if the conditions aren't met.
        if (typeof PMZ === 'undefined' || !PMZ.Overworld) return;
        if (PMZ.Overworld.isSurfing()) {
            // Already surfing — try to dismount
            PMZ.Overworld.endSurf();
            return;
        }
        if (!PMZ.Overworld.hasSurfPokemon()) {
            if ($gameMessage) $gameMessage.add('Ningun Pokemon puede usar Surf.');
            return;
        }
        if (!PMZ.Overworld.isOnWater()) {
            if ($gameMessage) $gameMessage.add('Aqui no hay agua.');
            return;
        }
        PMZ.Overworld.startSurf();
    });

    PluginManager.registerCommand('PMZ_Core', 'giveMoney', function(args) {
        var amount = Number(args.amount) || 0;
        PMZ.Money.add(amount);
    });

    PluginManager.registerCommand('PMZ_Core', 'takeMoney', function(args) {
        var amount = Number(args.amount) || 0;
        PMZ.Money.remove(amount);
    });

    PluginManager.registerCommand('PMZ_Core', 'giveItem', function(args) {
        var key = String(args.itemKey || '').toLowerCase().replace(/\s+/g, '_');
        var amount = Number(args.amount) || 1;
        if (!key) {
            console.warn('[PMZ] giveItem: no itemKey specified');
            return;
    }
    PMZ.Items.add(key, amount);
    var itemName = (PMZ.Data.item(key) && PMZ.Data.item(key).name) || key;
        var cfg = PMZ.Data.config();
        var msg = (cfg && cfg.textSettings && cfg.textSettings.giveItemMsg) || '¡Recibiste {item} x{count}!';
        msg = msg.replace('{item}', itemName).replace('{count}', amount);
        if ($gameMessage) $gameMessage.add(msg);
        console.log('[PMZ] giveItem: ' + key + ' x' + amount);
    });

    PluginManager.registerCommand('PMZ_Core', 'takeItem', function(args) {
        var key = String(args.itemKey || '').toLowerCase().replace(/\s+/g, '_');
        var amount = Number(args.amount) || 1;
        if (!key) {
            console.warn('[PMZ] takeItem: no itemKey specified');
            return;
    }
    PMZ.Items.remove(key, amount);
        var itemName = (PMZ.Data.item(key) && PMZ.Data.item(key).name) || key;
        var cfg = PMZ.Data.config();
        var msg = (cfg && cfg.textSettings && cfg.textSettings.takeItemMsg) || 'Se quitó {item} x{count} de la mochila.';
        msg = msg.replace('{item}', itemName).replace('{count}', amount);
        if ($gameMessage) $gameMessage.add(msg);
        console.log('[PMZ] takeItem: ' + key + ' x' + amount);
    });

    PluginManager.registerCommand('PMZ_Core', 'startSafari', function(args) {
        var type = String(args.type || 'grass').toLowerCase();
        PMZ.Safari.start(type);
        $gamePMZ.setSafariSteps(500);
        $gamePMZ.setSafariBalls(30);
        var result = PMZ.Safari.encounter();
        if (result) {
            PMZ.Battle.startWild(result.species, result.level);
            $gamePMZ._wildPokemon = result;
            SceneManager.push(Scene_PMZ_Battle);
        }
    });

    PluginManager.registerCommand('PMZ_Core', 'daycareDeposit', function(args) {
        var slot = Number(args.slot) || 0;
        var partyIndex = Number(args.partyIndex) || 0;
        var pkmn = $gamePMZ.party()[partyIndex];
        if (pkmn) PMZ.Daycare.deposit(slot, pkmn);
    });

    PluginManager.registerCommand('PMZ_Core', 'daycareWithdraw', function(args) {
        var slot = Number(args.slot) || 0;
        var pkmn = PMZ.Daycare.withdraw(slot);
        if (pkmn) $gamePMZ.party().push(pkmn);
    });

    PluginManager.registerCommand('PMZ_Core', 'daycareCheck', function(args) {
        var p1 = PMZ.Daycare.daycarePokemon(0);
        var p2 = PMZ.Daycare.daycarePokemon(1);
        if (p1 && p2 && PMZ.Daycare.compatible(p1, p2)) {
            $gameTemp._daycareEggReady = true;
            console.log('[PMZ] Daycare: Egg available!');
        } else {
            $gameTemp._daycareEggReady = false;
            console.log('[PMZ] Daycare: No egg');
        }
    });

    PluginManager.registerCommand('PMZ_Core', 'daycarePickupEgg', function(args) {
        var egg = PMZ.Daycare.produceEgg();
        if (egg) {
            var dest = $gamePMZ.addToPartyOrPC(egg);
            if (dest === 'party' && $gameMessage) {
                $gameMessage.add('Recibiste un huevo!');
            } else if (dest === 'pc' && $gameMessage) {
                $gameMessage.add('El huevo fue enviado al PC porque tu equipo esta lleno.');
            }
        }
    });

    PluginManager.registerCommand('PMZ_Core', 'givePokemon', function(args) {
        var species = String(args.species || '').toLowerCase();
        var level = Number(args.level) || 5;
        if (!species) {
            console.warn('[PMZ] givePokemon: no species specified');
            return;
        }
        var pkmn = PMZ.Pokemon.create(species, level);
        if (pkmn && $gamePMZ) {
            var dest = $gamePMZ.addToPartyOrPC(pkmn);
            if (dest === 'party' && $gameMessage) {
                $gameMessage.add('Recibiste a ' + (pkmn.nickname || pkmn.name) + '!');
            } else if (dest === 'pc' && $gameMessage) {
                $gameMessage.add(pkmn.name + ' fue enviado al PC!');
            }
            console.log('[PMZ] givePokemon: ' + species + ' Lv.' + level + ' -> ' + dest);
        }
    });

    PluginManager.registerCommand('PMZ_Core', 'giveEgg', function(args) {
        var species = String(args.species || '').toLowerCase();
        var steps = Number(args.steps) || 0;
        var customMsg = String(args.message || '').trim();
        if (!species) {
            console.warn('[PMZ] giveEgg: no species specified');
            return;
        }
        var egg = PMZ.Daycare.createEgg(species, steps);
        if (egg && $gamePMZ) {
            var dest = $gamePMZ.addToPartyOrPC(egg);
            var baseName = PMZ.Data.pokemon(species);
            var name = baseName ? baseName.name : species;
            if ($gameMessage) {
                if (customMsg) {
                    // Designer provided a custom message - use it (with {name} substitution)
                    $gameMessage.add(customMsg.replace(/\{name\}/g, name));
                } else if (dest === 'party') {
                    var msg = PMZ.Utils.getConfigText('giveEggMsg', 'Recibiste un huevo de {name}!');
                    $gameMessage.add(msg.replace(/\{name\}/g, name));
                } else if (dest === 'pc') {
                    var msgPC = PMZ.Utils.getConfigText('giveEggPcMsg', 'El huevo de {name} fue enviado al PC porque tu equipo esta lleno.');
                    $gameMessage.add(msgPC.replace(/\{name\}/g, name));
                }
            }
            console.log('[PMZ] giveEgg: ' + species + ' -> ' + dest);
        }
    });

    PluginManager.registerCommand('PMZ_Core', 'forceEncounter', function(args) {
        var species = String(args.species || '').toLowerCase();
        var level = Number(args.level) || 5;
        var pkmn;
        if (species) {
            pkmn = PMZ.Pokemon.create(species, level);
        } else if ($gamePMZ && $gamePMZ.party().length > 0) {
            // Pick a random species from encounter data or pokedex
            var enc = PMZ.Data.encounter();
            var allPkmn = [];
            if (enc && enc.byType) {
                for (var t in enc.byType) {
                    var list = enc.byType[t].pokemon || [];
                    for (var i = 0; i < list.length; i++) {
                        if (allPkmn.indexOf(list[i].species) < 0) allPkmn.push(list[i].species);
                    }
                }
            }
            if (allPkmn.length === 0) {
                allPkmn = ['pikachu', 'charmander', 'bulbasaur', 'squirtle', 'pidgey', 'rattata'];
            }
            var randSpecies = allPkmn[Math.floor(Math.random() * allPkmn.length)];
            pkmn = PMZ.Pokemon.create(randSpecies, 5 + Math.floor(Math.random() * 10));
        }
        if (pkmn && typeof PMZ.Battle !== 'undefined') {
            PMZ.Pokedex.registerSeen(pkmn.species);
            PMZ.Battle.startWild(pkmn.species, pkmn.level);
            if (typeof Scene_PMZ_Battle !== 'undefined' && SceneManager) {
                SceneManager.push(Scene_PMZ_Battle);
            }
            console.log('[PMZ] Force encounter: ' + pkmn.species + ' Lv.' + pkmn.level);
        }
    });

    PluginManager.registerCommand('PMZ_Core', 'debugEncounter', function(args) {
        var info = [];
        info.push('--- PMZ Encounter Debug ---');
        info.push('Party count: ' + (PMZ.Party.count ? PMZ.Party.count() : 0));
        info.push('In battle: ' + PMZ.Encounter.inBattle);
        info.push('Steps since last: ' + PMZ.Encounter.stepsSinceLast);
        try {
            info.push('Map name: ' + ($gameMap && $gameMap.displayName ? $gameMap.displayName() : 'N/A'));
            if ($gameMap && $gamePlayer) {
                info.push('Player pos: (' + $gamePlayer.x + ', ' + $gamePlayer.y + ')');
                info.push('Region ID: ' + $gameMap.regionId($gamePlayer.x, $gamePlayer.y));
                info.push('Terrain tag: ' + $gameMap.terrainTag($gamePlayer.x, $gamePlayer.y));
            }
        } catch (e) {
            info.push('Error getting map info: ' + e.message);
        }
        var enc = PMZ.Data.encounter();
        info.push('Encounter data loaded: ' + (enc ? 'yes' : 'no'));
        if (enc) {
            info.push('byMap keys: ' + Object.keys(enc.byMap || {}).join(', '));
            info.push('regionMap keys: ' + Object.keys(enc.regionMap || {}).join(', '));
            info.push('byType keys: ' + Object.keys(enc.byType || {}).join(', '));
        }
        info.forEach(function(line) { console.log('[PMZ] ' + line); });
        if ($gameMessage) {
            $gameMessage.add('Debug info written to console (F8)');
        }
    });

    PluginManager.registerCommand('PMZ_Core', 'pokedexSeenAll', function(args) {
        PMZ.Pokedex.registerAllSeen();
        console.log('[PMZ] Todos los Pokemon marcados como vistos en la Pokedex.');
        if ($gameMessage) {
            $gameMessage.add('Todos los Pokemon han sido registrados en la Pokedex!');
        }
    });

    PMZ.Utils.buildEncounterTable = function(arr) {
        if (!Array.isArray(arr)) return '[]';
        var result = [];
        var totalProb = 0;
        for (var i = 0; i < arr.length && i < 12; i++) {
            var e = arr[i];
            var prob = Number(e.probability) || 0;
            if (prob <= 0) continue;
            totalProb += prob;
            result.push({
                species: String(e.species || 'rattata').toLowerCase(),
                levelMin: Number(e.levelMin) || Number(e.level) || 1,
                levelMax: Number(e.levelMax) || Number(e.levelMin) || Number(e.level) || 1,
                probability: prob
            });
        }
        if (totalProb > 100) {
            var scale = 100 / totalProb;
            for (var i = 0; i < result.length; i++) {
                result[i].probability = Math.round(result[i].probability * scale);
            }
        }
        return JSON.stringify(result);
    };
})();

// ============================================================================
// Game_Player override: auto-offer Surf when player faces a water tile
// ============================================================================
// When the player presses OK while facing a water tile, this auto-triggers
// surf. To use a custom "Show Choices" event instead, set
// `config.pmzAutoSurfPrompt = false` in config.json and call
// `PMZ_Overworld useSurf` from the event's "Yes" branch.
(function() {
    // Preserve original
    if (!Game_Player.prototype._pmzOrigCheckEventTriggerThere) {
        Game_Player.prototype._pmzOrigCheckEventTriggerThere =
            Game_Player.prototype.checkEventTriggerThere;
    }
    Game_Player.prototype.checkEventTriggerThere = function(triggers) {
        // Run the original event check first
        var result = this._pmzOrigCheckEventTriggerThere(triggers);
        if (result) return true;
        // Auto-surf (skip if disabled in config)
        if (typeof PMZ === 'undefined' || !PMZ.Overworld) return false;
        if (PMZ.Config && PMZ.Config.configValue && PMZ.Config.configValue('disableAutoSurfPrompt')) return false;
        // While surfing: pressing OK on land dismounts
        if (PMZ.Overworld.isSurfing()) {
            if (!Input.isTriggered('ok')) return false;
            var d = this.direction();
            var x2 = $gameMap.roundXWithDirection(this.x, d);
            var y2 = $gameMap.roundYWithDirection(this.y, d);
            if (!PMZ.Overworld.isWaterAt(x2, y2)) {
                if (PMZ.Overworld.endSurf()) return true;
                return false;
            }
            return false;
        }
        // On land: check for water in front to start surfing
        if (!PMZ.Overworld.hasSurfPokemon()) return false;
        if (!Input.isTriggered('ok')) return false;
        var d = this.direction();
        var x2 = $gameMap.roundXWithDirection(this.x, d);
        var y2 = $gameMap.roundYWithDirection(this.y, d);
        if (!PMZ.Overworld.isWaterAt(x2, y2)) return false;
        if ($gameMap.boat().pos(x2, y2) || $gameMap.ship().pos(x2, y2)) return false;
        if ($gameMap.eventsXy(x2, y2).length > 0) return false;
        PMZ.Overworld.startSurf();
        return true;
    };
})();

console.log('[PMZ] Plugin loaded: PMZ_Core v' + PMZ.version);