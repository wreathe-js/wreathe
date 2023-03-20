# Preset CLI

## Overview

To offer the best user experience we use [@preset/cli](https://preset.dev) to scaffold our [starter-presets](https://github.com/wreathe-js/wreathe/tree/main/packages/presets).

> [Preset](https://preset.dev/) is a system that makes it easy to perform modifications on a freshly scaffolded project.

They are hosted on the wreathe GitHub [workspace](https://github.com/wreathe-js/wreathe) and can be applied by providing an additional command line argument `--ui` using `npx`.

## Requirements

* [PHP](https://www.php.net/manual/de/intro-whatis.php) >= 8.x
* [Composer](https://getcomposer.org/) >= 2.4.4
* [Node](https://nodejs.org/en/) >= 16.15.1
* [Laravel](https://laravel.com/) >= 9.x

## Usage

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

## Options

| Option | Description |
| -      | -           |
| `--ui [framework]` | Prefered UI-Framework (default: `none`) (`"preact" \| "react" \| "vue"`) |
| `--no-typesctipt`  | Disable TypeScript (use `.jsx`) (default: `false`) (`boolean`) |
| `--no-ssr`         | Disable SSR (default: `false`) (`boolean`) |
| `--sandbox`        | For `dev` with wreathe [workspace](https://github.com/wreathe-js/wreathe) only (default: `false`) (`boolean`) |
