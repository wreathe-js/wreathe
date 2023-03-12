# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

- initial release based on [@inertiajs/core](https://github.com/inertiajs/inertia) (v1.0.0-beta.2)

### Bug Fixes

- add interfaces `Renderer` & `Modal` to fix type error `this` inside objects when `noImplicitThis: true`
- add `typesVersions` to fix missing typescript declaration for server scope
- fix type error from `AxiosProgressEvent` when using `axios@1.3.4`
- add fix for bug with anchor links not being scroll to
- add fix to prevent needing to use `Method` enum with the `Link` component
- update form types to support nested data

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
- update `axios` dependency to 1.3.4
- update `deepmerge` dependency to 4.3.0
- update `qs` dependency to 6.11.1
