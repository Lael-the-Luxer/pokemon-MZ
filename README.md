# PMZ — Pokémon Essential para RPG Maker MZ

**Versión:** v0.9.8 (Beta Pública)
**Estado del motor:** ✅ Listo para crear contenido (mapas, eventos, historia)
**Faltante para v1.0 final:** Mapa demo + tutoriales + balance de dificultad

## Ficha Técnica

| Métrica | Valor |
|---|---|
| **Plugins** | 3 (`PMZ_Core.js`, `PMZ_Menu.js`, `PMZ_Battle.js`) |
| **Líneas de código** | ~11.400 |
| **Archivos de datos** | 11 JSON (mechanics, items, pokemon, moves, abilities, types, trainers, encounters, config, badges, icons) |
| **Especies Pokémon** | 151 (Gen 1 completa) |
| **Movimientos** | 176 (172 + charm, secretpower, thief, magnitude, powdersnow, ancientpower, magicalleaf) |
| **Objetos** | 134 (balls, medicina, mega piedras, orbes primigenios, hold items, bayas, 50 TMs, 5 HMs, 9 evolution stones, cañas) |
| **Habilidades** | 81 (15+ implementadas en código) |
| **Tipos** | 18 (con tabla de efectividad completa, incluye dark/steel/fairy) |
| **Entrenadores** | 22 (youngster, lass, bug catcher, 8 líderes gimnasio, 4 elite four, campeón, etc.) |
| **Efectos de movimiento implementados** | 63 (recoil, drain, OHKO, multi-hit, fixed damage, trap, weather, etc.) |

## Arquitectura

```
PMZ_Core.js     → Datos, evolución extendida, combate, objetos, equipo, PC,
                   encuentros, estados, habilidades, IA, objetos retenidos,
                   dinero, badges/MOs, Safari, cría, Pokédex, pesca, bayas,
                   género, felicidad, clima, ciclo día/noche, EV/IV, Sprites,
                   sistema de mecánicas de combate (mechanics.json)
PMZ_Menu.js     → Menú de equipo, resumen 5 pestañas, mochila, centro,
                  tienda, equipar, Pokédex con búsqueda, tarjeta entrenador
                  (grid 4x2 de medallas con líderes), PC (cajas),
                  tienda personalizada, filtro horizontal
PMZ_Battle.js   → Escena de batalla (wild/trainer/safari/doble), captura,
                  sprites, fondos, gritos, mega evolución, X-items,
                  clima en batalla, captura one-shot, turno por velocidad,
                  cola de acciones, selección de objetivo, animaciones,
                   63 efectos de movimiento, tracking (Leech Seed, Bind, etc.),
                  encuentro por lista de probabilidades, UI mejorada
```

**Orden de carga obligatorio:** `PMZ_Core.js` → `PMZ_Menu.js` → `PMZ_Battle.js`

## Sistemas Completos

### Núcleo
- Carga asíncrona de 11 JSON desde `PMZ/*.json`
- `$gamePMZ` con persistencia via DataManager
- Party (configurable hasta 99), PC (cajas configurables)
- Sistema de objetos (add/remove/use/has)
- Money system
- Repel y Escape Rope
- `PMZ.Config` para lectura de configuración desde `config.json`

### Batalla
- Máquina de estados step-based (sin setTimeout)
- **Doble batalla 2v2**: 2 Pokémon del jugador + 2 enemigos simultáneamente
  - Ventana de selección de objetivo con `_targetWindow.update()` en el loop principal
  - Cola de acciones ordenada por velocidad (4 participantes) con `_currentAttacker`/`_currentTarget` temporales (no se sobrescriben `_playerPokemon`/`_wildPokemon` globales)
  - AI elige objetivos automáticamente
  - Sprites duales + ventanas HP para ambos bandos
  - **Victoria solo cuando TODOS los enemigos están debilitados** (helper `allEnemiesFainted()`)
  - **Mecánicas (mega/primal) por Pokémon independiente**: cada slot muestra sus propios botones, activa su propio sprite/HP, y marca su acción en la cola
  - **Selección de objetivo para objetos**: al usar un objeto curativo/potenciador en doble batalla, se muestra `_partyWindow` para elegir qué Pokémon recibe el efecto
  - **Selección de objetivo para captura**: al lanzar una Poké Ball en doble batalla salvaje, se muestra `_targetWindow` para elegir qué enemigo capturar
  - **Trainer send-out slot-aware**: cuando un wild faints en doble batalla trainer, el siguiente pokemon del entrenador sale al slot correcto (1 o 2 según cuál esté vacío). Si ambos slots están vacíos, salen 2 nuevos a la vez. Si no quedan reemplazos pero el otro slot está vivo, la batalla continúa 1vN (no termina). `sendNextTrainerPokemon(excludePkmn)` evita duplicados
- Wild, trainer, Safari mode
- **Derrota con teletransporte**: si `healOnDefeat: true` en `config.json`, al perder todos los Pokémon el jugador es teletransportado al último Centro Pokémon donde curó y su equipo es curado automáticamente. Si no hay centro registrado, solo vuelve al mapa
- **Turno por velocidad**: orden de acción determinado por speed stat, empates favorecen al jugador
- Captura con cálculo de rate, shakes, status bonus
- **Captura One-Shot** (configurable): al debilitar, pregunta si capturar
- Movimientos físicos/especiales/status
- STAB, efectividad de tipos (18 tipos con inmunidades)
- Estadísticas de combate (-6 a +6 stages)
- Estados: poison, burn, paralysis, sleep, freeze, confusion
  - **Status pueden causar KO**: el daño de poison/burn/confusion puede llevar al Pokémon a 0 HP (antes un bug hacía que se quedara en 1 HP). Sturdy y Focus Band siguen salvando con 1 HP vía los hooks `preventKO`/`surviveKO`
- **EXP compartida entre participantes** (estilo Gen 6+): cualquier Pokémon que haya salido al campo durante el combate (switch, reemplazo) recibe EXP al terminar la batalla
  - **Pokémon en el campo (killer, slot 1)**: 1.0× EXP base
  - **Otros participantes vivos** (incluido slot 2 en doble batalla): 0.5× EXP base
  - **Pokémon que se debilitaron**: 0 EXP (filtrados por `isFainted`)
  - **Pokémon que nunca salieron al campo**: 0 EXP
  - **EVs**: solo el killer recibe EVs
  - **Level-ups múltiples**: si varios participantes suben de nivel y aprenden movimientos, la escena `Scene_PMZ_MoveLearn` se abre secuencialmente para cada uno (queue unificado `_pendingMoveLearns`)
- **Battle result switches**: los plugin commands de batalla (`startBattle`, `startTrainer`, `startDoubleWild`, `startDoubleTrainer`, `wildEncounterList`) aceptan args `winSwitch`/`loseSwitch`/`fleeSwitch`/`catchSwitch`/`defeatSwitch`/`defeatTarget` para prender switches de MZ según el resultado
  - `winSwitch` ON si ganas
  - `loseSwitch` ON si pierdes
  - `fleeSwitch` ON si huyes
  - `catchSwitch` ON si capturas
  - `defeatSwitch` ON si derrotaste a la especie indicada en `defeatTarget`
  - Todos se limpian automáticamente al iniciar la siguiente batalla (sin stale state entre combates)
  - API JS: `PMZ.Battle.getOutcome()` → `'won'`/`'lost'`/`'fled'`/`'caught'`/`null`, `PMZ.Battle.getResult()` → objeto completo con `defeatedSpecies`
- Objetos retenidos: Leftovers, Life Orb, Choice items, berries, etc.
- **Mecánicas de combate genéricas** (`PMZ.Battle.Mechanics` + `mechanics.json`): sistema que permite definir transformaciones en combate desde JSON. Cada mecánica tiene trigger, statBoost, overrideTypes, suffixField, maxPerBattle
  - **Mega evolución**: 7 mega piedras, +50% stats, cambio de tipo, sprite/icono cambian a forma mega. Límite por combate configurable
  - **Primal Reversión** (Red Orb / Blue Orb): +60% stats, cambio de tipo, sprite/icono específico
  - Crear una nueva mecánica solo requiere editar `mechanics.json` + `items.json` + sprites/iconos con el sufijo correspondiente
- X-items (X Attack, X Defense, X SpAtk, X SpDef, X Speed)
- **41 habilidades** con **orden de activación por prioridad** (entry: Drizzle > Intimidate, contact: Static > Rough Skin)
- IA entrenador con scoring (poder, STAB, tipo, KO bonus, aleatoriedad)
- **Sistema de medallas completo**: 8 líderes de gimnasio definidos en `trainers.json` con campo `badge`. Al vencerlos, el jugador recibe la medalla + dinero automáticamente. Las medallas suben el `levelCap` de obediencia y desbloquean MOs
- Obediencia por medallas (badge cap)
- **Clima**: lluvia, sol intenso, tormenta de arena, granizo
  - Modificadores de daño por tipo (fuego/agua)
  - Daño residual por turno (sandstorm/hail)
  - Inmunidad por tipo
- **Ciclo día/noche**: hora del juego, tintado automático del mapa cada 120 frames
- **63 efectos de movimiento** implementados en `applyMoveEffects()`:
  - **Directos**: poison, toxic, sleep, freeze, burn, paralyze, confuse
  - **Chance**: poison_chance, burn_chance, paralyze_chance, freeze_chance, confuse_chance, flinch_chance, tri_status
  - **Self-status**: confuse_user, user_faint, sleep_absorb
  - **Fixed damage**: fixed_20, fixed_40, level_damage, half_hp, psywave
  - **OHKO**: derrota instantánea si nivel ≥ objetivo
  - **Recoil**: 25% y 33% del daño infligido, crash
  - **Drain**: absorb_half (roba 50% del daño)
  - **Multi-hit**: multi_hit_2 (golpe doble), multi_hit_2_5 (2-5 golpes), multi_hit_2_poison
  - **Trap**: bind (daño 1/16 por turno), leech_seed (drena 1/8 por turno)
  - **Screens**: reflect, light_screen, mist
  - **Stat boosts**: raise_attack, raise_defense, raise_speed_2, raise_evasion, raise_sp_attack, raise_sp_defense, raise_attack_2, raise_defense_2, raise_sp_defense_2
  - **Stat drops**: lower_attack, lower_defense, lower_accuracy, lower_speed_2, lower_sp_defense, lower_defense_2, y versiones con chance
  - **Otros**: recharge, focus_energy, rage, disable, transform, counter, money, reset_stats, substitute
  - **Clima**: weather_rain, weather_sun, weather_sandstorm, weather_hail (invocan clima vía `PMZ.Weather.set()`, 5 turnos de duración)
