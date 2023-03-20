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
npx @preset/cli apply wreathe-js/wreathe --ui=preact // [!code focus]
```

```bash [React]
composer create-project laravel/laravel <project-name>
cd <project-name>
npx @preset/cli apply wreathe-js/wreathe --ui=react // [!code focus]
```

```bash [Vue]
composer create-project laravel/laravel <project-name>
cd <project-name>
npx @preset/cli apply wreathe-js/wreathe --ui=vue // [!code focus]
```

:::

By default preset installs `wreathe`, a UI framework of your choice, configures [Vite](https://vitejs.dev) with [TypeScript](https://www.typescriptlang.org/) and enables [SSR](/advanced-usage/server-side-rendering).

::: info

- TypeScript variant can be disabled by passing the `--no-typescript` flag.<br />
- SSR can be disabled by passing the `--no-ssr` flag.

See [Preset CLI](/api/preset-cli) for more details.

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

* To learn about a projects structure, read more about the [core concepts](/guide/getting-started/core-concepts).
* To learn more about the files created read [Preset CLI](/api/preset-cli), or the [manual installation](/advanced-usage/manual-installation) docs.

::: tip

<ins>Your contributions are welcome!</ins> Please read our [contributing guide](https://github.com/wreathe-js/wreathe/blob/main/CONTRIBUTING.md) for more information.

:::

### Community

If you have a question or need additional help, please consider to join our [Discord](https://discord.gg/C5E2ChNE) or start a discussion at [Github](https://github.com/wreathe-js).

Please use the GitHub [issue tracker](https://github.com/wreathe-js/wreathe/issues) to submit bug reports and feature requests.
