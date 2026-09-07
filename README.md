# Sock calculator

Sock calculator turns foot measurements and yarn tension into a clear starting stitch plan for a pair of socks.

## MVP

- Metric values are used internally; imperial is available as a display and input preference.
- Foot length and ball circumference are the required measurements.
- Optional ankle, heel, instep, toe, and calf measurements show calculated previews until entered.
- Supports ribbed or folded cuffs, 1x1/1x2/2x2/3x3 ribbing, gussetted/afterthought/short-row heels, and round/star toes.
- Saves the active record in browser local storage.
- Exports and imports a versioned JSON record.

The current calculator intentionally does not generate written instructions, variable-diameter shaping, custom repeats, or a collection of separate saved projects. Standard formula assumptions are shown in the results panel and kept in `lib/calculations.ts`.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Before opening a pull request, run:

```bash
npm run lint
npx tsc --noEmit
npm run build
```