- **Sistema crítico**: 6.25% base (12.5% critical_high), 1.5x daño, duplica con Focus Energy
- **Tracking de batalla**: Leech Seed, Bind (turnos restantes), Substitute, Disable, Recharge, Focus Energy, Rage, Mist, Light Screen, Reflect, Bide, Protect — almacenado en `PMZ.Battle` keyeado por `_battleId`
- **Animaciones**: `playMoveAnimation(moveData, targetSprite)` usa `Sprite_Animation` nativo de MZ con `$dataAnimations[animId]` y fallback por tipo
- **Sprites**: `PMZ.Sprites.getPath(id, back, suffix)` resuelve la ruta con prioridad configurable:
  - `"bw"` → `img/enemies/Black-White/BW/{id}{suffix} BW.png` (151 sprites)
  - `"frlg"` → `img/enemies/Fire Red- Leaf Green/FRLG/{id}{suffix} FRLG.png`
  - `"auto"` → prueba BW → FRLG → fallback `img/pokemon/`
  - **Sufijo de forma**: soporta `{id}-mega BW.png`, `{id}-mega-x BW.png`, etc. — si no existe el sprite con sufijo, carga el normal (fallback automático)
- **Iconos**: `PMZ.Icons.getBitmap(id, suffix)` carga desde `img/pictures/Gen 1-6 Icons/{id}{suffix}.png`
  - Iconos mega: `6-mega-x.png`, `94-mega.png`, `150-mega-y.png`, etc.

### Menús
- Party: lista, info, stats, mover, usar objeto, equipar/desequipar (multi-slot configurable)
- **Resumen: 5 pestañas horizontales con `Window_PMZ_SummaryTabs`** (Stats, Movimientos, IV/EV, Datos, Info)
  - Pestaña Stats: stats actuales con barras, EXP, HP, género, naturaleza, tipos
  - Pestaña IV/EV: valores individuales (0-31) y de esfuerzo (0-255) por stat
  - Pestaña Datos: habilidad, objeto equipado, felicidad, shiny, sexo, información de evolución
- Mochila con **filtro horizontal compacto** (`Window_PMZ_BagFilter`, 7 columnas)
- Centro Pokémon (cura, guarda posición)
- Tienda (comprar/vender)
- **Tienda personalizada** (`openCustomShop`): precios y stock individuales por objeto, persistencia en `$gamePMZ._shopBought`
- **PC con cajas** (`Scene_PMZ_PC`): navegación de cajas (◀ ▶), 24 cajas, depositar/retirar/soltar/renombrar, lista con ID + nombre + Lv + tipos. Solo accesible por plugin command, NO en menú principal.
- **Pokédex mejorada**: búsqueda por nombre, lista de áreas donde aparece cada especie
  - **Icono al lado del número**: cada entrada muestra el icono del Pokémon (28x28 en lista, 64x64 en detalle)
  - **Detección automática**: marca especies como "Visto" al iniciar combate contra ellas (wild y trainer) y como "Capturado" al capturarlas
  - **Marcadores visuales**: ★ dorado (capturado), ● azul (visto), ○ gris (no visto)
- **Tarjeta Entrenador rediseñada**: grid 4×2 de medallas, cada una con nombre + líder del gimnasio. Las obtenidas en dorado, las faltantes como `???`. Contador `MEDALLAS X/8`

### Mecánicas de Combate (`mechanics.json`)
- Sistema genérico `PMZ.Battle.Mechanics` que permite definir mecánicas de transformación en combate desde JSON
- Cada mecánica tiene: `trigger` (cómo se activa), `statBoost` (multiplicador de stats), `overrideTypes` (cambio de tipo), `suffixField` (sufijo para sprites/iconos), `maxPerBattle` (límite por combate)
- **Mega evolución** es la mecánica por defecto, pero se pueden añadir:
  - **Primal Reversión** (`primal`): mismo sistema, distinto sprite y boost
  - **Ultra Burst** (`ultra`): boost menor, sprite específico
  - **Formas regionales** en combate
  - **Mecánicas inventadas**: cualquier efecto que sea cambio de forma + boost de stats + sprite diferente
- **Stat backup/restore**: `activate()` guarda stats y tipos originales en `_mechanicBackup` antes de modificar; `clearAll()` los restaura al terminar el combate. Evita stats permanentemente infladas
- **Soporte doble batalla**: cada Pokémon en doble batalla puede activar su propia mecánica independientemente. `showFight()` pasa el Pokémon correcto a `setMoves(moves, pkmn)`; `activateMechanic()` usa `_getTargetSprite`/`_getTargetHP` para sprite y HP del slot correspondiente
- Para crear una nueva, solo editas `mechanics.json` + `items.json` (objeto que la activa) + sprites/iconos con el sufijo correspondiente
- Las funciones antiguas `canMegaEvolve`/`getMegaData`/`megaEvolve` ahora delegan en `PMZ.Battle.Mechanics`

### Campo
- MOs: Cut, Fly, Surf, Strength, Flash, Waterfall (con badge check)
- Pesca: 3 cañas (Old/Good/Super Rod), tabla water_fish por método/tipo
- Safari Zone: 500 pasos, 30 Safari Balls, cebo/piedra
- **Cría mejorada**: 
  - 151 especies con grupos huevo
  - Guardería con 2 slots + huevo
  - Herencia de IVs (3 stats aleatorios de padres)
  - **Egg moves**: el padre transmite movimientos huevo al bebé (hasta 4, reemplazan Splash)
  - **Herencia de habilidad**: 80% madre, 20% padre
  - Herencia de naturaleza por Everstone (solo el portador pasa su naturaleza)
  - **Eclosión automática**: cada paso del jugador suma 1 a `eggSteps`; al llegar a `hatchSteps` (2560-3840 aleatorio) eclosiona con notificación `$gameMessage`
  - **Mensaje de "huevo agrietándose"**: se muestra una vez cuando faltan 100 pasos o menos para eclosionar (mensaje configurable)
  - **`giveEgg` plugin command**: NPCs pueden dar huevos sin pasar por la guardería. Acepta `species`, `steps` y `message` (custom con `{name}`, vacío = usar mensaje de `config.json`)
  - **`PMZ.Daycare.createEgg(species, hatchSteps)`**: helper reusable para crear huevos de especies específicas
  - **Mensajes personalizables**: 4 mensajes en `config.json > textSettings` (`giveEggMsg`, `giveEggPcMsg`, `eggCrackingMsg`, `eggHatchedMsg`) — todos con placeholder `{name}`
- Bayas: 9 tipos, consumición automática en batalla (Sitrus Berry, etc.)
- Sprites: sistema de resolución con prioridad (BW → FRLG → default), configurable desde `config.json`
- Gritos: reproduce `audio/se/{id}Cry.ogg` mediante `AudioManager.playSe()`
- Fondos de batalla dinámicos por tipo de Pokémon
- **WildEncounterList**: plugin command con 12 entradas individuales (species, levelMin, levelMax, probability). Las probabilidades son % directos sobre 100; el remanente = sin encuentro. Roll `Math.random() * 100` sin normalizar.
- **Medallas de gimnasio**: 8 líderes definidos en `trainers.json` con campo `badge` (ej: `"badge": "boulder"`). El game designer asigna qué badge da cada líder — al vencerlo en batalla, el jugador recibe la medalla + dinero automáticamente. Las medallas suben el `levelCap` de obediencia y cada una permite usar una MO específica (`PMZ.Badges.canUseHM()`)
- **Mega evolución sprite/icono**: al megaevolucionar en batalla, el sprite del Pokémon y su icono cambian automáticamente a la forma mega (ej: `6-mega-x BW.png`, `6-mega-x.png`). Al terminar el combate se restaura la forma normal. Si el archivo mega no existe, se muestra el sprite normal

### Progresión
- 8 medallas (Boulder → Earth) con límite de nivel
- **Evolución extendida**:
  - Por nivel (tradicional con `_checkLevelEvolution`)
  - Por piedra (thunderstone, firestone, moonstone, leafstone, waterstone)
  - Por intercambio (trade)
  - Por **felicidad** (≥220)
  - Por **objeto equipado** (level up con hold item)
  - Por **belleza** (≥170)
  - Por **movimiento conocido** (saber cierto movimiento al subir nivel)
  - Por **hora del día** (rango de horas configurable con `_checkTimeCondition`)
  - Por **localización** (mapa específico via displayName/terrainTag/regionId)
  - Por **género** (solo macho/hembra)
- **Modo evolución por estadísticas** (configurable `"evolutionMode": "stats"`):
  - El Pokémon evoluciona cuando TODAS sus stats alcanzan el punto medio entre su especie base y la evolución
  - El nivel se oculta de toda la interfaz
- Subida de nivel con re-aprendizaje de movimientos
- **Olvidar movimiento al aprender**: cuando un Pokémon aprende un nuevo movimiento y ya tiene 4 (límite de `battleMovesLimit`), el sistema abre `Scene_PMZ_MoveLearn` para que el jugador elija cuál olvidar (o cancele para no aprender el nuevo)

### Sistema de Pokémon
- **Naturaleza** (±10% a stats, tabla completa 25 naturalezas, `_natureMods` map)
- **EVs**: cada especie otorga EVs específicos al ser derrotada (`_evYields`), `gainEVs()` post-victoria, máx 255/stat, 510 total
- **IVs**: generados aleatoriamente (0-31) en creación, mostrados en resumen
- **Género**: ratio configurable por especie (macho/hembra/sin género) con icono ♂/♀ en resumen
- **Felicidad**: incrementa al caminar, default 70, usada en `checkHappiness()`

## Overworld HMs

### Surf (HM01)

Surf usa el **sistema de vehículos nativo de MZ** (Bote). El sprite del personaje surfeando se configura en la base de datos de MZ (Sistema → Imágenes de vehículos → Bote), por lo que no requiere imágenes externas.

