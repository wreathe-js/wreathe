import { renderToString } from '@vue/server-renderer'
import { createWreatheApp } from '@wreathe-js/vue'
import createServer from '@wreathe-js/vue/server'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createSSRApp, h } from 'vue'

createServer((page) =>
  createWreatheApp({
    page,
    title: (title) => `${title} - Demo`,
    render: renderToString,
    resolve: (name) =>
      resolvePageComponent(
        `../views/pages/${name}.vue`,
        import.meta.glob('../views/pages/**/*.vue')
      ),
    setup: ({ App, props, plugin }) => {
      return createSSRApp({ render: () => h(App, props) }).use(plugin)
    },
  })
)
