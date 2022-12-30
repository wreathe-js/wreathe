import { setupProgress } from '@wreathe-js/core'
import { createSSRApp, h } from 'vue'
import App, { plugin } from './app'

export default async function createWreatheApp({
  id = 'app',
  resolve,
  setup,
  title,
  progress = {},
  page,
  render,
}: any) {
  const isServer = typeof window === 'undefined'
  const el = isServer ? null : document.getElementById(id)
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  const initialPage = page || JSON.parse(el.dataset.page)
  const resolveComponent = (name: any) =>
    Promise.resolve(resolve(name)).then((module) => module.default || module)

  let head: any = []

  const vueApp = await resolveComponent(initialPage.component).then(
    (initialComponent) => {
      return setup({
        el,
        App,
        props: {
          initialPage,
          initialComponent,
          resolveComponent,
          titleCallback: title,
          onHeadUpdate: isServer ? (elements: any) => (head = elements) : null,
        },
        plugin,
      })
    }
  )

  if (!isServer && progress) {
    setupProgress(progress)
  }

  if (isServer) {
    const body = await render(
      createSSRApp({
        render: () =>
          h('div', {
            id,
            'data-page': JSON.stringify(initialPage),
            innerHTML: render(vueApp),
          }),
      })
    )

    return { head, body }
  }
}
