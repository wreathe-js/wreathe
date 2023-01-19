// @ts-nocheck
import { createWreatheApp } from '@wreathe-js/preact'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { render } from 'preact'

import './app.css'

createWreatheApp({
  progress: {
    delay: 250,
    color: 'red',
  },
  title: (title) => `${title} - Demo`,
  resolve: (name) =>
    resolvePageComponent(
      `../views/pages/${name}.tsx`,
      import.meta.glob('../views/pages/**/*.tsx')
    ),
  setup({ el, App, props }) {
    render(<App {...props} />, el)
  },
})
