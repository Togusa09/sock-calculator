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

## EXPO Readme - Need to integrate to main body of readme

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **example** directory and create a blank **src/app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
