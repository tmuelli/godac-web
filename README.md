# godac-web

A web app for Pokémon Generation 4 battles: a damage calculator in the browser,
fed by screenshots from your emulator.

Built on [godac](https://github.com/tmuelli/godac), my terminal damage calculator.
godac's calculation engine is used as a Go library, so the browser and the
terminal always give the same numbers.

> **Status:** work in progress. Nothing below is finished yet.

## Plan

1. Go server that exposes godac's calculator and game data as a JSON API
2. React calculator (the same inputs as the godac TUI)
3. Recognize a battle screenshot and pre-fill the calculator
4. Live capture from the emulator window in the browser
5. Collect the player's team over time, with a review screen to correct values

## How it fits together

```
React app (web/) ── HTTP / JSON ──▶ Go server (server/) ──imports──▶ godac (calc, models)
```

- `web/`: React + TypeScript (Vite)
- `server/`: Go, `net/http`, uses [`github.com/tmuelli/godac`](https://pkg.go.dev/github.com/tmuelli/godac)

## Development

_To be added._

## Disclaimer

Unofficial fan project, not affiliated with Smogon, Nintendo, Creatures Inc.,
GAME FREAK, or The Pokémon Company. Game data comes from
[Smogon's damage-calc](https://github.com/smogon/damage-calc) (MIT) via godac.