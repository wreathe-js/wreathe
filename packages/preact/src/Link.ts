import {
  mergeDataIntoQueryString,
  router,
  shouldIntercept,
} from '@wreathe-js/core'
import { h } from 'preact'
import { forwardRef } from 'preact/compat'
import { useCallback } from 'preact/hooks'

const noop = () => undefined

export default forwardRef(function Link(
  {
    // @ts-expect-error TS(2339): Property 'children' does not exist on type '{}'.
    children,
    // @ts-expect-error TS(2339): Property 'as' does not exist on type '{}'.
    as = 'a',
    // @ts-expect-error TS(2339): Property 'data' does not exist on type '{}'.
    data = {},
    // @ts-expect-error TS(2339): Property 'href' does not exist on type '{}'.
    href,
    // @ts-expect-error TS(2339): Property 'method' does not exist on type '{}'.
    method = 'get',
    // @ts-expect-error TS(2339): Property 'preserveScroll' does not exist on type '... Remove this comment to see the full error message
    preserveScroll = false,
    // @ts-expect-error TS(2339): Property 'preserveState' does not exist on type '{... Remove this comment to see the full error message
    preserveState = null,
    // @ts-expect-error TS(2339): Property 'replace' does not exist on type '{}'.
    replace = false,
    // @ts-expect-error TS(2339): Property 'only' does not exist on type '{}'.
    only = [],
    // @ts-expect-error TS(2339): Property 'headers' does not exist on type '{}'.
    headers = {},
    // @ts-expect-error TS(2339): Property 'queryStringArrayFormat' does not exist o... Remove this comment to see the full error message
    queryStringArrayFormat = 'brackets',
    // @ts-expect-error TS(2339): Property 'onClick' does not exist on type '{}'.
    onClick = noop,
    // @ts-expect-error TS(2339): Property 'onCancelToken' does not exist on type '{... Remove this comment to see the full error message
    onCancelToken = noop,
    // @ts-expect-error TS(2339): Property 'onBefore' does not exist on type '{}'.
    onBefore = noop,
    // @ts-expect-error TS(2339): Property 'onStart' does not exist on type '{}'.
    onStart = noop,
    // @ts-expect-error TS(2339): Property 'onProgress' does not exist on type '{}'.
    onProgress = noop,
    // @ts-expect-error TS(2339): Property 'onFinish' does not exist on type '{}'.
    onFinish = noop,
    // @ts-expect-error TS(2339): Property 'onCancel' does not exist on type '{}'.
    onCancel = noop,
    // @ts-expect-error TS(2339): Property 'onSuccess' does not exist on type '{}'.
    onSuccess = noop,
    // @ts-expect-error TS(2339): Property 'onError' does not exist on type '{}'.
    onError = noop,
    ...props
  },
  ref
) {
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
  method = method.toLowerCase()
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

  return h(
    as,
    {
      ...props,
      ...(as === 'a' ? { href } : {}),
      ref,
      onClick: visit,
    },
    children
  )
})
