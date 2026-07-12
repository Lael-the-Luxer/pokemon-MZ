# PMZ — Pokémon Engine para RPG Maker MZ

**Crea tu propio juego Pokémon en RPG Maker MZ sin programar.**

PMZ convierte RPG Maker MZ en un motor Pokémon completo: batallas, captura, evolución, objetos, entrenadores y todo lo necesario para hacer un fan game — todo configurable desde archivos JSON o desde un editor visual, sin escribir código.

```
🎮 Batalla single y doble        🌊 Surf y MOs en el mapa
⚡ 386 Pokémon (Kanto + Johto + Hoenn)   🌦️ Clima, día/noche
🎯 316 movimientos, 42 tipos de efecto   🧬 EV/IV, naturaleza, género
💎 113 habilidades, 11 hooks de activación   🥚 Cría con egg moves + herencia
📦 163 objetos, 50 TMs           📖 Pokédex con búsqueda
🏆 60 entrenadores, 24 medallas   🏪 Tienda, PC, Centro Pokémon
🖊️ PMZ Editor — editor visual HTML para todo el contenido
```

## Novedades en v0.10.0

- **Trilogía GBA completa**: Kanto, Johto y Hoenn jugables de inicio a fin.
- **Movimientos y habilidades 100% data-driven**: ya no solo las mecánicas custom (mega, primal) se crean sin tocar código — ahora cada movimiento y cada habilidad es un objeto JSON editable, combinable y extensible.
- **PMZ Editor**: editor visual completo, sin necesidad de tocar un JSON a mano.

## PMZ Editor

`PMZ_Editor.html` es un editor visual autónomo que se abre directamente en el navegador — no necesita instalación ni depende de RPG Maker para funcionar. Permite crear y editar **Pokémon, movimientos, objetos, habilidades, mecánicas, entrenadores y encuentros** con una interfaz gráfica.

- **Carga y guardado directo**: apunta el editor a la carpeta de tu proyecto y guarda los cambios sin pasos intermedios.
- **Mecánicas de combate** (`mechanics.json`): crea, edita y elimina mecánicas tipo mega evolución, regresión primigenia, ultra burst o mecánicas propias — cada una con stat boost, stats afectadas, sufijos de sprite/icono, tipos resultantes y trigger de activación.
- **Objetos vinculados a mecánicas**: al editar un objeto (piedra mega, orbe primal, etc.) el editor muestra automáticamente los campos de transformación correspondientes (`megaSuffix`, `megaTypes`, `megaTo`).
- **Sprites con carga lazy** desde `img/enemies/Black-White/BW/`.
- Búsqueda, paginación y **exportación a ZIP** de todo el proyecto de datos.

Con esto, todo el contenido de PMZ —desde un Pokémon nuevo hasta una mecánica de batalla inventada por ti— se puede crear sin abrir un editor de texto ni escribir una línea de código.

## ¿Qué necesitas?

- **RPG Maker MZ** (compra en Steam)
- Los 3 plugins de este repositorio
- Sprites y gritos de Pokémon (se consiguen gratis online)

No necesitas saber programar. Todo el contenido se edita desde el PMZ Editor o directamente en JSON, más eventos visuales de MZ para tu mapa e historia.

## Cómo empezar

1. Descarga la carpeta del proyecto.
2. Ábrela como proyecto en RPG Maker MZ.
3. Prueba la versión inicial para ver el motor en funcionamiento.

Más detalles: [Guía rápida en CHANGELOG](CHANGELOG.md)

## Arquitectura

### EffectRegistry — Sistema de efectos data-driven

Los efectos de movimientos son objetos parametrizados en JSON. 42 handlers registrados que cubren desde daño fijo hasta clima:

```json
{ "type": "status_chance", "status": "burn", "chance": 0.3 }
```

`PMZ.Effects.run()` dispacha al handler según el `type`, `computeDamage()` resuelve daño especial (fixed_damage, psywave, ohko), `getHitParams()` maneja multi-hit.

### Ability Hook System

11 hooks que conectan `abilities.json` con la lógica de batalla sin código hardcodeado:

| Hook | Propósito |
|------|-----------|
| `onDamageCalc` | Tipo inmunidad/absorción, daño ×0.5/×1.5/×2 |
| `onStatusCheck` | Inmunidad a estados |
| `onCritCheck` | Crit prevention (Shell Armor) y boost (Sniper) |
| `onWeather` | Overcoat, Solar Power, Rain Dish |
| `onAccuracy` | Compound Eyes, No Guard, Sand Veil |
| `onEntry` | Intimidate |
| `onContact` | Static, Flame Body, Rough Skin |
| `onTurnEnd` | Shed Skin, Speed Boost |
| `onSecondaryEffect` | Shield Dust, Serene Grace |
| `onPreventFlinch` | Inner Focus, Steadfast |
| `onOverride` | Mold Breaker |

Ver [CHANGELOG.md](CHANGELOG.md) para detalle línea por línea.

### Movimientos y habilidades: ahora también data-driven

La misma filosofía que gobierna las mecánicas custom (mega evolución, regresión primigenia) se extiende a movimientos y habilidades: son objetos JSON, no código hardcodeado. Esto significa que puedes editar cualquier movimiento o habilidad existente, crear otros completamente nuevos y combinar efectos (ej. quemar + bajar stat) solo escribiendo — o seleccionando desde el PMZ Editor — el JSON correspondiente.

## Estado actual

| | |
|---|---|
| **Versión** | v0.10.0 — Beta pública, funcional y estable |
| **Contenido** | Kanto + Johto + Hoenn completos (386 Pokémon) |
| **Arquitectura** | EffectRegistry (42 handlers) + Ability Hook System (11 hooks) + Movimientos/Habilidades data-driven |
| **Herramientas** | PMZ Editor — edición visual completa sin tocar JSON |
| **Motor completo** | ~90% comparado con Pokémon Essentials en mecánicas core |
| **Ideal para** | Juegos estilo Gen 1-3 con historia propia |

El motor es funcional hoy. Puedes crear tu mapa, tus eventos, tus entrenadores, y tener un juego Pokémon jugable. No necesitas esperar a v1.0.

## Documentación

- [CHANGELOG.md](CHANGELOG.md) — Todo el detalle técnico, bugfixes, plugin commands, configuración
- `PMZ/config.json` — Configuración del motor
- `PMZ/trainers.json` — Define tus entrenadores
- `PMZ/items.json` — Define tus objetos

## Créditos

Desarrollado para RPG Maker MZ. Pokémon es propiedad de Nintendo/The Pokémon Company. Este es un motor para fan games, no un producto comercial.
