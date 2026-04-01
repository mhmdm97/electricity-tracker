# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands must be run from the `electricity-clock/` subdirectory:

```bash
cd electricity-clock

npm start        # Start dev server with live reload at http://localhost:8080
npm run build    # Compile TypeScript types (src/ → dist/)
npm test         # Run Jest unit tests
```

To run a single test file:
```bash
cd electricity-clock
node --experimental-vm-modules node_modules/jest/bin/jest.js electricity-tracker.test.js
```

There is no linter configured.

## Architecture

This is a **vanilla JS web app** with no framework or bundler. Files are loaded directly as ES6 modules in the browser via `src/index.html`.

### Schedule Algorithm

The core logic lives in `electricity-tracker.js`. The schedule is built deterministically from a fixed reference point (`Feb 7, 2026, 12:00 PM`) using a repeating **3-hour ON / 6-hour OFF** (9-hour) cycle. `generateElectricitySchedule(periodCount)` calculates periods forwards and backwards from that anchor to cover the current time window. The clock updates every second; the schedule re-evaluates every 60 seconds.

### Module breakdown

| File | Role |
|------|------|
| `src/index.html` | Entry point; loads CSS and bootstraps `startApp()` |
| `src/scripts/clock.js` | Exports `startClock()` — ticks `#clock` every 1s |
| `src/scripts/electricity-tracker.js` | Schedule generation, availability checks, DOM updates |
| `src/scripts/electricity-tracker.test.js` | Jest tests (mocks `global.Date`) |
| `src/types/index.ts` | TypeScript interfaces (`ElectricitySchedule`, `TimeFrame`) |

### Root vs. subdirectory

The root `package.json` is empty. All real dependencies and scripts are in `electricity-clock/package.json`. TypeScript is only used for the type definitions file; application code is plain JavaScript.
