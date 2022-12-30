import { createHeadManager, router } from '@wreathe-js/core'
import { computed, h, markRaw, ref, shallowRef } from 'vue'
import remember from './remember'
import useForm from './useForm'

const component = ref(null)
const page = ref({})
const layout = shallowRef(null)
const key = ref(null)
let headManager: any = null

export default {
  name: 'Wreathe',
  props: {
    initialPage: {
      type: Object,
      required: true,
    },
    initialComponent: {
      type: Object,
      required: false,
    },
    resolveComponent: {
      type: Function,
      required: false,
    },
    titleCallback: {
      type: Function,
      required: false,
      default: (title: any) => title,
    },
    onHeadUpdate: {
      type: Function,
      required: false,
      default: () => () => {},
    },
  },
  setup({
    initialPage,
    initialComponent,
    resolveComponent,
    titleCallback,
    onHeadUpdate,
  }: any) {
    component.value = initialComponent ? markRaw(initialComponent) : null
    page.value = initialPage
    key.value = null

    const isServer = typeof window === 'undefined'
    headManager = createHeadManager(isServer, titleCallback, onHeadUpdate)

    if (!isServer) {
      router.init({
        initialPage,
        resolveComponent,
        swapComponent: async (args) => {
          // @ts-expect-error TS(2322): Type 'Raw<object>' is not assignable to type 'null... Remove this comment to see the full error message
          component.value = markRaw(args.component)
          page.value = args.page
          // @ts-expect-error TS(2322): Type 'number | null' is not assignable to type 'nu... Remove this comment to see the full error message
          key.value = args.preserveState ? key.value : Date.now()
        },
      })

      router.on('navigate', () => headManager.forceUpdate())
    }

    return () => {
      if (component.value) {
        // @ts-expect-error TS(2339): Property 'inheritAttrs' does not exist on type 'ne... Remove this comment to see the full error message
        component.value.inheritAttrs = !!component.value.inheritAttrs

        const child = h(component.value, {
          // @ts-expect-error TS(2339): Property 'props' does not exist on type '{}'.
          ...page.value.props,
          key: key.value,
        })

        if (layout.value) {
          // @ts-expect-error TS(2339): Property 'layout' does not exist on type 'never'.
          component.value.layout = layout.value
          layout.value = null
        }

        // @ts-expect-error TS(2339): Property 'layout' does not exist on type 'never'.
        if (component.value.layout) {
          // @ts-expect-error TS(2339): Property 'layout' does not exist on type 'never'.
          if (typeof component.value.layout === 'function') {
            // @ts-expect-error TS(2339): Property 'layout' does not exist on type 'never'.
            return component.value.layout(h, child)
          }

          return (
            // @ts-expect-error TS(2339): Property 'layout' does not exist on type 'never'.
            (
              Array.isArray(component.value.layout)
                ? // @ts-expect-error TS(2339): Property 'layout' does not exist on type 'never'.
                  component.value.layout
                : // @ts-expect-error TS(2339): Property 'layout' does not exist on type 'never'.
                  [component.value.layout]
            )
              .concat(child)
              .reverse()
              .reduce((child: any, layout: any) => {
                layout.inheritAttrs = !!layout.inheritAttrs
                // @ts-expect-error TS(2339): Property 'props' does not exist on type '{}'.
                return h(layout, { ...page.value.props }, () => child)
              })
          )
        }

        return child
      }
    }
  },
}

export const plugin = {
  install(app: any) {
    // @ts-expect-error TS(2339): Property 'form' does not exist on type 'Router'.
    router.form = useForm

    Object.defineProperty(app.config.globalProperties, '$wreathe', {
      get: () => router,
    })
    Object.defineProperty(app.config.globalProperties, '$page', {
      get: () => page.value,
    })
    Object.defineProperty(app.config.globalProperties, '$headManager', {
      get: () => headManager,
    })

    app.mixin(remember)
  },
}

export function usePage() {
  return {
    // @ts-expect-error TS(2339): Property 'props' does not exist on type '{}'.
    props: computed(() => page.value.props),
    // @ts-expect-error TS(2339): Property 'url' does not exist on type '{}'.
    url: computed(() => page.value.url),
    // @ts-expect-error TS(2339): Property 'component' does not exist on type '{}'.
    component: computed(() => page.value.component),
    // @ts-expect-error TS(2339): Property 'version' does not exist on type '{}'.
    version: computed(() => page.value.version),
  }
}

export function defineLayout(component: any) {
  layout.value = component
}
