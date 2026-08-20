# PMZ — Pokémon Engine para RPG Maker MZ

**Crea tu propio juego Pokémon en RPG Maker MZ, sin programar.**

PMZ convierte RPG Maker MZ en un motor Pokémon completo: batallas, captura, evolución, objetos, entrenadores y más. Todo se configura con archivos JSON, sin escribir una línea de código.

## Lo que trae

- 🎮 **Batallas** single, doble, con IA, clima, estado y animaciones
- ⚡ **386 Pokémon** (Gen 1 + Johto + Hoenn: Treecko → Deoxys)
- 🎯 **316 movimientos** y 113 habilidades con efectos reales
- 🧬 **EV/IV, naturaleza, género, cría** con egg moves y herencia
- 📦 **163 objetos**, 50 TMs, Pokédex con búsqueda
- 🏆 **60 entrenadores**, 24 medallas, Líderes y Elite 4
- 🖊️ **PMZ Editor** — editor visual para todo el contenido, se abre en el navegador

## Cómo empezar

1. Copia los 5 plugins (carpeta `js/plugins/`) y la carpeta `PMZ/` con los datos a tu proyecto.
2. Activa los plugins en este orden: `PMZ_Core` → `PMZ_GamePokemon` → `PMZ_BattleCore` → `PMZ_Battle` → `PMZ_Menu`.
3. Crea un evento con el comando: `Crea un evento: Plugin Command → PMZ_Battle → startBattle species=pikachu level=5` o `startBattle species=pikachu level=5`.
4. Juega.

## Estado

| Versión | Novedades |
|---|---|
| **v0.9.13** | Animaciones de batalla (impactos, barra de HP, debilitado y cambio de Pokémon) |
| **v0.9.12** | Pulido de interfaz + fix de iconos |
| **v0.9.11** | Cobertura total de tests (316 movimientos + 113 habilidades) y 6 bugs corregidos |

**482 tests automatizados** verifican la lógica del motor (`npm test`). Funcional y estable hoy: puedes crear tu mapa, tus eventos y tener un juego jugable sin esperar a v1.0.

## Documentación

- [CHANGELOG.md](CHANGELOG.md) — detalle técnico y registro de cambios
- `PMZ/config.json` — configuración del motor
- `PMZ/trainers.json` / `PMZ/items.json` / `PMZ/moves.json` — define tu contenido

## Créditos

Desarrollado para RPG Maker MZ. Pokémon es propiedad de Nintendo/The Pokémon Company. Motor para fan games, no un producto comercial.