import {
  type FormDataConvertible,
  type GlobalEventCallback,
  Method,
  type PreserveStateOption,
  mergeDataIntoQueryString,
  router,
  shouldIntercept,
} from '@wreathe-js/core'
import { createElement, forwardRef, useCallback } from 'react'

interface BaseWreatheLinkProps {
  as?: string
  data?: Record<string, FormDataConvertible>
  href: string
  method?: Method
  headers?: Record<string, string>
  onClick?: (
    event:
      | React.MouseEvent<HTMLAnchorElement>
      | React.KeyboardEvent<HTMLAnchorElement>
  ) => void
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
  Omit<React.HTMLAttributes<HTMLElement>, keyof BaseWreatheLinkProps> &
  Omit<React.AllHTMLAttributes<HTMLElement>, keyof BaseWreatheLinkProps>

type WreatheLink = React.FunctionComponent<WreatheLinkProps>

const noop = () => undefined

const Link: WreatheLink = forwardRef<unknown, WreatheLinkProps>(
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
      (event: any) => {
        onClick(event)

        if (shouldIntercept(event)) {
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

    as = as.toLowerCase()
    method = method.toLowerCase() as Method
    const [_href, _data] = mergeDataIntoQueryString(
      method,
      href || '',
      data,
      queryStringArrayFormat
    )
    href = _href
    data = _data

    if (as === 'a' && method !== 'get') {
      console.warn(
        `Creating POST/PUT/PATCH/DELETE <a> links is discouraged as it causes "Open Link in New Tab/Window" accessibility issues. Please specify a more appropriate element using the "as" attribute.`
      )
    }

    return createElement(
      as,
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

export default Link
