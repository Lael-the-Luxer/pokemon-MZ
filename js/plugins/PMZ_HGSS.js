//=============================================================================
// PMZ_HGSS.js — 2.5D Renderer & Visuals (HeartGold/SoulSilver inspired)
//=============================================================================
/*:
 * @plugindesc v0.6 PMZ HGSS 2.5D Renderer — perspectiva + profundidad
 * @author Anomalyco
 *
 * @help
 * ============================================================================
 * PMZ_HGSS añade efecto de perspectiva 2.5D y escalado por profundidad.
 *
 * 1. CSS perspective en el canvas (solo Scene_Map)
 * 2. Escalado de personajes por posición Y (más arriba = más pequeño)
 *    Usar <no-scale> en nota de evento para excluir (puertas, etc.)
 * 3. Toggle en Opciones del juego (HGSS 2.5D)
 *
 * Requiere: PMZ_Core.js
 * Orden de carga: PMZ_Core > PMZ_Menu > PMZ_Battle > PMZ_HGSS
 * ============================================================================
 *
 * @param enabled
 * @text Habilitado
 * @desc Activar mejoras visuales HGSS
 * @type boolean
 * @default true
 *
 * @param perspectiveDeg
 * @text Grados Perspectiva
 * @desc Ángulo de inclinación CSS (0=plano, 4=sutil, 8=pronunciado)
 * @type number
 * @default 4
 * @min 0
 * @max 15
 * @decimals 1
 *
 * @param scaleDepth
 * @text Escalar por Profundidad
 * @desc Escalar eventos/jugador según altura en pantalla
 * @type boolean
 * @default true
 *
 * @param minScale
 * @text Escala Mínima
 * @desc Tamaño min. en la parte superior (0.70 = 70%, 1.0 = sin efecto)
 * @type number
 * @default 0.85
 * @min 0.6
 * @max 1.0
 * @decimals 2
 *
 * @param smoothCamera
 * @text Cámara Suave
 * @desc Desplazamiento suave de cámara (interpolación)
 * @type boolean
 * @default true
 *
 * @param smoothSpeed
 * @text Velocidad Cámara
 * @desc 0.02 = muy lento, 0.08 = normal, 0.15 = rápido
 * @type number
 * @default 0.08
 * @min 0.02
 * @max 0.2
 */

var PMZ = PMZ || {};

