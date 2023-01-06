# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

- initial release based on [@inertiajs/core](https://github.com/inertiajs/inertia) (v1.0.0-beta.2)

### Bug Fixes

- add interfaces `Renderer` & `Modal` to fix type error `this` inside objects when `noImplicitThis: true`
- add `server.d.ts` to fix missing typescript declaration for server scope
- add type `VisitProgress` to fix type error from `AxiosProgressEvent` when using `axios@1.2.2`
- add type guard to deprecated `event.which` in `shouldIntercept()`
- add type `MouseEvent` and `event.button` to `shouldIntercept()`

### Refactoring

- change namespace `Inertia/inertia` to `Wreathe/wreathe`
- enable tsconfig option `noImplicitThis`
- change `GlobalEventsMap` progress type to `VisitProgress`
- change wildcard import to default import for `qs` and `process`
- remove `@types/deepmerge` dependency
- remove `microbundle` dependency

### Other

- add `unbuild` and `@types/node` dependencies
- update `@types/qs` dependency to 6.9.7
- update `axios` dependency to 1.2.2
- update `deepmerge` dependency to 4.2.2
- update `qs` dependency to 6.11.0
