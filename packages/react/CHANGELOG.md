# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

- initial release based on [@inertiajs/react](https://github.com/inertiajs/inertia) (v1.0.0-beta.2)

### Bug Fixes

- add `server.d.ts` to fix missing typescript declaration for server scope
- remove Link `console.warn` line breaks to fix broken minification

### Refactoring

- convert adapter to TypeScript
- change namespace `Inertia/inertia` to `Wreathe/wreathe`
- remove `microbundle` dependency
- remove deprecated function `useRememberedState`

### Other

- add `unbuild` dependency
- add `@types/lodash.isequal` dependency
