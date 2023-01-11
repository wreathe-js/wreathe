import { router } from '@wreathe-js/core'
import isEqual from 'lodash.isequal'
import { useCallback, useEffect, useRef, useState } from 'react'
import useRemember from './useRemember'

export default function useForm(...args: any[]) {
  const isMounted = useRef(null)
  const rememberKey = typeof args[0] === 'string' ? args[0] : null
  const [defaults, setDefaults] = useState(
    (typeof args[0] === 'string' ? args[1] : args[0]) || {}
  )
  const cancelToken = useRef(null)
  const recentlySuccessfulTimeoutId = useRef(null)
  const [data, setData] = rememberKey
    ? useRemember(defaults, `${rememberKey}:data`)
    : useState(defaults)
  const [errors, setErrors] = rememberKey
    ? useRemember({}, `${rememberKey}:errors`)
    : useState({})
  const [hasErrors, setHasErrors] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(null)
  const [wasSuccessful, setWasSuccessful] = useState(false)
  const [recentlySuccessful, setRecentlySuccessful] = useState(false)
  let transform = (data: any) => data

  useEffect(() => {
    // @ts-expect-error TS(2322): Type 'true' is not assignable to type 'null'.
    isMounted.current = true
    return () => {
      // @ts-expect-error TS(2322): Type 'false' is not assignable to type 'null'.
      isMounted.current = false
    }
  }, [])

  const submit = useCallback(
    (method: any, url: any, options = {}) => {
      const _options = {
        ...options,
        onCancelToken: (token: any) => {
          cancelToken.current = token

          // @ts-expect-error TS(2339): Property 'onCancelToken' does not exist on type '{... Remove this comment to see the full error message
          if (options.onCancelToken) {
            // @ts-expect-error TS(2339): Property 'onCancelToken' does not exist on type '{... Remove this comment to see the full error message
            return options.onCancelToken(token)
          }
        },
        onBefore: (visit: any) => {
          setWasSuccessful(false)
          setRecentlySuccessful(false)
          // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
          clearTimeout(recentlySuccessfulTimeoutId.current)

          // @ts-expect-error TS(2339): Property 'onBefore' does not exist on type '{}'.
          if (options.onBefore) {
            // @ts-expect-error TS(2339): Property 'onBefore' does not exist on type '{}'.
            return options.onBefore(visit)
          }
        },
        onStart: (visit: any) => {
          setProcessing(true)

          // @ts-expect-error TS(2339): Property 'onStart' does not exist on type '{}'.
          if (options.onStart) {
            // @ts-expect-error TS(2339): Property 'onStart' does not exist on type '{}'.
            return options.onStart(visit)
          }
        },
        onProgress: (event: any) => {
          setProgress(event)

          // @ts-expect-error TS(2339): Property 'onProgress' does not exist on type '{}'.
          if (options.onProgress) {
            // @ts-expect-error TS(2339): Property 'onProgress' does not exist on type '{}'.
            return options.onProgress(event)
          }
        },
        onSuccess: (page: any) => {
          if (isMounted.current) {
            setProcessing(false)
            setProgress(null)
            setErrors({})
            setHasErrors(false)
            setWasSuccessful(true)
            setRecentlySuccessful(true)
            // @ts-expect-error TS(2322): Type 'number' is not assignable to type 'null'.
            recentlySuccessfulTimeoutId.current = setTimeout(() => {
              if (isMounted.current) {
                setRecentlySuccessful(false)
              }
            }, 2000)
          }

          // @ts-expect-error TS(2339): Property 'onSuccess' does not exist on type '{}'.
          if (options.onSuccess) {
            // @ts-expect-error TS(2339): Property 'onSuccess' does not exist on type '{}'.
            return options.onSuccess(page)
          }
        },
        onError: (errors: any) => {
          if (isMounted.current) {
            setProcessing(false)
            setProgress(null)
            setErrors(errors)
            setHasErrors(true)
          }

          // @ts-expect-error TS(2339): Property 'onError' does not exist on type '{}'.
          if (options.onError) {
            // @ts-expect-error TS(2339): Property 'onError' does not exist on type '{}'.
            return options.onError(errors)
          }
        },
        onCancel: () => {
          if (isMounted.current) {
            setProcessing(false)
            setProgress(null)
          }

          // @ts-expect-error TS(2339): Property 'onCancel' does not exist on type '{}'.
          if (options.onCancel) {
            // @ts-expect-error TS(2339): Property 'onCancel' does not exist on type '{}'.
            return options.onCancel()
          }
        },
        onFinish: () => {
          if (isMounted.current) {
            setProcessing(false)
            setProgress(null)
          }

          cancelToken.current = null

          // @ts-expect-error TS(2339): Property 'onFinish' does not exist on type '{}'.
          if (options.onFinish) {
            // @ts-expect-error TS(2339): Property 'onFinish' does not exist on type '{}'.
            return options.onFinish()
          }
        },
      }

      if (method === 'delete') {
        router.delete(url, { ..._options, data: transform(data) })
      } else {
        // @ts-expect-error TS(7052): Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        router[method](url, transform(data), _options)
      }
    },
    [data, setErrors]
  )

  return {
    data,
    setData(key: any, value: any) {
      if (typeof key === 'string') {
        setData({ ...data, [key]: value })
      } else if (typeof key === 'function') {
        setData((data: any) => key(data))
      } else {
        setData(key)
      }
    },
    isDirty: !isEqual(data, defaults),
    errors,
    hasErrors,
    processing,
    progress,
    wasSuccessful,
    recentlySuccessful,
    transform(callback: any) {
      transform = callback
    },
    setDefaults(key: any, value: any) {
      if (typeof key === 'undefined') {
        setDefaults(() => data)
      } else {
        setDefaults((defaults: any) => ({
          ...defaults,
          ...(value ? { [key]: value } : key),
        }))
      }
    },
    reset(...fields: any[]) {
      if (fields.length === 0) {
        setData(defaults)
      } else {
        setData(
          Object.keys(defaults)
            .filter((key) => fields.includes(key))
            .reduce(
              (carry, key) => {
                carry[key] = defaults[key]
                return carry
              },
              { ...data }
            )
        )
      }
    },
    setError(key: any, value: any) {
      setErrors((errors: any) => {
        const newErrors = {
          ...errors,
          ...(value ? { [key]: value } : key),
        }
        setHasErrors(Object.keys(newErrors).length > 0)
        return newErrors
      })
    },
    clearErrors(...fields: any[]) {
      setErrors((errors: any) => {
        const newErrors = Object.keys(errors).reduce(
          (carry, field) => ({
            ...carry,
            ...(fields.length > 0 && !fields.includes(field)
              ? { [field]: errors[field] }
              : {}),
          }),
          {}
        )
        setHasErrors(Object.keys(newErrors).length > 0)
        return newErrors
      })
    },
    submit,
    get(url: any, options: any) {
      submit('get', url, options)
    },
    post(url: any, options: any) {
      submit('post', url, options)
    },
    put(url: any, options: any) {
      submit('put', url, options)
    },
    patch(url: any, options: any) {
      submit('patch', url, options)
    },
    delete(url: any, options: any) {
      submit('delete', url, options)
    },
    cancel() {
      if (cancelToken.current) {
        // @ts-expect-error TS(2339): Property 'cancel' does not exist on type 'never'.
        cancelToken.current.cancel()
      }
    },
  }
}
