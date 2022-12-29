# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## Unreleased

- initial release based on [@inertiajs/core](https://github.com/inertiajs/inertia) (v1.0.0-beta.2)

### Features

- updat `debounce()` typings

### Bug Fixes

- add `server.d.ts`
  - fix typescript declaration not found
- replace deprecated `event.which` with `event.detail`
- add type `VisitProgress`
  - fix type error from `AxiosProgressEvent` in `axios@1.2.1`
  - fix `GlobalEventsMap` progress type
- add interfaces `Renderer` & `Modal`
  - fix type error related to `this` inside Objects
- fix `qs` import
- fix `process` import

### Refactoring

- change namespace `Inertia/inertia` to `Wreathe/wreathe`
- enable tsconfig option `noImplicitThis`
- remove `@types/deepmerge` dependency
- remove `microbundle` dependency

### Other

- add `unbuild` dependency
- update `@types/qs` dependency to 6.9.7
- update `axios` dependency to 1.2.1
- update `deepmerge` dependency to 4.2.2
- update `qs` dependency to 6.11.0
