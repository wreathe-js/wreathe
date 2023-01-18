import { createApp, h } from 'vue'
import { createWreatheApp } from '@wreathe-js/vue'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

import './app.css'

createWreatheApp({
  progress: {
    delay: 250,
    color: 'red',
  },
  title: (title) => `${title} - Demo`,
  resolve: (name) =>
    resolvePageComponent(
      `../views/pages/${name}.vue`,
      import.meta.glob('../views/pages/**/*.vue')
    ),
  setup({ el, App, props, plugin }) {
    return createApp({ render: () => h(App, props) })
      .use(plugin)
      .mount(el)
  },
})