(function() {

    var settings = PluginManager.parameters('PMZ_HGSS');
    var enabled = settings['enabled'] !== 'false';
    var perspectiveDeg = parseFloat(settings['perspectiveDeg'] || 4.0);
    var scaleDepth = settings['scaleDepth'] !== 'false';
    var minScale = parseFloat(settings['minScale'] || 0.85);
    var smoothCamera = settings['smoothCamera'] !== 'false';
    var smoothSpeed = parseFloat(settings['smoothSpeed'] || 0.08);

    PMZ.HGSS = {
        enabled: enabled,
        perspectiveDeg: perspectiveDeg,
        scaleDepth: scaleDepth,
        minScale: minScale,
        smoothCamera: smoothCamera,
        smoothSpeed: smoothSpeed,
        _firstCenter: true,
        _active: false
    };

    if (!enabled) return;

    // ========================================================================
    // 0. Options menu — ConfigManager + Window_Options
    // ========================================================================
    try {
        if (ConfigManager.hgssEnabled === undefined) ConfigManager.hgssEnabled = true;
    } catch(e) { ConfigManager.hgssEnabled = true; }

    try {
        var _WindowOptions_addGeneral = Window_Options.prototype.addGeneralOptions;
        if (typeof _WindowOptions_addGeneral === 'function') {
            Window_Options.prototype.addGeneralOptions = function() {
                _WindowOptions_addGeneral.call(this);
                try {
                    this.addCommand('HGSS 2.5D', 'hgssEnabled', !!ConfigManager.hgssEnabled);
                } catch(e2) {}
            };
        }
    } catch(e) {}

    // ========================================================================
    // 1. PMZ config overrides at boot
    // ========================================================================
    var _SceneBoot_create = Scene_Boot.prototype.create;
    Scene_Boot.prototype.create = function() {
        _SceneBoot_create.call(this);
        try {
            var cfg = PMZ.Data && PMZ.Data._cache && PMZ.Data._cache.config;
            if (cfg && cfg.hgss) {
                var h = cfg.hgss;
                if (h.enabled !== undefined) PMZ.HGSS.enabled = h.enabled;
                if (h.perspectiveDeg !== undefined) PMZ.HGSS.perspectiveDeg = h.perspectiveDeg;
                if (h.scaleDepth !== undefined) PMZ.HGSS.scaleDepth = h.scaleDepth;
                if (h.minScale !== undefined) PMZ.HGSS.minScale = h.minScale;
                if (h.smoothCamera !== undefined) PMZ.HGSS.smoothCamera = h.smoothCamera;
                if (h.smoothSpeed !== undefined) PMZ.HGSS.smoothSpeed = h.smoothSpeed;
            }
        } catch(e) {}
    };

    // ========================================================================
    // 2. CSS Perspective — reactive to ConfigManager
    // ========================================================================
    function syncPerspective() {
        var canvas = Graphics._canvas;
        if (!canvas) return;
        if (PMZ.HGSS._active && ConfigManager.hgssEnabled) {
            var deg = PMZ.HGSS.perspectiveDeg;
            if (deg > 0) {
                canvas.style.transform = 'perspective(1000px) rotateX(' + deg + 'deg)';
                canvas.style.transformOrigin = '50% 0%';
                return;
            }
        }
        canvas.style.transform = '';
        canvas.style.transformOrigin = '';
    }

    var _Graphics_updateCanvas = Graphics._updateCanvas;
    Graphics._updateCanvas = function() {
        _Graphics_updateCanvas.call(this);
        syncPerspective();
    };

    var _SceneMap_create = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function() {
        _SceneMap_create.call(this);
        PMZ.HGSS._active = true;
        PMZ.HGSS._firstCenter = true;
        syncPerspective();
    };

    var _SceneMap_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        _SceneMap_terminate.call(this);
        PMZ.HGSS._active = false;
        syncPerspective();
    };

    var _SceneMap_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _SceneMap_update.call(this);
        syncPerspective();
    };

    // ========================================================================
    // 3. Depth Scaling — scale sprites by screen Y position
    // ========================================================================
    if (scaleDepth) {
        function depthScaleFor(sprite) {
            var screenH = Graphics.boxHeight;
            var y = sprite.y;
            var t = Math.max(0, Math.min(1, y / screenH));
            var s = PMZ.HGSS.minScale + (1 - PMZ.HGSS.minScale) * t;
            if (sprite._character && sprite._character instanceof Game_Event) {
                var note = sprite._character.event().note || '';
                if (note.indexOf('<no-scale>') >= 0) s = 1.0;
            }
            return s;
        }

        var _SpriteChar_updatePosition = Sprite_Character.prototype.updatePosition;
        Sprite_Character.prototype.updatePosition = function() {
            _SpriteChar_updatePosition.call(this);
            if (!PMZ.HGSS._active || !ConfigManager.hgssEnabled) {
                this.scale.x = 1.0;
                this.scale.y = 1.0;
                return;
            }
            var s = depthScaleFor(this);
            this.scale.x = s;
            this.scale.y = s;
        };

        var _SpriteChar_updateVisibility = Sprite_Character.prototype.updateVisibility;
        Sprite_Character.prototype.updateVisibility = function() {
            _SpriteChar_updateVisibility.call(this);
            if (!PMZ.HGSS._active || !ConfigManager.hgssEnabled) {
                this.scale.x = 1.0;
                this.scale.y = 1.0;
                return;
            }
            if (this._character && this._character instanceof Game_Event) {
                var note = this._character.event().note || '';
                if (note.indexOf('<no-scale>') >= 0) {
                    this.scale.x = 1.0;
                    this.scale.y = 1.0;
                }
            }
        };
    }

    // ========================================================================
    // 4. Smooth Camera
    // ========================================================================
    if (smoothCamera) {
        ['scrollDown','scrollLeft','scrollRight','scrollUp'].forEach(function(fn) {
            var orig = Game_Map.prototype[fn];
            Game_Map.prototype[fn] = function() {
                if (!PMZ.HGSS._active || !PMZ.HGSS.smoothCamera || !ConfigManager.hgssEnabled) return orig.call(this);
            };
        });

        var _GamePlayer_update = Game_Player.prototype.update;
        Game_Player.prototype.update = function(sceneActive) {
            _GamePlayer_update.call(this, sceneActive);
            if (!PMZ.HGSS._active || !PMZ.HGSS.smoothCamera || !ConfigManager.hgssEnabled || !$gameMap) return;
            if (PMZ.HGSS._firstCenter) {
                $gameMap._displayX = this._realX - $gameMap.screenTileX() * 0.5;
                $gameMap._displayY = this._realY - $gameMap.screenTileY() * 0.5;
                PMZ.HGSS._firstCenter = false;
            } else {
                var tx = this._realX - $gameMap.screenTileX() * 0.5;
                var ty = this._realY - $gameMap.screenTileY() * 0.5;
                var mw = $gameMap.width() - $gameMap.screenTileX();
                var mh = $gameMap.height() - $gameMap.screenTileY();
                tx = Math.max(0, Math.min(mw, tx));
                ty = Math.max(0, Math.min(mh, ty));
                var speed = PMZ.HGSS.smoothSpeed;
                $gameMap._displayX += (tx - $gameMap._displayX) * speed;
                $gameMap._displayY += (ty - $gameMap._displayY) * speed;
            }
        };
    }

    console.log('[PMZ_HGSS] v0.6 — perspectiva ' + PMZ.HGSS.perspectiveDeg +
        '°, depth scale: ' + PMZ.HGSS.scaleDepth +
        ' (min ' + PMZ.HGSS.minScale + '), cámara suave: ' + PMZ.HGSS.smoothCamera);

})();
