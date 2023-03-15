# Introduction

## Overview

> Wreathe makes it possible to build server-side rendered, single-page applications using [Laravel](https://laravel.com/) with [Vite](https://vitejs.dev/) and the UI framework of your choice. :rocket:

* [Preact](https://preactjs.com/)
* [React](https://reactjs.org/)
* [Vue](https://vuejs.org/)

### Why wreathe?

The article [Server-side apps with client-side rendering](https://reinink.ca/articles/server-side-apps-with-client-side-rendering), which Jonathan Reinink published on his blog in 2019 looked very promising as an alternative to [spatie/laravel-server-side-rendering](https://github.com/spatie/laravel-server-side-rendering). When [Inertia.js](https://inertiajs.com/) was subsequently released, it looked like the next rising star.

However, due to the lack of development, unanswered issues and pull requests at Inertia, we decided to continue developing a fork under the name `wreathe`.

---

### Current roadmap

Application related:

* __Improve TypeScript support__ - Provide better type definitions for IDE and autocomplete.
* __Improve application performance__ - Optimize the application performance and reduce required dependencies.
* __Expand the test suite__ - Add `Vitest` and test suites for better code control.

Community related:

* __Improve user & developer experience__ - Optimize the docs, examples, starter-kits, workspace- and user-tools continuously.
* __Collaborate with community members__ - Issue prioritization will be based on community feedback, please share your thoughts!

### Recent changes

* Initial release for packages `core`, `react` and `vue` is based on Inertia v1.0.0-beta.2.
* Initial release for `laravel` package is based on inertia-laravel v0.6.4.
* Initial release for package `preact` is based on [@jrson83/inertia-preact](https://github.com/jrson83/inertia-preact) v1.0.0-beta.2.1.
* All JavaScript adapters have been converted to TypeScript.
* Most type definitions have been rewritten and improved.
* Dependencies have been updated, replaced and removed.

See the `CHANGELOG.md` from the [packages](https://github.com/wreathe-js/wreathe/tree/main/packages) for a full list of changes.

## Community

If you have a question or need additional help, please consider to join our [Discord](https://discord.gg/C5E2ChNE) or start a discussion at [Github](https://github.com/wreathe-js).

## Credits

::: info

* Wreathe is a based on [Inertia.js](https://inertiajs.com/) by [Jonathan Reinink](https://reinink.ca/). Read the [CREDITS](https://github.com/wreathe-js/wreathe/blob/main/CREDITS.md).
* This documentation is based on [Inertia](https://inertiajs.com/)'s documentation.

:::
