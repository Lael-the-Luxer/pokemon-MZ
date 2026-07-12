# PMZ — Pokémon Essential para RPG Maker MZ

## Ficha Técnica

| Métrica | Valor |
|---|---|
| **Plugins** | 3 (`PMZ_Core.js`, `PMZ_Menu.js`, `PMZ_Battle.js`) |
| **Líneas de código** | ~7.000 |
| **Archivos de datos** | 9 JSON |
| **Especies Pokémon** | 151 (Gen 1 completa) |
| **Movimientos** | 165 |
| **Objetos** | 78 (balls, medicina, mega piedras, hold items, bayas, MO, cañas) |
| **Habilidades** | 41 |
| **Tipos** | 15 (con tabla de efectividad completa) |
| **Entrenadores** | 10 (jóven, pescador, montañero, etc.) |
| **Efectos de movimiento implementados** | 59 (recoil, drain, OHKO, multi-hit, fixed damage, trap, etc.) |

## Arquitectura

```
PMZ_Core.js     → Datos, evolución extendida, combate, objetos, equipo, PC,
                  encuentros, estados, habilidades, IA, objetos retenidos,
                  dinero, badges/MOs, Safari, cría, Pokédex, pesca, bayas,
                  género, felicidad, clima, ciclo día/noche, EV/IV, Sprites
PMZ_Menu.js     → Menú de equipo, resumen 5 pestañas, mochila, centro,
                  tienda, equipar, Pokédex con búsqueda, tarjeta entrenador
PMZ_Battle.js   → Escena de batalla (wild/trainer/safari/doble), captura,
                  sprites, fondos, gritos, mega evolución, X-items,
                  clima en batalla, captura one-shot, turno por velocidad,
                  cola de acciones, selección de objetivo, animaciones,
                  59 efectos de movimiento, tracking (Leech Seed, Bind, etc.)
```

**Orden de carga obligatorio:** `PMZ_Core.js` → `PMZ_Menu.js` → `PMZ_Battle.js`

## Sistemas Completos

### Núcleo
- Carga asíncrona de 9 JSON desde `PMZ/*.json`
- `$gamePMZ` con persistencia via DataManager
- Party (configurable hasta 99), PC (cajas configurables)
- Sistema de objetos (add/remove/use/has)
- Money system
- Repel y Escape Rope
- `PMZ.Config` para lectura de configuración desde `config.json`

### Batalla
- Máquina de estados step-based (sin setTimeout)
- **Doble batalla 2v2**: 2 Pokémon del jugador + 2 enemigos simultáneamente
  - Ventana de selección de objetivo
  - Cola de acciones ordenada por velocidad (4 participantes)
  - AI elige objetivos automáticamente
  - Sprites duales + ventanas HP para ambos bandos
- Wild, trainer, Safari mode
- **Turno por velocidad**: orden de acción determinado por speed stat, empates favorecen al jugador
- Captura con cálculo de rate, shakes, status bonus
- **Captura One-Shot** (configurable): al debilitar, pregunta si capturar
- Movimientos físicos/especiales/status
- STAB, efectividad de tipos (15 tipos con inmunidades)
- Estadísticas de combate (-6 a +6 stages)
- Estados: poison, burn, paralysis, sleep, freeze, confusion
- Objetos retenidos: Leftovers, Life Orb, Choice items, berries, etc.
- **Mega evolución** (7 mega piedras, +50% stats, cambio de tipo) con **límite por combate configurable** (`megaPerBattle`)
- X-items (X Attack, X Defense, X SpAtk, X SpDef, X Speed)
- **41 habilidades** con **orden de activación por prioridad** (entry: Drizzle > Intimidate, contact: Static > Rough Skin)
- IA entrenador con scoring (poder, STAB, tipo, KO bonus, aleatoriedad)
- Obediencia por medallas (badge cap)
- **Clima**: lluvia, sol intenso, tormenta de arena, granizo
  - Modificadores de daño por tipo (fuego/agua)
  - Daño residual por turno (sandstorm/hail)
  - Inmunidad por tipo
