# Sock calculator

Sock calculator turns foot measurements and yarn tension into a clear starting stitch plan for a pair of socks.

## Features

- Centimetres are the canonical unit; measurements can be entered and displayed in metric or imperial units.
- Foot length and ball circumference are required. Optional ankle, heel, instep, toe, and calf measurements show calculated previews until entered.
- Choose ribbed or folded cuffs, 1x1/1x2/2x2/3x3 ribbing, gussetted/afterthought/short-row heels, and round/star toes.
- Create and reuse saved foot measurements, yarn profiles, yarn tensions, and construction choices. Tensions are associated with a yarn profile and needle size.
- The calculator keeps a working record in browser local storage and supports saving/loading named project records. Records can also be exported to and imported from versioned JSON.
- The `/compact` page combines saved foot measurements, yarn profiles, tensions, and construction choices to show a compact stitch plan. The `/config` pages manage saved foot measurements and yarn profiles.

The calculator does not generate written knitting instructions, support variable-diameter shaping, or provide custom repeats. Standard formula assumptions are shown in the results panel and implemented in `src/lib/calculations.ts` and `src/lib/constructions.ts`.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Before opening a pull request, run:

```bash
npm run format:check
npm run lint
npm test
npx tsc --noEmit
npm run build
```

## GitHub Pages

The repository includes the GitHub Actions workflow
`.github/workflows/deploy-pages.yml`, which:

- runs formatting checks, ESLint, tests, and a production build for pull
  requests
- deploys the static export to GitHub Pages when changes land on `master`

The Pages build uses `PAGES_BASE_PATH=/sock-calculator` so the exported app is
served from this repository's project site path.
