import { createWreatheApp } from '@wreathe-js/react'
import createServer from '@wreathe-js/react/server'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import ReactDOMServer from 'react-dom/server'

createServer((page) =>
  createWreatheApp({
    page,
    title: (title) => `${title} - Demo`,
    render: ReactDOMServer.renderToString,
    resolve: (name) =>
      resolvePageComponent(
        `../views/pages/${name}.tsx`,
        import.meta.glob('../views/pages/**/*.tsx')
      ),
    setup: ({ App, props }) => <App {...props} />,
  })
)