- **Ciclo día/noche**: hora del juego, tintado automático del mapa cada 120 frames
- **59 efectos de movimiento** implementados en `applyMoveEffects()`:
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
- **Sistema crítico**: 6.25% base (12.5% critical_high), 1.5x daño, duplica con Focus Energy
- **Tracking de batalla**: Leech Seed, Bind (turnos restantes), Substitute, Disable, Recharge, Focus Energy, Rage, Mist, Light Screen, Reflect, Bide, Protect — almacenado en `PMZ.Battle` keyeado por `_battleId`
- **Animaciones**: `playMoveAnimation(moveData, targetSprite)` usa `Sprite_Animation` nativo de MZ con `$dataAnimations[animId]` y fallback por tipo
- **Sprites**: `PMZ.Sprites.getPath(id, back)` resuelve la ruta con prioridad configurable:
  - `"bw"` → `img/enemies/Black-White/BW/{id} BW.png` (151 sprites)
  - `"frlg"` → `img/enemies/Fire Red- Leaf Green/FRLG/{id} FRLG.png`
  - `"auto"` → prueba BW → FRLG → fallback `img/pokemon/`

### Menús
- Party: lista, info, stats, mover, usar objeto, equipar/desequipar (multi-slot configurable)
- **Resumen: 5 pestañas** (Info, Stats con barras, Movimientos, IV/EV detallados, Datos)
  - Pestaña Stats: stats actuales con barras, EXP, HP, género, naturaleza, tipos
  - Pestaña IV/EV: valores individuales (0-31) y de esfuerzo (0-255) por stat
  - Pestaña Datos: habilidad, objeto equipado, felicidad, shiny, sexo, información de evolución
- Mochila con filtros (medicina, evolution, field, hold, balls)
- Centro Pokémon (cura, guarda posición)
- Tienda (comprar/vender)
- **Pokédex mejorada**: búsqueda por nombre, lista de áreas donde aparece cada especie
- Tarjeta Entrenador (medallas, stats, dinero)

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
  - Herencia de naturaleza por Everstone
- Bayas: 9 tipos, consumición automática en batalla (Sitrus Berry, etc.)
- Sprites: sistema de resolución con prioridad (BW → FRLG → default), configurable desde `config.json`
- Gritos: reproduce `audio/se/{id}Cry.ogg` mediante `AudioManager.playSe()`
- Fondos de batalla dinámicos por tipo de Pokémon

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

### Sistema de Pokémon
- **Naturaleza** (±10% a stats, tabla completa 25 naturalezas, `_natureMods` map)
- **EVs**: cada especie otorga EVs específicos al ser derrotada (`_evYields`), `gainEVs()` post-victoria, máx 255/stat, 510 total
- **IVs**: generados aleatoriamente (0-31) en creación, mostrados en resumen
- **Género**: ratio configurable por especie (macho/hembra/sin género) con icono ♂/♀ en resumen
- **Felicidad**: incrementa al caminar, default 70, usada en `checkHappiness()`

## Plugin Commands

| Plugin | Comando | Descripción |
|---|---|---|
| `PMZ_Core` | `startSafari` | Inicia Zona Safari |
| `PMZ_Core` | `openCenter` | Abre Centro Pokémon |
| `PMZ_Core` | `openMart` | Abre Tienda |
| `PMZ_Core` | `openBag` | Abre Mochila |
| `PMZ_Core` | `healParty` | Cura todo el equipo (en español) |
| `PMZ_Core` | `giveMoney`/`takeMoney` | Añade/quita dinero |
| `PMZ_Core` | `daycareDeposit`/`Withdraw`/`Check`/`PickupEgg` | Cría |
| `PMZ_Menu` | `openParty` | Abre equipo |
| `PMZ_Menu` | `openSummary` | Abre resumen de un Pokémon |
| `PMZ_Menu` | `openPokedex` | Abre Pokédex |
| `PMZ_Menu` | `openTrainerCard` | Abre tarjeta entrenador |
| `PMZ_Battle` | `startBattle` | Inicia combate wild (species, level) |
| `PMZ_Battle` | `startTrainer` | Inicia combate entrenador (trainerId) |
| `PMZ_Battle` | `startDoubleWild` | Inicia combate doble wild (species1, level1, species2, level2) |
| `PMZ_Battle` | `startDoubleTrainer` | Inicia combate doble entrenador |

## Configuración (`PMZ/config.json`)

```json
{
  "evolutionMode": "level",       // "level" | "stats"
  "captureMode": "weak",           // "weak" | "oneshot"
  "enableMegaEvolution": true,
  "megaPerBattle": 1,              // megas permitidas por combate
  "equipSlots": 1,                 // slots de objeto que puede tener cada Pokémon
  "maxPartySize": 6,
  "battleMovesLimit": 4,
  "startingMoney": 3000,
  "spriteStyle": "auto",           // "auto" | "bw" | "frlg"
  "martItems": [...]
}
```

