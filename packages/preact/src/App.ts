import type { HeadManager } from './Head'
import HeadContext from './HeadContext'
import PageContext from './PageContext'
import type { AppType, PreactInstance } from './createWreatheApp'
import { createHeadManager, router } from '@wreathe-js/core'
import { h } from 'preact'
import { useEffect, useMemo, useState } from 'preact/hooks'

const App: AppType = ({
  children,
  initialPage,
  initialComponent,
  resolveComponent,
  titleCallback,
  onHeadUpdate,
}) => {
  const [current, setCurrent] = useState({
    component: initialComponent || null,
    page: initialPage,
    key: -1,
  })

  const headManager: HeadManager = useMemo(() => {
    return createHeadManager(
      typeof window === 'undefined',
      titleCallback || ((title) => title),
      onHeadUpdate || (() => {})
    )
  }, [])

  useEffect(() => {
    router.init({
      initialPage,
      resolveComponent,
      swapComponent: async ({ component, page, preserveState }) => {
        setCurrent((current) => ({
          component: component as PreactInstance,
          page,
          key: preserveState ? current.key : Date.now(),
        }))
      },
    })

    router.on('navigate', () => headManager.forceUpdate())
  }, [])

  if (!current.component) {
    return h(
      HeadContext.Provider,
      { value: headManager, children: undefined },
      h(
        PageContext.Provider,
        { value: current.page, children: undefined },
        null
      )
    )
  }

  const renderChildren =
    children ||
    (({ Component, props, key }: any) => {
      const child = h(Component, { key, ...props })

      if (typeof Component.layout === 'function') {
        return Component.layout(child)
      }

      if (Array.isArray(Component.layout)) {
        return Component.layout
          .concat(child)
          .reverse()
          .reduce((children: any, Layout: any) =>
            h(Layout, { children, ...props })
          )
      }

      return child
    })

  return h(
    HeadContext.Provider,
    { value: headManager, children: {} },
    h(
      PageContext.Provider,
      { value: current.page, children: {} },
      renderChildren({
        Component: current.component,
        key: current.key,
        props: current.page.props,
      })
    )
  )
}

App.displayName = 'Wreathe'

export default App
