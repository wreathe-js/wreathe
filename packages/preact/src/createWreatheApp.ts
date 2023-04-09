import App from './App'
import type { HeadManagerOnUpdate } from './Head'
import {
  type Page,
  type PageProps,
  type PageResolver,
  setupProgress,
} from '@wreathe-js/core'
import { h } from 'preact'
import renderToString from 'preact-render-to-string'

export type PreactInstance = preact.VNode
export type PreactComponent = preact.ComponentChildren

export type AppType<SharedProps extends PageProps = PageProps> =
  preact.FunctionComponent<
    {
      children?: (props: {
        Component: PreactComponent
        key: preact.Key
        props: Page<SharedProps>['props']
      }) => PreactComponent
    } & SetupOptions<unknown, SharedProps>['props']
  >

type SetupOptions<ElementType, SharedProps extends PageProps> = {
  el: ElementType | HTMLElement | null
  App: AppType
  props: {
    initialPage: Page<SharedProps>
    initialComponent: PreactComponent
    resolveComponent: PageResolver
    titleCallback?: HeadManagerTitleCallback
    onHeadUpdate?: HeadManagerOnUpdate | null
  }
}

type HeadManagerTitleCallback = (title: string) => string

type BaseWreatheAppOptions = {
  title?: HeadManagerTitleCallback
  resolve: PageResolver
}

type CreateWreatheAppSetupReturnType = PreactInstance
type WreatheAppOptionsForCSR<SharedProps extends PageProps> =
  BaseWreatheAppOptions & {
    id?: string
    page?: Page | string
    progress?:
      | false
      | {
          delay?: number
          color?: string
          includeCSS?: boolean
          showSpinner?: boolean
        }
    render?: undefined
    setup(
      options: SetupOptions<HTMLElement, SharedProps>
    ): CreateWreatheAppSetupReturnType
  }

type CreateWreatheAppSSRContent = { head: string[]; body: string }
type WreatheAppOptionsForSSR<SharedProps extends PageProps> =
  BaseWreatheAppOptions & {
    id?: undefined
    page: Page | string
    progress?: undefined
    render: typeof renderToString
    setup(options: SetupOptions<null, SharedProps>): PreactInstance
  }

async function createWreatheApp<SharedProps extends PageProps = PageProps>(
  options: WreatheAppOptionsForCSR<SharedProps>
): Promise<CreateWreatheAppSetupReturnType>

async function createWreatheApp<SharedProps extends PageProps = PageProps>(
  options: WreatheAppOptionsForSSR<SharedProps>
): Promise<CreateWreatheAppSSRContent>

async function createWreatheApp<SharedProps extends PageProps = PageProps>({
  id = 'app',
  resolve,
  setup,
  title,
  progress = {},
  page,
  render,
}:
  | WreatheAppOptionsForCSR<SharedProps>
  | WreatheAppOptionsForSSR<SharedProps>): Promise<
  CreateWreatheAppSetupReturnType | CreateWreatheAppSSRContent | undefined
> {
  const isServer = typeof window === 'undefined'
  const el = isServer ? null : document.getElementById(id)

  const initialPage: Page<SharedProps> =
    page || JSON.parse(el?.dataset.page as string)

  const resolveComponent = (name: string) =>
    Promise.resolve(resolve(name)).then((module) => {
      if (module === null) {
        return
      }
      return typeof module === 'object' && 'default' in module
        ? (module.default as PreactComponent)
        : (module as PreactComponent)
    })

  let head: string[] = []

  const preactApp = await resolveComponent(initialPage.component).then(
    (initialComponent) => {
      return setup({
        el,
        App,
        props: {
          initialPage,
          initialComponent,
          resolveComponent,
          titleCallback: title,
          onHeadUpdate: isServer
            ? (elements: string[]) => (head = elements)
            : null,
        },
      })
    }
  )

  if (!isServer && progress) {
    setupProgress(progress)
  }

  if (isServer && render) {
    const body = render(
      h(
        'div',
        {
          id,
          'data-page': JSON.stringify(initialPage),
        },
        preactApp
      )
    )

    return { head, body }
  }
}

export default createWreatheApp
