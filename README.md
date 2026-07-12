# PMZ — Pokémon Engine para RPG Maker MZ

**Crea tu propio juego Pokémon en RPG Maker MZ sin programar.**

PMZ convierte RPG Maker MZ en un motor Pokémon completo. Añade batallas, captura, evolución, objetos, entrenadores y todo lo necesario para hacer un fan game — todo configurable desde archivos JSON, sin escribir código.

```
🎮 Batalla single y doble   🌊 Surf y MOs en el mapa
⚡ 386 Pokémon (Gen 1 + Johto + Hoenn)  🌦️ Clima, día/noche
🎯 316 movimientos, 42 tipos de efecto registrados  🧬 EV/IV, naturaleza, género
💎 113 habilidades, 11 hooks de activación  🥚 Cría con egg moves + herencia
📦 163 objetos, 50 TMs      📖 Pokédex con búsqueda
🏆 60 entrenadores, 24 medallas  🏪 Tienda, PC, Centro Pokémon
🖊️ PMZ Editor — editor visual HTML para todos los JSON
```

## PMZ Editor

Incluye **`PMZ_Editor.html`** — un editor visual autónomo que se abre directamente en el navegador. Permite editar Pokémon, movimientos, objetos, habilidades, mecánicas, entrenadores y encuentros sin tocar los JSON a mano.

- Carga la carpeta del proyecto → edición visual con guardado directo
- **Mecánicas** (`mechanics.json`): crear, editar y eliminar mecánicas de combate (mega, primal, ultra, custom). Cada mecánica define stat boost, stats afectadas, sufijos de sprite/icono, tipos, trigger. Modal con checkboxes y campos detallados
- **Objetos vinculados**: al editar un objeto (piedra mega, orbe primal, etc.), el selector de mecánica muestra automáticamente los campos de transformación (`megaSuffix`, `megaTypes`, `megaTo`) para configurar el cambio de tipo y sprite específico
- Sprites desde `img/enemies/Black-White/BW/` con carga lazy
- Búsqueda, paginación, exportación ZIP

## ¿Qué necesitas?

- **RPG Maker MZ** (compra en Steam)
- Los 3 plugins en este repositorio
- Sprites y gritos de Pokémon (se consiguen gratis online)

No necesitas saber programar. Todo el contenido se edita en archivos JSON y eventos visuales de MZ.

## Cómo empezar

1. Copia `PMZ_Core.js`, `PMZ_Menu.js`, `PMZ_Battle.js` a `js/plugins/`
2. Copia la carpeta `PMZ/` con los JSONs a la raíz de tu proyecto
3. Activa los 3 plugins en ese orden en el Plugin Manager de MZ
4. Crea un evento con `Plugin Command → PMZ_Battle → startBattle species=pikachu level=5`
5. Juega y prueba

Más detalles: [Guía rápida en CHANGELOG](CHANGELOG.md)

## Arquitectura (v0.9.9 + PMZ Editor)

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

## Estado actual

| Versión | Estado |
|---|---|---|
| **v0.9.9** | Beta pública — funcional y estable + **Gen 3 Hoenn completo** + **PMZ Editor visual** |
| Motor completo | ~90% comparado con Pokémon Essentials |
| Ideal para | Juegos estilo Gen 1-3 con historia propia |
| Arquitectura | EffectRegistry (42 handlers) + Ability Hook System (11 hooks) — todo data-driven |

El motor es funcional hoy. Puedes crear tu mapa, tus eventos, tus entrenadores, y tener un juego Pokémon jugable. No necesitas esperar a v1.0.

## Documentación

- [CHANGELOG.md](CHANGELOG.md) — Todo el detalle técnico, bugfixes, plugin commands, configuración
- `PMZ/config.json` — Configuración del motor
- `PMZ/trainers.json` — Define tus entrenadores
- `PMZ/items.json` — Define tus objetos

## Créditos

Desarrollado para RPG Maker MZ. Pokémon es propiedad de Nintendo/The Pokémon Company. Este es un motor para fan games, no un producto comercial.