**Requisitos:**
1. Pokémon en el equipo con el movimiento `surf` aprendido.
2. `disableAutoSurfPrompt: false` en `config.json` (default).
3. **Tiles de agua marcados** — el método depende del tileset (ver abajo).

**Marcar tiles como agua (3 opciones):**

| Método | Cuándo usarlo | Cómo |
|---|---|---|
| **Boat passable** (recomendado) | Default. Funciona con todos los tilesets | Abre Database → Tilesets → selecciona el tile de agua → marca la casilla "Boat Passable" (en la sección Passage del editor de tiles) |
| **Terrain Tag 1** | Si el flag de boat no se aplica en tu tileset | Database → Tilesets → selecciona el tile de agua → cambia el "Terrain Tag" a `1` |
| **Terrain Tag 2** | Para agua profunda (deep water, distinta de boat) | Igual pero con tag `2` |

**Configuración (`PMZ/config.json`):**
```json
"surfDetection": "all"  // prueba todos los métodos
"surfDetection": "boat"  // solo boat passable flag
"surfDetection": "terrain1"  // solo terrain tag 1
"surfDetection": "boat_or_ship"  // boat + ship passable
"surfVehicle": "boat",      // "boat" o "ship" — qué vehículo usar al surfear
"surfSpeed": 5,              // velocidad al surfear (4=lenta, 5=media, 6=rápida)
```

**Para tu tileset actual (Outside_A1, donde está el agua):**
1. Abre la Database (F9 en el editor de MZ).
2. Ve a "Tilesets" y selecciona el tileset que uses en tu mapa de agua.
3. Click en la pestaña del bloque que contiene los tiles de agua (típicamente A1 en el set "Outside").
4. Para cada tile visual de agua: en el panel inferior "Passage", marca la casilla **"Boat"**.
5. Guarda. Ahora el plugin detectará el agua correctamente.

**Cómo funciona:**
- El jugador presiona OK frente a un tile de agua → auto-inicia Surf.
- El plugin coloca el vehículo (Bote/Barco) en la tile de agua de enfrente y usa el montaje nativo de MZ (`Game_Player.getOnVehicle()`).
- El jugador **da un paso adelante**, el sprite del personaje se oculta y el sprite del vehículo se muestra.
- Al presionar OK sobre un tile de tierra firme mientras surfeas → te bajas automáticamente.
- El jugador **da un paso adelante** (a tierra), el sprite del personaje reaparece y el vehículo se oculta.
- Velocidad del surf configurable via `surfSpeed` (default 5, más rápido que caminar).

**Uso desde evento (con confirmación):**

```
◆Text: -, None, None
:    El agua brilla con una luz tranquila.
◆Show Choices: Surfear, No
  : Surfear
  ◆Plugin Command: PMZ_Core useSurf
  : No
  ◆
◆
```

**API JS:**
```js
PMZ.Overworld.isOnWater()         // true si el jugador está en agua
PMZ.Overworld.hasSurfPokemon()    // true si la party tiene un pokémon con surf
PMZ.Overworld.isSurfing()         // true si está surfeando
PMZ.Overworld.startSurf()         // intenta subir al bote
PMZ.Overworld.endSurf()           // baja del bote
PMZ.Overworld.getSurfPokemonName() // nombre del primer pokémon con surf
```

**Encuentros en agua:** configurar `encounters.json > mapEncounters > "mapId": { "list": "surf_route24" }` con una lista específica para agua.

## Quick Start — Crear tu primer mapa jugable

El motor está completo. Para crear una primera release jugable, sigue estos pasos:

### 1. Configurar encuentros salvajes (`PMZ/encounters.json`)

Define zonas de captura con listas de probabilidad. Cada mapa que use encuentros debe tener su entry en `mapEncounters` (configurar en RPG Maker via Map Properties → Encounter List o vía script):

```json
"mapEncounters": {
  "1": { "rate": 15, "list": "route1" },
  "2": { "rate": 10, "list": "viridian_forest" }
}
```

Las listas se definen en `lists`. Ver `encounters.json` para ejemplos.

### 2. Crear mapa inicial (starter town)

1. Crea un mapa nuevo (mapa 1) con tileset de pueblo.
2. Coloca un NPC que dé el starter:
   ```
   ◆Plugin Command: PMZ_Menu learnMove partyIndex=0 move=tackle
   ◆Plugin Command: PMZ_Core givePokemon species=charmander level=5
   ◆Text: -, None, None
   :    Elegiste a Charmander!
   ```
3. Coloca un NPC rival con equipo predefinido (3 Pokémon level 5).

### 3. Configurar entrenador (`PMZ/trainers.json`)

```json
"rival_demo": {
  "name": "Rival Blue",
  "class": "Rival",
  "money": 100,
  "team": [
    { "species": "squirtle", "level": 5 },
    { "species": "pidgey", "level": 4 }
  ]
}
```

Llama con `startTrainer trainerId="rival_demo"`.

### 4. Centro Pokémon y Tienda

Coloca un objeto "Centro Pokémon" en el mapa. Evento:
```
◆Plugin Command: PMZ_Core openCenter
```

Tienda: `PMZ_Core openMart`. Items en stock definidos en `config.json > shop`.

### 5. TMs como recompensa

```
◆Plugin Command: PMZ_Menu giveTM tm=tm13 amount=1
◆Text: -, None, None
:    Recibiste TM13 (Ice Beam)!
```

El jugador lo usa desde la mochila → selecciona Pokémon → aprende el movimiento.

### 6. Evoluciones por piedra

En el mapa, coloca un NPC que regale piedras:
```
◆Plugin Command: PMZ_Core giveItem itemKey=firestone amount=1
```

El jugador la usa desde la mochila → selecciona Pokémon → evoluciona.

### 7. Guardar y publicar

1. Crea un evento "Save" en el mapa (RPG Maker nativo).
2. Asegúrate de que los 3 plugins estén activados en orden.
3. Build → Web/Windows.
4. Distribuye.

### 8. Branching por resultado de batalla (switches)

Los plugin commands de batalla aceptan args para prender switches según el resultado:

```
◆Plugin Command: PMZ_Battle startBattle
   - species: mewtwo
   - level: 70
   - winSwitch: 10      → enciende switch 10 si ganas
   - loseSwitch: 11     → enciende switch 11 si pierdes
   - catchSwitch: 12    → enciende switch 12 si capturas a Mewtwo
   - defeatSwitch: 13   → enciende switch 13 si derrotas a Mewtwo específicamente
   - defeatTarget: mewtwo
◆Conditional Branch: Switch [0010: Won] is ON
   ◆Text: -, None, None
   :     ¡Venciste a Mewtwo!
   ◆
: End
```

Los switches se limpian automáticamente al iniciar la siguiente batalla — no hay stale state. Para limpiar manualmente (sin empezar batalla): `PMZ_Battle resetBattleResult`.

**Uso avanzado (script call) en condiciones:**
- `PMZ.Battle.getOutcome() === 'won'` — true si la última batalla se ganó
- `PMZ.Battle.getResult().defeatedSpecies` — array de especies derrotadas en la última batalla
- `PMZ.Battle.getResult().capturedSpecies` — especie capturada (o null)

### Checklist de release v1.0

- [ ] Starter event funcional
- [ ] 1 ruta con 5+ encuentros salvajes
- [ ] 1 Centro Pokémon accesible
- [ ] 1 Tienda (Poke Mart)
- [ ] 1-2 NPCs entrenadores con `startTrainer`
- [ ] 1-2 NPCs que den items (Potion, Poké Ball)
- [ ] 1 TM como recompensa de gimnasio
- [ ] Save point accesible
- [ ] Texto introductorio / historia breve
- [ ] Beta testing por 1-2 personas

## Plugin Commands

| Plugin | Comando | Descripción |
|---|---|---|
| `PMZ_Core` | `startSafari` | Inicia Zona Safari |
| `PMZ_Core` | `openCenter` | Abre Centro Pokémon |
| `PMZ_Core` | `openMart` | Abre Tienda |
| `PMZ_Core` | `openBag` | Abre Mochila |
| `PMZ_Core` | `healParty` | Cura todo el equipo (en español) |
| `PMZ_Core` | `useSurf` | Surfea o baja del agua. Auto-detecta condiciones. Usar desde un evento "Show Choices" si quieres confirmación previa |
| `PMZ_Core` | `giveMoney`/`takeMoney` | Añade/quita dinero |
| `PMZ_Core` | `giveItem`/`takeItem` | Añade/quita objetos (itemKey, amount). Muestra mensaje configurable desde `config.json > textSettings > giveItemMsg/takeItemMsg` |
| `PMZ_Core` | `daycareDeposit`/`Withdraw`/`Check`/`PickupEgg` | Cría |
| `PMZ_Core` | `giveEgg` | Da un huevo de una especie (al equipo o PC). Args: species, steps (opcional, 0 = aleatorio 2560-3840), message (opcional, custom con {name} o vacío para usar el de `config.json > textSettings > giveEggMsg`) |
| `PMZ_Core` | `givePokemon` | Da un Pokémon al equipo/PC. Args: species, level. Si la party está llena, va al PC automáticamente |
| `PMZ_Menu` | `openParty` | Abre equipo |
| `PMZ_Menu` | `openSummary` | Abre resumen de un Pokémon |
| `PMZ_Menu` | `openPokedex` | Abre Pokédex |
| `PMZ_Menu` | `learnMove` | Enseña un movimiento a un Pokémon del equipo. Si tiene 4 (límite), abre `Scene_PMZ_MoveLearn` para elegir cuál olvidar. Args: partyIndex (0-5), move (key del movimiento) |
| `PMZ_Menu` | `giveTM` | Da un TM/MO al jugador. Args: tm (key, ej: "tm13"), amount (opcional, default 1) |
| `PMZ_Menu` | `openTrainerCard` | Abre tarjeta entrenador con grid 4×2 de medallas |
| `PMZ_Menu` | `openPC` | Abre PC (cajas de almacenamiento) |
| `PMZ_Menu` | `openCustomShop` | Tienda con precios y stock personalizados (12 entradas) |
| `PMZ_Battle` | `wildEncounterList` | Encuentro wild por lista de probabilidades (12 entradas). Acepta `winSwitch`/`loseSwitch`/`fleeSwitch`/`catchSwitch`/`defeatSwitch`/`defeatTarget` para prender switches según el resultado |
| `PMZ_Battle` | `startBattle` | Inicia combate wild (species, level). Acepta `winSwitch`/`loseSwitch`/`fleeSwitch`/`catchSwitch`/`defeatSwitch`/`defeatTarget` (0 = desactivado). Ej: si el rival es Mewtwo y quieres prender switch 13 al derrotarlo: `startBattle species=mewtwo level=70 defeatSwitch=13 defeatTarget=mewtwo` |
| `PMZ_Battle` | `startTrainer` | Inicia combate entrenador (trainerId). Si el entrenador tiene `"class": "Gym Leader"` y campo `badge`, al vencerlo se otorga la medalla automáticamente. Mismos switch args que `startBattle` |
| `PMZ_Battle` | `startDoubleWild` | Inicia combate doble wild (species1, level1, species2, level2). Mismos switch args que `startBattle` |
| `PMZ_Battle` | `startDoubleTrainer` | Inicia combate doble entrenador. Mismos switch args que `startBattle` |
| `PMZ_Battle` | `resetBattleResult` | Limpia el estado del último combate (outcome + switches). Útil si necesitas reiniciar la lógica entre batallas sin un `startBattle` previo |

