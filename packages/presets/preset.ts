interface Options {
  sandbox: boolean
  ssr: boolean
  typescript: boolean
  ui: 'preact' | 'react' | 'vue' | undefined
}

export default definePreset<Options>({
  name: 'wreathe-js',
  options: {
    ssr: true,
    typescript: true,
    ui: undefined,
    sandbox: false,
  },
  handler: async ({ options }) => {
    if (!options.ui) {
      throw new Error(
        'Please provide a value for required `ui` flag: `--ui preact|react|vue`'
      )
    }

    await installWreathe(options)
  },
})

async function installWreathe({ sandbox, ssr, typescript, ui }: Options) {
  if (sandbox) {
    await group({
      title: 'install PHP sandbox dependencies',
      handler: async () => {
        await deletePaths({
          paths: ['node_modules', 'package.json'],
        })

        await executeCommand({
          title: 'install PHP dependencies',
          command: 'composer',
          arguments: ['create-project', 'laravel/laravel', '.'],
          ignoreExitCode: false,
        })

        await editFiles({
          title: 'update composer.json',
          files: 'composer.json',
          operations: [
            {
              skipIf: (content) => content.includes('wreathe-js/laravel'),
              type: 'edit-json',
              delete: ['repositories'],
            },
            {
              skipIf: (content) => content.includes('wreathe-js/laravel'),
              type: 'edit-json',
              merge: {
                repositories: [
                  {
                    type: 'path',
                    url: '../../packages/laravel',
                    options: { symlink: true },
                  },
                ],
              },
            },
            {
              skipIf: (content) => content.includes('wreathe-js/laravel'),
              type: 'edit-json',
              merge: {
                require: { 'wreathe-js/laravel': '@dev' },
              },
            },
          ],
        })

        await executeCommand({
          title: 'update PHP dependencies',
          command: 'composer',
          arguments: ['update'],
          ignoreExitCode: true,
        })
      },
    })
  } else {
    await installPackages({
      title: 'install PHP dependencies',
      for: 'php',
      packages: ['wreathe-js/laravel'],
    })
  }

  await group({
    title: 'install wreathe scaffolding',
    handler: async () => {
      await deletePaths({
        title: 'remove some default files & folders',
        paths: ['resources', 'webpack.mix.js', 'vite.config.js'],
      })

      await extractTemplates({
        title: 'extract templates',
        /* templates: 'packages/presets/templates', */
        from: typescript ? `${ui}-ts` : ui,
      })

      await executeCommand({
        title: 'publish Wreathe configuration',
        command: 'php',
        arguments: [
          'artisan',
          'vendor:publish',
          '--provider=Wreathe\\ServiceProvider',
        ],
      })

      await executeCommand({
        title: 'publish Wreathe middleware',
        command: 'php',
        arguments: ['artisan', 'wreathe:middleware'],
      })

      await editFiles({
        title: 'register Wreathe middleware',
        files: 'app/Http/Kernel.php',
        operations: [
          {
            type: 'add-line',
            position: 'after',
            match: /SubstituteBindings::class,/,
            lines: '\\App\\Http\\Middleware\\HandleWreatheRequests::class,',
          },
        ],
      })

      await editFiles({
        title: 'update Wreathe middleware',
        files: 'app/Http/Middleware/HandleWreatheRequests.php',
        operations: [
          {
            type: 'remove-line',
            match: /array_merge\(parent::share/,
            count: 1,
            start: 1,
          },
          {
            type: 'add-line',
            position: 'after',
            match: /array_merge\(parent::share/,
            indent: '            ',
            lines: [
              "'versions' => [",
              "    'php' => PHP_VERSION,",
              "    'laravel' => \\Illuminate\\Foundation\\Application::VERSION",
              '],',
            ],
          },
        ],
      })

      await editFiles({
        title: 'register Wreathe pages for testing',
        files: 'config/wreathe.php',
        operations: [
          {
            ...(ssr && {
              type: 'update-content',
              update: (content) =>
                content.replace(`'enabled' => false`, `'enabled' => true`),
            }),
          },
          {
            type: 'update-content',
            update: (content) => content.replace('js/Pages', 'views/pages'),
          },
        ],
      })

      await editFiles({
        title: 'udpate route file',
        files: 'routes/web.php',
        operations: [
          {
            type: 'add-line',
            position: 'before',
            match: /use Illuminate\\Support\\Facades\\Route;/,
            lines: [`use Wreathe\\Wreathe;`],
          },
          {
            type: 'update-content',
            update: (r) =>
              r.replace("view('welcome')", "Wreathe::render('home')"),
          },
          {
            type: 'add-line',
            position: 'append',
            lines: [
              "Route::get('/example', function () {",
              "    return Wreathe::render('example');",
              '});',
            ],
          },
        ],
      })

      if (typescript) {
        await renamePaths({
          paths: '_tsconfig.json',
          transformer: ({ base }) => `${base.slice(1)}`,
        })

        if (sandbox) {
          await editFiles({
            title: 'register Wreathe pages for testing',
            files: 'package.json',
            operations: [
              {
                type: 'edit-json',
                merge: {
                  name: `@wreathe-js/sandbox-${ui}`,
                },
              },
            ],
          })
        }
      }
    },
  })

  await group({
    title: 'install Node dependencies',
    handler: async () => {
      await editFiles({
        title: 'update package.json',
        files: 'package.json',
        operations: [
          { type: 'edit-json', delete: ['scripts', 'devDependencies'] },
          {
            type: 'edit-json',
            merge: {
              scripts: {
                dev: 'vite',
                build: 'vite build',
                ...(ssr && { 'build:ssr': 'vite build --ssr' }),
                ...(ssr && { 'build:prod': 'vite build && vite build --ssr' }),
                ...(ssr && {
                  preview: 'npm run build:prod && node bootstrap/ssr/ssr.js',
                }),
                clean: 'rm -rf public/build bootstrap/ssr',
                ...(sandbox && {
                  'sandbox:init': `preset apply ../../packages/presets --dev true --ui ${ui}`,
                }),
              },
            },
          },
        ],
      })

      await installPackages({
        title: 'install devDependencies',
        for: 'node',
        ...(sandbox && { packageManager: 'pnpm' }),
        packages: [
          // default
          sandbox ? `@wreathe-js/${ui}@workspace:*` : `@wreathe-js/${ui}`,
          typescript && '@types/node',
          'laravel-vite-plugin',
          'postcss',
          typescript && 'typescript',
          'vite',
          // preact
          ...(ui === 'preact'
            ? [
                '@preact/preset-vite',
                'preact',
                ssr && 'preact-render-to-string',
              ]
            : []),
          // react
          ...(ui === 'react'
            ? [
                typescript && '@types/react',
                typescript && '@types/react-dom',
                '@vitejs/plugin-react',
                'react',
                'react-dom',
              ]
            : []),
          // vue
          ...(ui === 'vue' ? ['@vitejs/plugin-vue', 'vue'] : []),
        ],
        dev: true,
      })

      await installPackages({
        title: 'install dependencies',
        for: 'node',
        ...(sandbox && { packageManager: 'pnpm' }),
        install: ['axios'],
      })
    },
  })
}
