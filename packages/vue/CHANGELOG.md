# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## Unreleased

- initial release based on [@inertiajs/vue](https://github.com/inertiajs/inertia) (v1.0.0-beta.2)

### Bug Fixes

- add `server.d.ts` to fix missing typescript declaration for server scope
- remove Link `console.warn` line breaks to fix broken minification

### Refactoring

- convert adapter to TypeScript
- change namespace `Inertia/inertia` to `Wreathe/wreathe`
- remove `microbundle` dependency

### Other

- add `unbuild` dependency
- add `@types/lodash.clonedeep` dependency
- add `@types/lodash.isequal` dependency
- update `vue` dependency to 3.2.45
