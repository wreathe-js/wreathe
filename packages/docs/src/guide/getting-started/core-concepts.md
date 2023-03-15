# Core Concepts

Work in progress

## Directory Structure

`wreathe` is using [Laravel Vite conventions](https://laravel-vite.dev/guide/extra-topics/inertia.html#conventions) for a consistent and organized architecture:

```
example-app
└── resources
    ├── application
    │   ├── main.tsx
    │   └── ssr.tsx
    ├── types
    │   └── wreathe.d.ts
    └── views
        ├── components
        │   └── button.tsx
        ├── layouts
        │   └── default.tsx
        ├── pages
        │   ├── about.tsx
        │   └── home.tsx
        └── root.blade.php
```

### Rundown

* File and directory names use `kebab-case` instead of `StudlyCase`
* The `root.blade.php` is stored in `resources/views`
* Main entrypoint is `resources/application/main.{ts,tsx,js,jsx}`
* SSR entrypoint is `resources/application/ssr.{ts,tsx,js,jsx}`
* Pages are stored in `resources/views/pages`
* Components are stored in `resources/views/components`
* Layouts are stored in `resources/views/layouts`
* Types are stored in `resources/types`