## Configuración (`PMZ/config.json`)

```json
{
  "evolutionMode": "level",       // "level" | "stats"
  "captureMode": "weak",           // "weak" | "oneshot"
  "healOnDefeat": true,            // true = al perder teletransporta al último Centro Pokémon y cura el equipo
  "enableMechanics": true,         // true = permite mecánicas de combate (mega, primal, etc.)
  "equipSlots": 1,                 // slots de objeto que puede tener cada Pokémon
  "maxPartySize": 6,
  "battleMovesLimit": 4,
  "startingMoney": 3000,
  "spriteStyle": "auto",           // "auto" | "bw" | "frlg"
  "martItems": [...],
  "textSettings": {
    "giveItemMsg": "¡Has recibido {item} x{count}! Se ha añadido a la mochila.",
    "takeItemMsg": "Se ha quitado {item} x{count} de la mochila.",
    "giveEggMsg": "Recibiste un huevo de {name}!",
    "giveEggPcMsg": "El huevo de {name} fue enviado al PC porque tu equipo esta lleno.",
    "eggCrackingMsg": "¡El huevo se esta agrietando!",
    "eggHatchedMsg": "¡{name} salio del huevo!"
  }
}
```

## Estado vs Pokémon Essentials (RMXP)

| Mecánica | PE | PMZ | Estado |
|---|---|---|---|
| Batalla 1v1 | ✅ | ✅ | 100% |
| Batalla doble 2v2 | ✅ | ✅ | 100% |
| Movimientos (datos) | ✅ 900+ | ✅ **169** (+4 clima: Danza Lluvia, Día Soleado, Tormenta Arena, Granizo) | Añadir JSON |
| **Efectos de movimiento** | ✅ 100+ | ✅ **63** (+4 weather: rain, sun, sandstorm, hail) | **~80%** |
| **Habilidades** | ✅ 300+ | ✅ 41 + orden por prioridad | **100%** |
| **Clima** | ✅ Completo | ✅ Sol, lluvia, tormenta, granizo + daño residual + inmunidad + movimientos para invocarlos | **100%** |
| **Día/Noche** | ✅ | ✅ Tintado automático de mapa | **100%** |
| Objetos retenidos | ✅ 100+ | ✅ 18 + berries + multi-slot configurable | **100%** |
| **EV/IV system** | ✅ Completo | ✅ EV training post-victoria, IV gen, caps 255/510 | **100%** |
| **Naturaleza** | ✅ ±10% stats | ✅ 25 naturalezas | **100%** |
| **Género** | ✅ | ✅ Ratio por especie, ♂/♀ en UI | **100%** |
| **Felicidad** | ✅ | ✅ Por caminar, evolución por happiness | **100%** |
| Estados | ✅ 8 | ✅ 6 (poison, burn, sleep, freeze, paralyze, confuse) | **80%** |
| **Status pueden KO** | ✅ | ✅ | **100%** |
| **EXP compartida entre participantes** | ✅ | ✅ 1.0× killer / 0.5× otros, EVs al killer | **100%** |
| **Battle result state (script + switches)** | ✅ | ✅ `getOutcome()` + 5 switch args + defeat target | **100%** |
| Captura | ✅ Completo | ✅ + modo one-shot configurable | **100%** |
| **Evolución** | ✅ level, stone, trade, time, happiness, location, move, beauty, item, gender | ✅ Todos + **modo stats** (oculta nivel) | **100%** |
| **Cría** | ✅ egg moves, IV inherit, ability inherit | ✅ egg moves, IV inherit (3 stats), ability inherit (80/20), Everstone | **100%** |
| Safari Zone | ✅ | ✅ | **100%** |
| MOs campo | ✅ | ✅ eventos MZ requeridos | **100%** |
| **Pokédex** | ✅ búsqueda, área, formas | ✅ búsqueda, área, iconos 28x64, marcadores visto/capturado, lista 151 | **95%** |
| **Menú resumen** | ✅ 5 pestañas | ✅ **5 pestañas** (Info, Stats con barras, Moves, IV/EV, Data) | **100%** |
| **Animaciones** | ✅ Motor completo | ✅ Via `Sprite_Animation` nativo MZ + fallback por tipo | **Nuevo: 80%** |
| **Sistema crítico** | ✅ | ✅ 6.25% base, 1.5x, Focus Energy duplica | **100%** |
| **Selección objetivo objetos (doble batalla)** | ✅ | ✅ `_partyWindow` para curas/boost, `_targetWindow` para captura | **100%** |
| **Sprites** | ✅ empaquetados | ✅ Carga desde BW/FRLG con fallback configurable | **100%** |
| Mapas/Eventos | ✅ Incluidos | ❌ Game designer | N/A |

## Veredicto

PMZ es un **motor al ~80%** del total de las mecánicas de Pokémon Essentials (el ~20% restante es battle depth — hazards/terrain/switch mid-battle/items in battle — y AI competitivo). Las mecánicas base —naturaleza, EVs, IVs, clima, día/noche, género, felicidad, evolución extendida, cría con egg moves, captura one-shot, Pokédex con búsqueda, doble batalla funcional (incluido trainer send-out slot-aware), 63 efectos de movimiento, animaciones, críticos, tracking de batalla, EXP compartida, status KO con Sturdy semantics correctas, battle result switches, sprites desde BW/FRLG— **ya están implementadas y configurables desde JSON**.

Lo que lo separa de PE ahora:

1. **Battle depth** (hazards, terrain, switch mid-battle, items in battle, +30 status) — v0.9.9
2. **Más efectos de movimiento** (~40 efectos por implementar: two-turn attacks, semi-invulnerable, etc.)
3. **Más habilidades** (~260 por añadir a JSON, 15+/81 implementadas)
4. **AI competitivo** (actualmente scoring básico)
5. **Contenido del game designer** (mapas, eventos, animaciones de MZ)

Para el game designer: con los 3 plugins + 11 JSONs + sprites/sonido en las rutas correctas, ya tienes un juego Pokémon funcional con las mecánicas base completas de PE. **Sin escribir código.**

## Problemas Solucionados (Bugfixes)

