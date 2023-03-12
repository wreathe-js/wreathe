import type { HeadManager } from './Head'
import HeadContext from './HeadContext'
import PageContext from './PageContext'
import type { AppType } from './createWreatheApp'
import { createHeadManager, router } from '@wreathe-js/core'
import { createElement, useEffect, useMemo, useState } from 'react'

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
          component: component as React.ReactElement,
          page,
          key: preserveState ? current.key : Date.now(),
        }))
      },
    })

    router.on('navigate', () => headManager.forceUpdate())
  }, [])

  if (!current.component) {
    return createElement(
      HeadContext.Provider,
      { value: headManager },
      createElement(PageContext.Provider, { value: current.page }, null)
    )
  }

  const renderChildren =
    children ||
    (({ Component, props, key }: any) => {
      const child = createElement(Component, { key, ...props })

      if (typeof Component.layout === 'function') {
        return Component.layout(child)
      }

      if (Array.isArray(Component.layout)) {
        return Component.layout
          .concat(child)
          .reverse()
          .reduce((children: any, Layout: any) =>
            createElement(Layout, { children, ...props })
          )
      }

      return child
    })

  return createElement(
    HeadContext.Provider,
    { value: headManager },
    createElement(
      PageContext.Provider,
      { value: current.page },
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
