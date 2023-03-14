import {
  type FormDataConvertible,
  type GlobalEventCallback,
  Method,
  type PreserveStateOption,
  mergeDataIntoQueryString,
  router,
  shouldIntercept,
} from '@wreathe-js/core'
import { h } from 'preact'
import { forwardRef } from 'preact/compat'
import { useCallback } from 'preact/hooks'

declare module 'preact' {
  export function h<P extends {}, T extends HTMLElement>(
    type: string,
    props: P & Omit<JSX.HTMLAttributes<T>, keyof P>,
    ...children: preact.ComponentChildren[]
  ): preact.VNode<unknown>
}

interface BaseWreatheLinkProps {
  as?: string /* keyof preact.JSX.IntrinsicElements */
  data?: Record<string, FormDataConvertible>
  href: string
  method?: Method
  headers?: Record<string, string>
  onClick?: (event: MouseEvent | KeyboardEvent) => void
  preserveScroll?: PreserveStateOption
  preserveState?: PreserveStateOption | null
  replace?: boolean
  only?: string[]
  queryStringArrayFormat?: 'indices' | 'brackets'
  onCancelToken?: ({
    cancel,
  }: {
    cancel: VoidFunction
  }) => void
  onBefore?: () => void
  onStart?: () => void
  onProgress?: GlobalEventCallback<'progress'> | undefined
  onFinish?: () => void
  onCancel?: () => void
  onSuccess?: () => void
  onError?: () => void
}

export type WreatheLinkProps = BaseWreatheLinkProps &
  Omit<preact.JSX.HTMLAttributes<HTMLElement>, keyof BaseWreatheLinkProps>

const noop = () => undefined

const Link = forwardRef<unknown, WreatheLinkProps>(
  (
    {
      children,
      as = 'a',
      data = {},
      href,
      method = 'get',
      preserveScroll = false,
      preserveState = null,
      replace = false,
      only = [],
      headers = {},
      queryStringArrayFormat = 'brackets',
      onClick = noop,
      onCancelToken = noop,
      onBefore = noop,
      onStart = noop,
      onProgress = noop,
      onFinish = noop,
      onCancel = noop,
      onSuccess = noop,
      onError = noop,
      ...props
    },
    ref
  ) => {
    const visit = useCallback(
      (event: KeyboardEvent | MouseEvent) => {
        onClick(event)

        if (shouldIntercept(event as KeyboardEvent)) {
          event.preventDefault()

          router.visit(href, {
            data,
            method,
            preserveScroll,
            preserveState: preserveState ?? method !== 'get',
            replace,
            only,
            headers,
            onCancelToken,
            onBefore,
            onStart,
            onProgress,
            onFinish,
            onCancel,
            onSuccess,
            onError,
          })
        }
      },
      [
        data,
        href,
        method,
        preserveScroll,
        preserveState,
        replace,
        only,
        headers,
        onClick,
        onCancelToken,
        onBefore,
        onStart,
        onProgress,
        onFinish,
        onCancel,
        onSuccess,
        onError,
      ]
    )

    const _as = typeof as === 'string' ? as.toLowerCase() : as

    method = method.toLowerCase() as Method
    const [_href, _data] = mergeDataIntoQueryString(
      method,
      href || '',
      data,
      queryStringArrayFormat
    )
    href = _href
    data = _data

    if (_as === 'a' && method !== 'get') {
      console.warn(
        `Creating POST/PUT/PATCH/DELETE <a> links is discouraged as it causes "Open Link in New Tab/Window" accessibility issues. Please specify a more appropriate element using the "as" attribute.`
      )
    }

    return h(
      _as,
      {
        ...props,
        ...(as === 'a' ? { href } : {}),
        ref,
        onClick: visit,
      },
      children
    )
  }
)

Link.displayName = 'WreatheLink'

export default Link