| Issue | Solución |
|---|---|
| **Tarjeta Entrenador: TypeError** | Reemplazado `Window_Selectable` por `Window_Base` + `Window_Command` "Volver" |
| **Resumen en blanco** | Corregido orden de creación de ventanas, eliminado try-catch que ocultaba errores |
| **Resumen congelado al cambiar pestaña** | `_tabWindow.activate()` añadido en todos los `show*()` después de seleccionar pestaña |
| **Mochila: filtros solapados** | `Window_PMZ_BagFilter` rediseñado: 7 columnas horizontales, y=48. Filtro se oculta tras seleccionar |
| **Menú principal: TypeError al cancelar** | Restaurado `onCancel` faltante con `SceneManager.pop()` |
| **Batalla: TypeError en animación** | `playMoveAnimation()` corregido: pasa Array `[targetSprite]` y `$dataAnimations[animId]` data object |
| **Batalla: enemigo no atacaba** | Root cause: TypeError en `playMoveAnimation()` durante enemy turn. Resuelto + añadido guard `_enemyStep` |
| **Party: refresh no se disparaba** | `$gameTemp._pmzPartyRefresh` flag seteado/consumido en party, bag, item use, equip |
| **PC: congelado tras depositar/retirar** | Command window auto-shown después de cada operación |
| **WildEncounterList: sin encuentro** | Probabilidades son % directo sobre 100. Suma < 100 = posibilidad de no encuentro |
| **Mega evolución: sprite no cambiaba** | Sistema genérico `PMZ.Battle.Mechanics` creado. Mega evolución ahora delega en él. Soporta `_formSuffix` para sprites/iconos |
| **Mega evolución hardcodeada** | Migrada a `mechanics.json` + `PMZ.Battle.Mechanics`. Cualquier mecánica custom (primal, ultra, formas) se añade solo con JSON |
| **Dinero de entrenador: bug** | `$gamePMZ.gainMoney()` no existe → corregido a `$gamePMZ.addMoney()`. Usaba `tData.reward` → corregido a `tData.money` |
| **Líder de gimnasio: sin medalla** | Añadido campo `badge` a cada líder en `trainers.json`. Al vencerlos, otorga la medalla automáticamente + muestra mensaje |
| **Equip freeze (Scene_PMZ_Party)** | Ventanas de equipo/desequipar/objeto se crean una vez en `create()` y se reutilizan con `hide()`/`show()` en vez de crear instancias cada vez |
| **Item-use return bug** | `onItemOk()` ahora activa `_commandWindow` antes de `SceneManager.push(Scene_PMZ_ItemUse)` para que el menú responda al volver |
| **Damage calc: hold items ignorados** | `calcDamage()` ahora llama a `PMZ.HoldItems.modifyAttack()` para que Choice Band/Specs, Life Orb y type boost items funcionen |
| **Flee freeze (segunda huida)** | `updateFlee()` ahora llama a `trainerEndBattle()` para limpiar estado de batalla (`_wildPokemon`, `_playerPokemon`, mecánicas) igual que victory/defeat |
| **Party selection freeze (batalla)** | Eliminado `_waitCount` al seleccionar el mismo Pokémon o uno debilitado en `onPartyOk()` |
| **Mega sprite no persistía al huir** | `PMZ.Battle.Mechanics.clearAll()` se ejecuta en `trainerEndBattle()` para restaurar forma base al terminar el combate |
| **Mega stats permanentes** | `Mechanics.activate()` guarda stats/tipos originales en `_mechanicBackup` antes de modificar; `clearAll()` los restaura |
| **Congelado al seleccionar mismo Pokémon en batalla (Party)** | `processOk()` de `Window_Selectable` llama a `deactivate()` antes del handler; añadido `_partyWindow.activate()` en los early returns de `onPartyOk()` |
| **Doble batalla: congelado al seleccionar objetivo** | `_targetWindow.update()` faltaba en el loop principal de `Scene_PMZ_Battle.update()` — la ventana nunca procesaba input OK/Cancel |
| **Doble batalla: victoria prematura** | Todos los checks de victoria ahora usan `allEnemiesFainted()` que verifica ambos enemigos |
| **Doble batalla: cola pisaba `_playerPokemon`** | `_executeNextAction()` ahora usa `_currentAttacker`/`_currentTarget` temporales en vez de modificar `PMZ.Battle._playerPokemon`/`_wildPokemon` |
| **Doble batalla: `showFight()` mostraba siempre moves del Pokémon 1** | `showFight()` y `onFightOk()` detectan si `_playerAction` ya está seteado y usan `_playerPokemon2` para el segundo slot |
| **Doble batalla: mecánicas por slot** | `setMoves(moves, pkmn)` recibe el Pokémon; `activateMechanic()` usa `_getTargetSprite`/`_getTargetHP`; mecánicas marcan `{ _mechanic: true }` en la cola |
| **Doble batalla: objetos curativos/potenciadores** | `onBagOk()` almacena `_itemTargetPending` y muestra `_partyWindow` para elegir el Pokémon objetivo. `onPartyOk()` ejecuta `useHealItemOn()`/`useBattleItemOn()` sobre el seleccionado, refrescando su HP con `_getTargetHP(target)`. Cancelar retorna a la bolsa |
| **Doble batalla: captura con Poké Ball** | `onBagOk()` almacena `_captureTargetPending` y reutiliza `_targetWindow` para elegir qué enemigo capturar. `tryCapture(key, data, target)` recibe el objetivo explícitamente. Cancelar retorna a la bolsa |
| **Derrota: teletransporte al Centro Pokémon** | `checkDefeat()` y el check de "no Pokemon" setean `_defeatOccurred`. `updateEndBattle()` verifica `PMZ.Config.healOnDefeat()` y si está activo, usa `$gamePlayer.reserveTransfer()` al último centro guardado + `PMZ.Party.healAll()`. Configurable desde `config.json` |
| **Movimientos de clima añadidos** | `raindance`, `sunnyday`, `sandstorm`, `hail` añadidos a `moves.json` (IDs 166-169). `applyMoveEffects()` maneja los efectos `weather_rain/sun/sandstorm/hail` llamando a `PMZ.Weather.set()` + mensaje. `_applyWeatherDamage()` actualizado para doble batalla (todos los Pokémon). `_endTurnWeather()` eliminado (lógica inline duplicada) |
| **Pokédex: detección automática trainer** | `startTrainer()` ahora llama a `PMZ.Pokedex.registerSeen()` para cada Pokémon del equipo del entrenador al iniciar combate |
| **Pokédex: iconos y marcadores** | `Window_PMZ_PokedexList.drawItem()` muestra icono 28x28 + marcador (★/●/○) + ID + nombre. Detail window muestra icono 64x64 + estado (Capturado/Visto) + tipos + descripción |
| **Pokédex: registrar captura al recibir Pokémon** | `addToPartyOrPC()` ahora llama a `PMZ.Pokedex.registerCaught()` al añadir un Pokémon al equipo o PC, así los Pokémon regalados por NPCs (vía `givePokemon` plugin command) aparecen como capturados en la Pokédex |
| **Guardería: huevo se perdía si party llena** | `daycarePickupEgg` ahora usa `addToPartyOrPC()` para enviar el huevo al PC si la party está llena, con mensaje informativo |
| **Guardería: notificación de eclosión** | `Game_Player.increaseSteps` ahora añade `$gameMessage.add('¡X salio del huevo!')` cuando un huevo eclosiona; también se setea `$gameTemp._pmzEggHatchedName` por si la game UI lo quiere leer |
| **Guardería: lógica Everstone rota** | `produceEgg` antes asignaba `father.nature` por default y luego lo reasignaba. Ahora: solo el padre con Everstone pasa su naturaleza; si ninguno tiene, se queda la naturaleza aleatoria |
| **Guardería: código muerto abilitySlot** | Línea `var abilitySlot = Math.random() < 0.8 ? 0 : 0;` siempre asignaba 0. Removida |
| **Guardería: return type inconsistente en hatchCheck** | Antes retornaba `false` si no era huevo, ahora retorna `{ hatched: false }` uniformemente |
| **Plugin command `giveEgg`** | Nuevo: `giveEgg species="charmander" steps="0"` — crea un huevo y lo añade al equipo/PC. Helper `PMZ.Daycare.createEgg(species, hatchSteps)` reusable |
| **Huevos: mensajes personalizables** | Añadidos 4 mensajes a `config.json > textSettings`: `giveEggMsg`, `giveEggPcMsg`, `eggCrackingMsg`, `eggHatchedMsg`. Todos usan `{name}` para el nombre de la especie. `giveEgg` plugin command acepta `message` arg para override por evento |
| **Eclosión: registro automático en Pokédex** | Al eclosionar un huevo, `PMZ.Pokedex.registerCaught()` se llama con la especie, marcando el Pokémon como capturado/visto en la Pokédex |
| **Aprendizaje de movimientos: cambio por elección** | `learnNewMoves` antes hacía `p.moves.shift()` silencioso al llegar al límite. Ahora retorna `{learned, pending}` y los pendientes pueden resolverse vía `Scene_PMZ_MoveLearn`. `replaceMove(p, idx, newMove)` y `moveLimit()` añadidos como helpers. Plugin command `learnMove partyIndex=0 move=flamethrower` lo activa |
| **Captura con party llena: Pokémon se perdía** | `_onCaptureYesNo` usaba `PMZ.Party.add()` que retorna `false` silenciosamente al estar llena la party, perdiendo el Pokémon. Ahora usa `addToPartyOrPC()`: si hay espacio va al equipo, si no va al PC con mensaje "fue enviado al PC" |
| **Inconsistencia `maxPartySize` entre funciones** | `addToPartyOrPC` chequeaba `party.maxSize \|\| 6` (propiedad inexistente en el Array, siempre caía a 6), mientras que `PMZ.Party.add/isFull` leían `config.json > maxPartySize`. Con `maxPartySize: 3` o `: 12`, la función ignoraba el config. Ahora las 3 referencias leen `PMZ.Data.configValue('maxPartySize')` consistentemente |
| **Evolución/breeding solo miraba slot 0** | `Evolution.checkItem` y `Daycare.produceEgg` solo chequeaban `heldItems[0]`. Con `equipSlots > 1`, un Everstone en slot 1+ no se detectaba para heredar naturaleza en cría. Ahora ambas iteran el array completo con `indexOf()` |
| **Bayas: data duplicada entre JSON y JS** | `PMZ.Berries._data` tenía hardcoded `{cheri, chesto, pecha, ...}` mientras `items.json` ya tenía los mismos datos en `cheriberry`, `chestoberry`, etc. con campos `berryCure`/`berryHeal`. La data JSON se ignoraba. Refactorizado: bayas se leen 100% de `items.json` (`berryCure`, `berryHeal`, `berryHealPercent`, `berryHealPp`, `berryThreshold`, `berryConfuses`). El campo `_legacyData` se mantiene solo como fallback para berries custom en JS |
| **Hold items: branches hardcoded por nombre** | `modifyAttack`/`speedMultiplier`/`afterAttack` usaban `if (data.effect === 'choice_band')`, `=== 'choice_specs'`, `=== 'choice_scarf'`. Ahora todos comparten `effect: "choice"` y se diferencian por `data.stat` (`attack`/`spAttack`/`speed`). La data en `items.json` se simplificó, el código se redujo de 3 branches a 1 |
| **4 hold items en JSON pero ignorados por el código** | `quick_claw`, `kings_rock`, `focus_band`, `bright_powder` estaban en `items.json` con `chance`/`flinchChance`/`evasionMult` pero el código no los aplicaba. Ahora: Quick Claw da first-strike (20%) en la cola; King's Rock aplica flinch (10%) al objetivo; Focus Band salva del KO con 1 HP (10%); Bright Powder multiplica la evasión (1.1x). Todo data-driven desde JSON |
| **Accuracy de movimiento ignorada** | El campo `accuracy` en `moves.json` no se chequeaba — los movimientos siempre acertaban. Añadido `PMZ.Battle.checkHit(attacker, defender, moveData)` que usa `move.accuracy` + accuracy/evasion stat stages + Bright Powder evasion mult + No-Guard ability. Aplicado en player attack y enemy attack. Ahora movimientos de 70 acc fallan 30%, etc. |
| **Never-miss flag nunca se copiaba al Pokémon** | 5 lugares creaban moves con `accuracy: md.accuracy \|\| 100`, lo cual rompía el `accuracy: 0` (Swift era tratado como 100%). Ahora todos los call sites usan `md.accuracy !== undefined ? md.accuracy : 100` y copian también `neverMiss: !!md.neverMiss`. Aplicado en `assignMoves`, `learnNewMoves`, `replaceMove`, `gainExp/level-up`, `learnMove` plugin command, `Transform`, `Mimic`, `createEgg moves` |
| **`accuracy: 0` no distinguía never-miss de 100%** | Swift estaba como `accuracy: 100` aunque el canon dice que ignora evasión. Añadido flag `neverMiss: true` en JSON. `checkHit` ahora chequea `moveData.neverMiss === true` **antes** del cálculo, y también acepta `accuracy: 0` como legacy. Swift actualizado: `{"accuracy": 0, "neverMiss": true}`. Para añadir Aerial Ace, Shock Wave, Vital Throw, etc. solo se necesita `{"effect": "...", "neverMiss": true}` en moves.json |
| **Magical Leaf no estaba nunca** | Move Gen 2 añadido a `moves.json` (id 176, Grass, 60 BP, special, `neverMiss: true`, accuracy 0) — útil como "never-miss" example de movimiento de daño puro. Total ahora 176 moves |
| **40 habilidades huérfanas en `abilities.json`** | 40 abilities estaban en JSON (`sandveil`, `rivalry`, `magicguard`, `tintedlens`, `sturdy`, `filter`, `moldbreaker`, `adaptability`, `sniper`, `technician`, `reckless`, `ironfist`, `rockhead`, `soundproof`, `scrappy`, `sturdy`, `shellarmor`, `magicguard`, `swift_swim`, `cloud_nine`, `overcoat`, `hydration`, `chlorophyll`, etc.) sin lógica en `PMZ.Abilities`. Añadidas las 40 entries (total ahora 81) y verificado que no haya huérfanas |
| **Ability logic no implementada en código** | 15+ abilities ahora funcionales en `calcDamage`, `Status.tick`, `_applyWeatherDamage`, `_processLeechSeed`, `_processBindDamage`: `thick_fat` (0.5x fire/ice), `filter`/`solid_rock` (0.75x super-efectivo), `tinted_lens` (2x super-efectivo), `adaptability` (STAB 1.5→2x), `sniper` (crit 1.5→2.25x), `technician` (1.5x moves ≤60 BP), `reckless` (1.2x recoil moves), `iron_fist` (1.2x punch), `mold_breaker` (bypass type_immunity/absorb/levitate), `soundproof` (bloquea sound moves), `scrappy` (normal/fighting hits ghost), `sturdy` (sobrevive KO con 1 HP), `shell_armor`/`battle_armor` (no crits), `rock_head` (no recoil), `magic_guard` (no daño indirecto: poison/burn/weather/leech/bind/confusion-self), `cloud_nine` (cancela weather), `swift_swim`/`chlorophyll` (speed ×2 en rain/sun), `sand_rush`/`slush_rush` (speed ×2 en sandstorm/hail), `hydration` (cura status en rain), `overcoat`/`safety_goggles` (immune weather) |
| **Nature system: solo texto en summary** | `PMZ.Pokemon._natureMods` ya tenía los 25 natures y `natureModifier` aplicaba 1.1/0.9 en `calculateStats`, pero el visual en summary era solo el nombre. Ahora el tab "Info" del summary muestra `↑Atk`/`↓Vel` con colores verde/rojo al lado del nombre, y el texto incluye los modificadores. Helper `PMZ.Pokemon.natureUpDown(nature)` añadido para integraciones |
| **Evolution stones incompletos** | Solo 5 stones (Fire/Water/Thunder/Leaf/Moon) en `items.json`. Añadidos 4 más: `sunstone` (35), `duskstone` (36), `dawnstone` (37), `shinystone` (38). Total ahora 9 evolution stones. Los nuevos son para evoluciones Gen 2-4 — sin efecto en este proyecto (solo Gen 1), pero quedan listos si se expande el Pokédex |
| **TM system inexistente** | No había TMs en `items.json`. Implementado el sistema completo: 50 TMs (Gen 1-3 style) + 5 HMs ya existentes (Surf, Cut, Fly, Strength, Flash) + handler en `PMZ.Items.useItem` que enseña el movimiento al Pokémon objetivo. Si el Pokémon tiene slot libre, aprende directo; si está lleno, abre `Scene_PMZ_MoveLearn` y solo consume el TM al olvidar. Helpers añadidos: `PMZ.Pokemon.canLearn(p, moveKey)` (chequea level-up, egg moves, y `tmMoves` array con fallback por tipo si no está definido), `PMZ.Pokemon.teachMove(p, moveKey)` (centraliza la lógica de enseñar). Plugin command `giveTM tm="tm13" amount="1"` para entregar TMs como recompensa |
| **TMs referenciaban moves inexistentes** | 29 TMs apuntaban a moves Gen 2-4 que no están en `moves.json`. Redirigidos a alternativas existentes: TM01→submission, TM02→slash, TM03→watergun, TM04→meditate, TM08→growth, TM09→razorleaf, TM10/TM40→swift, TM12→screech, TM17→barrier, TM19→megadrain, TM20→mist, TM21→rage, TM23→bite, TM27→doubleedge, TM30→nightshade, TM31→seismictoss, TM34→thundershock, TM36→sludge, TM39→rockthrow, TM41→disable, TM42→takedown, TM45→charm, TM46→payday, TM47→wingattack, TM48→transform, TM49→thief, TM50→fireblast. 3 moves nuevos añadidos a `moves.json` (charm, secretpower, thief) para cubrir los huecos |
| **Filtro mochila sin categoría TMs/MO** | El filtro horizontal tenía 8 columnas (Todos/Bolas/Medicina/Bayas/Equipar/Campo/Evol/Objetos). Añadida categoría "TMs" entre "Campo" y "Evol", "Objetos" renombrado a "Otros". `maxCols` actualizado a 9. Ahora los 50 TMs + 5 HMs aparecen en su propia categoría y también en "Todos" |
| **`learnMove` plugin command duplicaba lógica de inserción** | El command tenía su propio código de insert move en vez de delegar a un helper central. Refactorizado para usar `PMZ.Pokemon.teachMove(p, moveKey)` que retorna `{success, learned, needReplace, msg}`. Misma lógica que usa el item-use path, evitando divergencia futura |
| **HM Surf: no había integración overworld** | `hmsurf` existía como item y enseñaba el movimiento, pero el jugador no podía surfear en el mapa. Implementado `PMZ.Overworld` con `isOnWater()`, `hasSurfPokemon()`, `isSurfing()`, `startSurf()`, `endSurf()`. Usa el montaje nativo de MZ (`getOnVehicle`/`getOffVehicle`) para el vehículo configurado en Database → Sistema → Imágenes de vehículos. El jugador da un paso adelante, el sprite se oculta y reaparece al bajar. Velocidad configurable (`surfSpeed`) y opción de usar Barco en vez de Bote (`surfVehicle`). Auto-trigger en `Game_Player.checkEventTriggerThere` con auto-dismount. Plugin command `PMZ_Core useSurf` para usar desde un evento con Show Choices. Config flag `disableAutoSurfPrompt` en `config.json` |
|:---|---|
| **Surf: "Aqui no hay agua" estando frente al agua** | `isOnWater()` chequeaba la tile del jugador en vez de la tile de enfrente. Cambiado a `roundXWithDirection` para detectar el agua correctamente |
| **Huevo: error `undefined.png` al abrir menú** | `PMZ.Icons.getBitmap` no manejaba `id: null/undefined` de los huevos. Añadido `if (id == null) id = 'egg'` para cargar `egg.png` |
| **Pokédex: congelada al seleccionar un Pokémon** | `Window_Selectable.processOk()` llama `deactivate()` nativamente, dejando la lista inactiva sin responder a input. `PokedexList.processOk()` overridden para omitir el `deactivate()` |
| **Huida fallida: juego congelado** | `tryFlee()` cambiaba a `_state = 'opponentAttack'` sin ocultar la ventana de comandos. Al volver a `playerCommand`, `updatePlayerCommand()` no detectaba el cambio y la ventana quedaba desactivada. Añadido `_cmdWindow.hide()` en ambos branches de `tryFlee()` |
| **Cuerda Huida (Escape Rope) usable en batalla** | Nuevo handler en `onBagOk()` para `effect: 'escape'`: consume el item y huye del combate (excepto vs entrenadores). Filtro `showBag()` ampliado para mostrar items con `effect: 'escape'` independientemente de su tipo. En overworld: ahora teletransporta al último Centro Pokémon + cura al equipo |
| **Pokédex: celda vacía si no se ha visto el Pokémon** | Cuando `!seen`, el detail window retorna temprano y solo muestra '???' — no intenta cargar icono ni dibujar datos del Pokémon no avistado |
| **Tienda: freeze en buy path** | `Scene_PMZ_Shop.onItemOk` ahora llama `_listWindow.activate()` en TODOS los paths de compra (exitoso, sin stock, sin dinero, item inválido). Mismo patrón que el fix de Pokédex: `processOk()` desactivaba nativamente y la ruta de compra no reactivaba. Venta delega a `onSell()` que sí reactiva |
| **Status (poison/burn/confusion) inmortalizaban al Pokémon** | `PMZ.Status.tick` aplicaba el daño con `Math.max(1, ...)` que forzaba HP mínimo a 1 — un Pokémon con 1 HP y quemado/envenenado nunca podía morir, solo se quedaba en 1 HP para siempre. Cambiado a `Math.max(0, ...)` y agregados los hooks `PMZ.HoldItems.surviveKO()` y `PMZ.Abilities.preventKO()` después del daño para que Sturdy/Focus Band/Focus Sash sigan salvando con 1 HP |
| **EXP solo iba al último Pokémon en el campo** | Cualquier participante anterior (los que entraron al campo y se fueron por switch o KO) no recibía EXP. Sistema de tracking de participantes agregado a `PMZ.Battle` (`_participants`/`addParticipant`/`getParticipants`), hooks en los 6 puntos donde un Pokémon del jugador entra al campo (startWild/StartTrainer/StartDoubleWild/StartDoubleTrainer/onPartyOk/checkDefeat). Distribución: 1.0× al killer, 0.5× a otros participantes vivos, 0 a fainted/no-participant. EVs solo al killer. Queue unificado `_pendingMoveLearns` para manejar level-ups múltiples con `Scene_PMZ_MoveLearn` |
| **No había forma de branch en eventos según el resultado de batalla** | Plugin commands de batalla aceptaban solo args del combate, sin output al game state. Añadidos 6 args a `startBattle`/`startTrainer`/`startDoubleWild`/`startDoubleTrainer`/`wildEncounterList`: `winSwitch`/`loseSwitch`/`fleeSwitch`/`catchSwitch`/`defeatSwitch` (todos `@type switch`, 0 = desactivado) + `defeatTarget` (string, e.g. `"mewtwo"`). State layer en `PMZ.Battle` con `_result`/`_resultSwitches`/`_defeatedThisBattle`/`_battleInitialSpecies`. `applyResultSwitches` limpia los switches configurados antes de prender el correcto (sin stale state entre batallas). Nuevo plugin command `resetBattleResult` para limpieza manual. API JS: `getOutcome()`/`getResult()`/`clearResult()` |
| **3 typos en pokemon.json referenciaban moves inexistentes** | `furysattack` (doduo/dodrio) → `furyattack`; `takeedown` (tauros) → `takedown`; `megaplunch` (kangaskhan) → `megapunch`. 0 invalid move refs ahora |
| **3 moves faltantes en moves.json** | `magnitude` (id 173, ground 80 BP), `powdersnow` (id 174, ice 40 BP freeze_chance), `ancientpower` (id 175, rock 60 BP) añadidos. Total ahora 175 moves |
| **pokemon.json muy verboso (7889 líneas / 121 KB)** | Reformat a single-line arrays y objects para los campos no-canon (moves, types, abilities, eggGroups, baseStats, evYields). 58% reducción de líneas, 24% reducción de tamaño. 3291 líneas / 91.5 KB. JSON válido, cobertura de campos intacta |
| **Wild HP mostrando "??" en batalla** | `Window_PMZ_WildHP.refresh()` (PMZ_Battle.js línea 630) leía `p.currentHp` y `p.maxHp` sin validar — si un Pokémon salvaje era creado sin estos campos (p. ej. datos incompletos del JSON), el cálculo `curHp / maxHp` daba `NaN` y se renderizaba como "??". Añadido defensive guard: `var curHp = (typeof p.currentHp === 'number' && !isNaN(p.currentHp)) ? p.currentHp : 0; var maxHp = (typeof p.maxHp === 'number' && !isNaN(p.maxHp) && p.maxHp > 0) ? p.maxHp : 1;`. Aplica también a los slots de doble batalla |
| **Sturdy salvaba de quemadura/veneno en 1 HP** | Bug grave: `PMZ.Abilities.preventKO()` se llamaba desde `Status.tick` (poison/burn) y desde el confusion self-hit, así que un Pokémon con Sturdy a 1 HP recibía Quemadura y se "salvaba" con 1 HP por Sturdy — sin posibilidad de morir de status. **Fix:** Sturdy/Focus Band/Focus Sash hooks eliminados de `Status.tick` (PMZ_Core.js: poison línea 660, burn línea 678, confusion línea 724). Sturdy reactivado solo en attack flow con `wasFullHp` requirement: `PMZ.Abilities.preventKO(target, wasFullHp)` ahora requiere `wasFullHp === true` (capturado como `wasFullHp1`/`wasFullHp2` ANTES del daño en PMZ_Battle.js líneas 2111/2332). Resultado: status siempre puede KO, Sturdy solo salva de attacking moves y solo si el target estaba a full HP |
| **Oponente atacaba varias veces por turno (Leech Seed/Bind end-of-turn)** | Los efectos end-of-turn (weather, leech seed, bind, bide) en `updateOpponentAttack` step 3 terminaban con `break;` sin reasignar `this._state` — quedaba en `'opponentAttack'` con `_enemyStep=0`, así que el frame siguiente el oponente "atacaba" otra vez con un step 0 (ataque vacío) antes de que la cola se re-ejecutara. **Fix:** nuevo helper `_resolveEndTurnState()` (PMZ_Battle.js líneas 1663-1686) que decide el próximo state tras end-of-turn: `trainerSendOut` (trainer battle + enemigos fainted), `victory` (wild + enemigos fainted), `defeat` (player fainted), o `playerCommand` (sino). Aplicado a weather/línea 2424, leech seed/línea 2452, bind/línea 2464, bide/línea 2476 |
| **Trainer send-out: nueva variable de timer** | `updateTrainerSendOut` decrementaba `this._trainerNextTimer` (inexistente) en vez de `this._enemyNextTimer` — el handler nunca disparaba, y el segundo Pokémon del trainer nunca salía. Renombrado en PMZ_Battle.js línea 3454-3456. La variable la setean los triggers al detectar fainted (líneas 2184, 2209, 2403) |
| **Trainer battle: victoria prematura con segundo Pokémon vivo** | `updatePlayerAttack` step 3 chequeaba `if (!target \|\| PMZ.Pokemon.isFainted(target))` en CADA step, no solo al inicio. Cuando step 2 mataba al target y step 3 corría con `target` ya fainted, la condición `allEnemiesFainted()===true` (asumía erróneamente que ambos enemigos estaban KO) se cumplía y forzaba transición a `'victory'` ANTES de que el switch de case 3 evaluara `trainerSendOut`. **Fix:** el early fainted check ahora solo se ejecuta cuando `this._attackStep === 0` (línea 2045-2052). Mismo fix preventivo aplicado a `updateOpponentAttack` con `this._enemyStep === 0` (línea 2242-2245) |
| **Battle result switches no se activaban** | `applyResultSwitches` usaba `$gameSwitches._data[id] = true` — pero `_data` empieza como `[]` (length 0), por lo que `id < $.length` siempre era false y el switch nunca se seteaba. **Fix:** reemplazado por `$gameSwitches.setValue(id, true)` (PMZ_Core.js), que sí valida con `$dataSystem.switches.length`. Ahora win/lose/flee/catch/defeat switches se prenden correctamente tras la batalla |
| **`defeatTarget` se perdía entre batallas** | `setBattleSwitches` copiaba `winSwitch`/`loseSwitch`/etc. al nuevo `_resultSwitches` pero NO copiaba `_defeatTargetKey`, por lo que `applyResultSwitches` nunca encontraba el target a matchear. **Fix:** añadido `if (sw._defeatTargetKey !== undefined) { this._resultSwitches._defeatTargetKey = sw._defeatTargetKey; }` para preservar el string del target entre batallas |
| **`startDoubleTrainer` plugin command: llamaba a `startTrainer` (1v1)** | El plugin command `startDoubleTrainer` (PMZ_Battle.js:3892) llamaba a `PMZ.Battle.startTrainer(trainer)` en vez de `PMZ.Battle.startDoubleTrainer(trainer)`. Resultado: aunque el evento decía "double trainer", la batalla se configuraba como 1v1 — `_wildPokemon2` y `_playerPokemon2` nunca se asignaban, y `_doubleBattle` quedaba en `false`. **Fix:** cambiado el call site a `startDoubleTrainer`. Ahora el comando `startDoubleTrainer` sí configura los 2 slots |
| **Trainer send-out: solo 1 pokemon en batalla doble, 3º+ no aparecía** | En batalla doble, cuando el jugador KOeaba al último wild en field, el `trainerSendOut` handler solo enviaba UN nuevo pokemon al slot `_wildPokemon` (nunca al slot `_wildPokemon2`). Si ambos wild estaban fainted, el slot 2 quedaba vacío y la batalla continuaba 1v2 con un slot fantasma. Además, el "next" pokemon podía ser el mismo que ya estaba en slot 2 (duplicado). **Fix:** refactor de `sendNextTrainerPokemon(excludePkmn)` (PMZ_Core.js:3523) que ahora solo retorna el siguiente pokemon vivo (sin auto-setear `_wildPokemon`) y acepta un `exclude` para evitar duplicados. `updateTrainerSendOut` (PMZ_Battle.js:3475) reescrito: chequea `slot1Empty`/`slot2Empty` y envía 1 o 2 nuevos pokemon al slot correcto, excluyendo al pokemon del otro slot. Si no quedan más reemplazos pero el otro slot sigue vivo, continúa 1vN (no victory) |
| **Trainer send-out: `console.log` diagnostic** | En `sendNextTrainerPokemon` y `updateTrainerSendOut` se añadieron logs de debug con el estado de los slots y qué pokemon se envió. Útiles para verificar que el flujo de reemplazos funciona en batallas dobles |