## Estado vs Pokémon Essentials (RMXP)

| Mecánica | PE | PMZ | Estado |
|---|---|---|---|
| Batalla 1v1 | ✅ | ✅ | 100% |
| Batalla doble 2v2 | ✅ | ✅ | 100% |
| Movimientos (datos) | ✅ 900+ | ✅ 165 | Añadir JSON |
| **Efectos de movimiento** | ✅ 100+ | ✅ **59** (recoil, drain, OHKO, multi-hit, fixed, trap, screens, stats, etc.) | **~80%** |
| **Habilidades** | ✅ 300+ | ✅ 41 + orden por prioridad | **100%** |
| **Clima** | ✅ Completo | ✅ Sol, lluvia, tormenta, granizo + daño residual + inmunidad | **100%** |
| **Día/Noche** | ✅ | ✅ Tintado automático de mapa | **100%** |
| Objetos retenidos | ✅ 100+ | ✅ 18 + berries + multi-slot configurable | **100%** |
| **EV/IV system** | ✅ Completo | ✅ EV training post-victoria, IV gen, caps 255/510 | **100%** |
| **Naturaleza** | ✅ ±10% stats | ✅ 25 naturalezas | **100%** |
| **Género** | ✅ | ✅ Ratio por especie, ♂/♀ en UI | **100%** |
| **Felicidad** | ✅ | ✅ Por caminar, evolución por happiness | **100%** |
| Estados | ✅ 8 | ✅ 6 (poison, burn, sleep, freeze, paralyze, confuse) | **80%** |
| Captura | ✅ Completo | ✅ + modo one-shot configurable | **100%** |
| **Evolución** | ✅ level, stone, trade, time, happiness, location, move, beauty, item, gender | ✅ Todos + **modo stats** (oculta nivel) | **100%** |
| **Cría** | ✅ egg moves, IV inherit, ability inherit | ✅ egg moves, IV inherit (3 stats), ability inherit (80/20), Everstone | **100%** |
| Safari Zone | ✅ | ✅ | **100%** |
| MOs campo | ✅ | ✅ eventos MZ requeridos | **100%** |
| **Pokédex** | ✅ búsqueda, área, formas | ✅ búsqueda, área, lista 151 | **90%** |
| **Menú resumen** | ✅ 5 pestañas | ✅ **5 pestañas** (Info, Stats con barras, Moves, IV/EV, Data) | **100%** |
| **Animaciones** | ✅ Motor completo | ✅ Via `Sprite_Animation` nativo MZ + fallback por tipo | **Nuevo: 80%** |
| **Sistema crítico** | ✅ | ✅ 6.25% base, 1.5x, Focus Energy duplica | **100%** |
| **Sprites** | ✅ empaquetados | ✅ Carga desde BW/FRLG con fallback configurable | **100%** |
| Mapas/Eventos | ✅ Incluidos | ❌ Game designer | N/A |

## Veredicto

PMZ es un **motor al ~90%** de las mecánicas de Pokémon Essentials. Lo que lo separa de PE ahora:

1. **Más efectos de movimiento** (~40 efectos por implementar: two-turn attacks, semi-invulnerable, etc.)
2. **Más habilidades** (~260 por añadir a JSON)
3. **Contenido del game designer** (mapas, eventos, animaciones de MZ)

Todo lo demás —naturaleza, EVs, IVs, clima, día/noche, género, felicidad, evolución extendida, cría con egg moves, captura one-shot, Pokédex con búsqueda, doble batalla, 59 efectos de movimiento, animaciones, críticos, tracking de batalla, sprites desde BW/FRLG— **ya está implementado y configurable desde JSON**.

Para el game designer: con los 3 plugins + 9 JSONs + sprites/sonido en las rutas correctas, ya tienes un juego Pokémon funcional con ~90% de las mecánicas de PE. **Sin escribir código.**

## Lo que NO incluye (y está bien que no incluya)

Esto es un **plugin**, no un juego completo. El game designer debe proveer:

- Sprites en `img/enemies/Black-White/BW/` (ya incluidos en el repo) o `img/pokemon/`
- `audio/se/{id}Cry.ogg` … `151Cry.ogg` — gritos
- `audio/bgm/` — música de batalla, gimnasio, centro
- Mapas en el editor RPG Maker MZ
- Eventos de gimnasios, NPCs, guardería, centro, tienda
- Animaciones en la base de datos de MZ (`$dataAnimations`)
