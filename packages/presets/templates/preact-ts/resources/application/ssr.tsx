// @ts-nocheck
import { createWreatheApp } from '@wreathe-js/preact'
import createServer from '@wreathe-js/preact/server'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import renderToString from 'preact-render-to-string'

createServer((page) =>
  createWreatheApp({
    page,
    title: (title) => `${title} - Demo`,
    render: renderToString,
    resolve: (name) =>
      resolvePageComponent(
        `../views/pages/${name}.tsx`,
        import.meta.glob('../views/pages/**/*.tsx')
      ),
    setup: ({ App, props }) => <App {...props} />,
  })
)