## Mejoras UI Recientes

| Componente | Cambio |
|---|---|
| **Tienda Pokemon: layout reorganizado** | Header 60px (título dorado + dinero + línea separadora) → Lista 384px (~8 items a 44px) → Detalle 120px (3 líneas: nombre grande, precio+stock+hint, mensaje de transacción) → Comandos 60px (horizontal 1×3: Comprar/Vender/Salir). Lista muestra nombre+precio+stock inline; rojo si sin dinero, gris si agotado. Detalle usa colores: dorado para precios, verde para OK, rojo para errores, gris para hints |
| **Tienda: filtro de TMs/HMs en venta** | `onSell` ahora ignora keys con prefijo `tm`/`hm` o `data.type === 'tm'`, evitando que el jugador venda TMs/HMs del inventario |
| **Tienda: mensajes de transacción** | Campo `_msgText`/`_msgColor` con auto-clear al cambiar item o modo. Comprado/Vendido/Sin stock/Sin dinero se muestran en línea 3 del detalle (verde/rojo) en vez de sobrescribir el detalle del item |
| **HP windows (batalla)** | Más grandes (68px alto, 42% ancho, opacidad 180) |
| **Command/moves windows** | 44px item height, 24px font |
| **Move type badges** | Fill de color según tipo con texto blanco |
| **Battle bag** | 32px item height, name + x count + description |
| **Battle party panel** | 40px item height, mini HP bars |
| **Safari command** | 44px items, 24px font |
| **Message window** | 22px font, blanco |
| **Wild sprite** | Escala 1.3 → 1.1 (más lejano), y=100 |
| **Player HP window** | y `0.60` → `0.56` |
| **Wild HP window** | Movido a y=4 |
| **Summary sprite** | 40px más a la izquierda (`x = Graphics.boxWidth - 260`) |
| **Summary layout** | Header 48px, tabs en `boxHeight - 48`, contenido fill `boxHeight - 96` |
| **PC list** | 2 columnas, 48px items, muestra #ID + name + Lv + type badges |
| **PC commands** | 5 columnas horizontales, 36px items, compacto en parte inferior |
| **Bag filter** | Horizontal 7 columnas, itemHeight 30, 16px font |
| **Party list** | `maxItems()` = `Math.max(2, party.length)` — oculta slots vacíos |
| **Equip auto-return** | `Scene_PMZ_EquipSelect` auto-pops tras 500ms en equip exitoso |
| **Mega sprite/icono** | Al megaevolucionar, el sprite de batalla cambia a `{id}{suffix} BW.png` y el icono a `{id}{suffix}.png`. Al terminar combate se restaura la forma normal |
| **Tarjeta entrenador rediseñada** | Grid 4×2 de medallas — nombre + líder del gimnasio. Obtenidas en dorado con líder visible, faltantes como `???` en gris. Contador `MEDALLAS X/8`. Main menu muestra `MEDALLAS X/8` |
| **Mecánicas de combate** | Sistema genérico `PMZ.Battle.Mechanics` + `mechanics.json`. Mega evolución migrada. Cualquier mecánica custom (primal, ultra, etc.) se añade solo con JSON |
| **Party held-item badge** | `Window_PMZ_PartyList.drawItem()` muestra una "M" dorada para megastones, "E" azul para hold items normales |
| **Mega/primal sprite/icono** | Al activar una mecánica, sprite e icono cambian a la forma con sufijo (`-mega`, `-primal`, etc.). Al terminar combate se restaura la forma base |
| **Botones de mecánica dinámicos** | `Window_PMZ_BattleFight` lee `mechanics.json` y muestra un botón por cada mecánica que el Pokémon pueda activar — sin strings hardcodeadas |
| **Doble batalla: selección objetivo funcional** | `_targetWindow` añadido al `update()` del Scene; `_targetSelectStep` avanza a 1 en vez de resetearse a 0 cada frame |
| **Doble batalla: jugador 2 muestra moves correctos** | `showFight()` y `onFightOk()` resuelven qué Pokémon está actuando (`_playerPokemon` vs `_playerPokemon2`) |
| **Doble batalla: cola no corrompe referencias** | `_currentAttacker`/`_currentTarget` temporales en `_executeNextAction`; `_playerPokemon`/`_playerPokemon2` globales intactos entre turnos |
| **Doble batalla: selección objetivo para objetos** | `useHealItemOn()`/`useBattleItemOn()` toman un `target` explícito; `onPartyOk()` detecta `_itemTargetPending` y redirige al uso indicado |
| **Doble batalla: selección objetivo para captura** | `_targetWindow` reutilizado para elegir enemigo al lanzar bola; handlers reemplazados temporalmente durante la captura |
| **Doble batalla trainer: send-out slot-aware** | `updateTrainerSendOut` (PMZ_Battle.js:3475) detecta `slot1Empty`/`slot2Empty` y envía 1 o 2 nuevos pokemon al slot correcto, excluyendo duplicados. Si no quedan reemplazos pero el otro slot sigue vivo, continúa 1vN. `sendNextTrainerPokemon(excludePkmn)` refactorizado para retornar sin auto-setear `_wildPokemon` |
| **Doble batalla trainer: 2 pokemon simultáneos al KOear ambos** | Si el jugador KOea ambos wild en el mismo turno, el trainer envía 2 nuevos pokemon a la vez (uno a cada slot). Mensaje combinado: "Pidgey salio al combate! Caterpie salio al combate!" |
| **Doble batalla trainer: continuar 1vN si no quedan más** | Cuando el trainer no tiene más pokemon para enviar pero el otro slot sigue vivo, la batalla continúa con 1 wild vs 2 del jugador (no victory). Solo termina cuando ambos slots están vacíos y el trainer no tiene reemplazos |
| **Derrota con teletransporte** | `_defeatOccurred` flag + `$gamePlayer.reserveTransfer()` al último centro + cura automática. Configurable con `healOnDefeat` en `config.json` |
| **EXP compartida entre participantes** | Mensaje combinado: "Pidgey gano 7 EXP! Pikachu gano 14 EXP! Subio a Lv7!" — los participantes anteriores (los que salieron al campo y se fueron) reciben 0.5× mientras que el killer recibe 1.0×. Si varios suben de nivel con nuevos moves, la escena MoveLearn se abre secuencialmente para cada uno |
| **Battle result switches** | 5 nuevos args en los comandos de batalla (`winSwitch`/`loseSwitch`/`fleeSwitch`/`catchSwitch`/`defeatSwitch`/`defeatTarget`) más plugin command `resetBattleResult`. Los switches se limpian automáticamente al iniciar la siguiente batalla (sin stale state). UI de MZ plugin manager muestra dropdowns de switches directamente en el editor de eventos |

