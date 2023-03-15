# Quick Start

The recommended way of installing `wreathe` is via automatic setup using [@preset/cli](https://preset.dev).

::: warning
wreathe is currently in `alpha` status and not ready for production use yet.
:::

## Requirements

When using automatic setup, `wreathe` has a few requirements:

* [PHP](https://www.php.net/manual/de/intro-whatis.php) >= 8.x
* [Composer](https://getcomposer.org/) >= 2.4.4
* [Node](https://nodejs.org/en/) >= 16.15.1
* [Laravel](https://laravel.com/) >= 9.x

## Automatic setup using `@preset/cli`

Use `@preset/cli` to install `wreathe` in a fresh Laravel application.

::: code-group

```bash [Preact]
composer create-project laravel/laravel <project-name>
cd <project-name>
npx @preset/cli apply --ui=preact // [!code focus]
```

```bash [React]
composer create-project laravel/laravel <project-name>
cd <project-name>
npx @preset/cli apply --ui=react // [!code focus]
```

```bash [Vue]
composer create-project laravel/laravel <project-name>
cd <project-name>
npx @preset/cli apply --ui=vue // [!code focus]
```

:::

This preset installs `wreathe` with a framework of your choice, [Vite](https://vitejs.dev), [TypeScript](https://www.typescriptlang.org/), and [SSR](https://inertiajs.com/server-side-rendering).

::: info

The presets TypeScript variant can be disabled by passing the `--no-typescript` flag.<br />
The presets SSR variant can be excluded by passing the `--no-ssr` flag.

:::

## Usage

Run the [Vite dev server](https://vitejs.dev/config/server-options.html) with the command:

```bash
npm run dev

VITE v4.0.1  ready in 1487 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

Build the app with production-ready assets with the command:

```bash
npm run build

vite v4.0.1 building for production...
✓ 4 modules transformed.
```

Locally preview the production build with the command:

```bash
npm run preview

➜  Local:   http://localhost:4173/
➜  Network: use --host to expose
```

## What's next?

* Read more about the [core concepts](/guide/getting-started/core-concepts) to learn about project structure.
* To learn more about the files created by the preset, read the [manual installation](/advanced-usage/manual-installation) docs.

### Community

If you have a question or need additional help, please consider to join our [Discord](https://discord.gg/C5E2ChNE) or start a discussion at [Github](https://github.com/wreathe-js).
