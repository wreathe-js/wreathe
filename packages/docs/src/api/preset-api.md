# Preset API

## Overview

> [Preset](https://preset.dev/) is a system that makes it easy to perform modifications on a freshly scaffolded project.

The [starter-presets](https://github.com/wreathe-js/wreathe/tree/main/packages/presets) are hosted on the wreathe GitHub [workspace](https://github.com/wreathe-js/wreathe) and can be applied by providing an `--ui` argument.

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

| Option            | Description                                                    |
| ----------------- | -------------------------------------------------------------- |
| `--ui [ui]`       | Prefered UI-Framework (default: `undefined`) (`"preact" \| "react" \| "vue" \| undefined`) |
| `--no-typesctipt` | Disable TypeScript (use `.jsx`) (default: `false`) (`boolean`) |
| `--no-ssr`        | Disable SSR (default: `false`) (`boolean`) |
| `--sandbox`       | For development with wreathe [workspace](https://github.com/wreathe-js/wreathe) only (default: `false`) (`boolean`) |