## Lo que NO incluye (y está bien que no incluya)

Esto es un **plugin**, no un juego completo. El game designer debe proveer:

- Sprites en `img/enemies/Black-White/BW/` (ya incluidos en el repo) o `img/pokemon/`
- Sprites de formas alternativas: `{id}-mega BW.png`, `{id}-mega-x BW.png`, `{id}-primal BW.png`, etc. (si se usan mecánicas custom)
- Iconos de formas alternativas: `{id}-mega.png`, `{id}-mega-x.png`, `{id}-primal.png`, etc.
- `audio/se/{id}Cry.ogg` … `151Cry.ogg` — gritos
- `audio/bgm/` — música de batalla, gimnasio, centro
- Mapas en el editor RPG Maker MZ
- Eventos de gimnasios, NPCs, guardería, centro, tienda
- Animaciones en la base de datos de MZ (`$dataAnimations`)

## Estado del Motor y Roadmap

### ✅ Listo para v0.9.8 Beta pública
El motor está completo y estable. Se puede crear contenido, mapas, eventos y publicar una primera versión jugable.

### Roadmap hacia v1.0 Final

**v0.9.7 — Polish Beta Pública (entregada)**
- ✅ Motor completo, todas las mecánicas Gen 1 jugables
- ✅ TM system (50 TMs + 5 HMs)
- ✅ Evolution stones (9, incluyendo Gen 2-4 para expansión futura)
- ✅ Nature system con visual ↑↓
- ✅ Hold items (Choice, Life Orb, Type-boost, Quick Claw, King's Rock, Focus Band, Bright Powder, Leftovers)
- ✅ Abilities (81 entries, 15+ implementadas en código)
- ✅ **Status pueden causar KO** (fix del bug de inmortalidad)
- ✅ **Sturdy/Focus Band semantics correctas** (wasFullHp requirement + solo attacking moves)
- ✅ **EXP compartida entre participantes** (estilo Gen 6+)
- ✅ **Battle result switches** (branching de eventos por resultado)
- ✅ pokemon.json 100% cobertura canónica (12/12 campos), 0 invalid refs

**v0.9.8 — Battle depth & state machine (ahora)**
- ✅ **Doble batalla funcional end-to-end**: `startDoubleTrainer` plugin command, slot-aware trainer send-out, ambos wild pueden ser reemplazados
- ✅ **Trainer send-out slot-aware**: detecta `slot1Empty`/`slot2Empty`, envía 1 o 2 nuevos pokemon al slot correcto, excluye duplicados, continúa 1vN si no quedan reemplazos
- ✅ **Sturdy/Focus Band semantics correctas** (wasFullHp requirement + solo attacking moves)
- ✅ **Leech Seed/Bind end-of-turn state machine** (helper `_resolveEndTurnState()`, evita double-attack bug)
- ✅ **Battle result switches robustos** (`$gameSwitches.setValue()` fix + `defeatTarget` preservation)
- ✅ Wild HP defensive guard (fix "??")
- ✅ 176 moves (incluido magicalleaf como never-miss example)

**v0.9.8 — Polish visual + AI (1-2 semanas)**
- [ ] AI mejorado (move scoring, switch logic básico)
- [ ] Stat change visualization (popup +Atk)
- [ ] Type effectiveness indicator en summary
- [ ] Ability description tooltip
- [ ] Pinch berries (Liechi, Salac, Petaya, Ganlon)
- [ ] 10-15 abilities más (intimidate, huge_power, drought, drizzle, etc.)
- [ ] Egg moves y tmMoves en pokemon.json (datos)

**v0.9.9 — Battle depth (2-3 semanas)**
- [ ] Switch Pokémon (free switch, mid-battle)
- [ ] Items in battle (X-items, status heals)
- [ ] Field hazards (Spikes, Stealth Rock)
- [ ] Terrain (Electric, Grassy, Misty, Psychic)
- [ ] Status extendido (Toxic, Encore, Taunt, Attract, Curse)

**v1.0 — Final release (4-6 semanas)**
- [ ] 30+ abilities implementadas (más usadas en competitivo)
- [ ] AI competitivo (Showdown-style)
- [ ] Held items completos (Assault Vest, Eviolite, Rocky Helmet, Red Card)
- [ ] Battle animations pack
- [ ] 2+ mapas demo completos
- [ ] Documentación para usuarios
- [ ] Video tutorial de setup

### Métricas del motor (no datos)
- **Battle core:** 98% (state machine + Leech/Bind end-of-turn fix + early victory guard + slot-aware trainer send-out + double battle trainer funcional)
- **Items engine:** 90%
- **Stats/Calcs:** 90% (gainExp con level-up + newMoves queue)
- **Evolution engine:** 90%
- **Type system:** 95%
- **Berry engine:** 90%
- **Weather:** 80%
- **Breeding:** 70%
- **Held items en batalla:** 72% (Focus Band/Sturdy saves con wasFullHp semántica correcta, solo attacking moves)
- **Status conditions:** 85% (KO bug arreglado, Sturdy/Focus Band no triggerean desde status)
- **EXP distribution:** 90% (shared con participantes, EVs al killer, queue de move learns)
- **Abilities engine:** 25% (15+/81 implementadas)
- **AI:** 20%
- **UI/UX polish:** 55%
- **TOTAL MOTOR:** ~80%

### Para expandir a Gen 2+
Los 4 nuevos evolution stones (Sun, Dusk, Dawn, Shiny) ya están listos. Solo falta:
1. Añadir las especies Gen 2+ a `pokemon.json`
2. Definir sus evoluciones con los stones ya configurados
3. Ampliar `moves.json` con los moves nuevos
4. (Opcional) Implementar las abilities específicas

No requiere cambios de código.
