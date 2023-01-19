import { createHeadManager, router } from '@wreathe-js/core'
import { h } from 'preact'
import { useEffect, useMemo, useState } from 'preact/hooks'
import HeadContext from './HeadContext'
import PageContext from './PageContext'

export default function App({
  children,
  initialPage,
  initialComponent,
  resolveComponent,
  titleCallback,
  onHeadUpdate,
}: any) {
  const [current, setCurrent] = useState({
    component: initialComponent || null,
    page: initialPage,
    key: null,
  })

  const headManager = useMemo(() => {
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
        // @ts-expect-error TS(2345): Argument of type '(current: { component: any; page... Remove this comment to see the full error message
        setCurrent((current) => ({
          component,
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
      // @ts-expect-error
      { value: headManager },
      // @ts-expect-error
      h(PageContext.Provider, { value: current.page }, null)
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
    // @ts-expect-error
    { value: headManager },
    h(
      PageContext.Provider,
      // @ts-expect-error
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
