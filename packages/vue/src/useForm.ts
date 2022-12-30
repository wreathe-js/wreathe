import { router } from '@wreathe-js/core'
import cloneDeep from 'lodash.clonedeep'
import isEqual from 'lodash.isequal'
import { reactive, watch } from 'vue'

export default function useForm(...args: any[]) {
  const rememberKey = typeof args[0] === 'string' ? args[0] : null
  const data = (typeof args[0] === 'string' ? args[1] : args[0]) || {}
  const restored = rememberKey ? router.restore(rememberKey) : null
  let defaults = cloneDeep(data)
  let cancelToken: any = null
  let recentlySuccessfulTimeoutId: any = null
  let transform = (data: any) => data

  let form = reactive({
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    ...(restored ? restored.data : data),
    isDirty: false,
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    errors: restored ? restored.errors : {},
    hasErrors: false,
    processing: false,
    progress: null,
    wasSuccessful: false,
    recentlySuccessful: false,
    data() {
      return Object.keys(data).reduce((carry, key) => {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        carry[key] = this[key]
        return carry
      }, {})
    },
    transform(callback: any) {
      transform = callback

      return this
    },
    defaults(key: any, value: any) {
      if (typeof key === 'undefined') {
        defaults = this.data()
      } else {
        defaults = Object.assign(
          {},
          cloneDeep(defaults),
          value ? { [key]: value } : key
        )
      }

      return this
    },
    reset(...fields: any[]) {
      let clonedDefaults = cloneDeep(defaults)
      if (fields.length === 0) {
        Object.assign(this, clonedDefaults)
      } else {
        Object.assign(
          this,
          Object.keys(clonedDefaults)
            .filter((key) => fields.includes(key))
            .reduce((carry, key) => {
              // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
              carry[key] = clonedDefaults[key]
              return carry
            }, {})
        )
      }

      return this
    },
    setError(key: any, value: any) {
      Object.assign(this.errors, value ? { [key]: value } : key)

      this.hasErrors = Object.keys(this.errors).length > 0

      return this
    },
    clearErrors(...fields: any[]) {
      this.errors = Object.keys(this.errors).reduce(
        (carry, field) => ({
          ...carry,
          ...(fields.length > 0 && !fields.includes(field)
            ? { [field]: this.errors[field] }
            : {}),
        }),
        {}
      )

      this.hasErrors = Object.keys(this.errors).length > 0

      return this
    },
    submit(method: any, url: any, options = {}) {
      const data = transform(this.data())
      const _options = {
        ...options,
        onCancelToken: (token: any) => {
          cancelToken = token

          // @ts-expect-error TS(2339): Property 'onCancelToken' does not exist on type '{... Remove this comment to see the full error message
          if (options.onCancelToken) {
            // @ts-expect-error TS(2339): Property 'onCancelToken' does not exist on type '{... Remove this comment to see the full error message
            return options.onCancelToken(token)
          }
        },
        onBefore: (visit: any) => {
          this.wasSuccessful = false
          this.recentlySuccessful = false
          clearTimeout(recentlySuccessfulTimeoutId)

          // @ts-expect-error TS(2339): Property 'onBefore' does not exist on type '{}'.
          if (options.onBefore) {
            // @ts-expect-error TS(2339): Property 'onBefore' does not exist on type '{}'.
            return options.onBefore(visit)
          }
        },
        onStart: (visit: any) => {
          this.processing = true

          // @ts-expect-error TS(2339): Property 'onStart' does not exist on type '{}'.
          if (options.onStart) {
            // @ts-expect-error TS(2339): Property 'onStart' does not exist on type '{}'.
            return options.onStart(visit)
          }
        },
        onProgress: (event: any) => {
          this.progress = event

          // @ts-expect-error TS(2339): Property 'onProgress' does not exist on type '{}'.
          if (options.onProgress) {
            // @ts-expect-error TS(2339): Property 'onProgress' does not exist on type '{}'.
            return options.onProgress(event)
          }
        },
        onSuccess: async (page: any) => {
          this.processing = false
          this.progress = null
          this.clearErrors()
          this.wasSuccessful = true
          this.recentlySuccessful = true
          recentlySuccessfulTimeoutId = setTimeout(
            () => (this.recentlySuccessful = false),
            2000
          )

          // @ts-expect-error TS(2339): Property 'onSuccess' does not exist on type '{}'.
          const onSuccess = options.onSuccess
            ? // @ts-expect-error TS(2339): Property 'onSuccess' does not exist on type '{}'.
              await options.onSuccess(page)
            : null
          defaults = cloneDeep(this.data())
          this.isDirty = false
          return onSuccess
        },
        onError: (errors: any) => {
          this.processing = false
          this.progress = null
          this.clearErrors().setError(errors)

          // @ts-expect-error TS(2339): Property 'onError' does not exist on type '{}'.
          if (options.onError) {
            // @ts-expect-error TS(2339): Property 'onError' does not exist on type '{}'.
            return options.onError(errors)
          }
        },
        onCancel: () => {
          this.processing = false
          this.progress = null

          // @ts-expect-error TS(2339): Property 'onCancel' does not exist on type '{}'.
          if (options.onCancel) {
            // @ts-expect-error TS(2339): Property 'onCancel' does not exist on type '{}'.
            return options.onCancel()
          }
        },
        onFinish: () => {
          this.processing = false
          this.progress = null
          cancelToken = null

          // @ts-expect-error TS(2339): Property 'onFinish' does not exist on type '{}'.
          if (options.onFinish) {
            // @ts-expect-error TS(2339): Property 'onFinish' does not exist on type '{}'.
            return options.onFinish()
          }
        },
      }

      if (method === 'delete') {
        router.delete(url, { ..._options, data })
      } else {
        // @ts-expect-error TS(7052): Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        router[method](url, data, _options)
      }
    },
    get(url: any, options: any) {
      this.submit('get', url, options)
    },
    post(url: any, options: any) {
      this.submit('post', url, options)
    },
    put(url: any, options: any) {
      this.submit('put', url, options)
    },
    patch(url: any, options: any) {
      this.submit('patch', url, options)
    },
    delete(url: any, options: any) {
      this.submit('delete', url, options)
    },
    cancel() {
      if (cancelToken) {
        cancelToken.cancel()
      }
    },
    __rememberable: rememberKey === null,
    __remember() {
      return { data: this.data(), errors: this.errors }
    },
    __restore(restored: any) {
      Object.assign(this, restored.data)
      this.setError(restored.errors)
    },
  })

  watch(
    form,
    (newValue) => {
      form.isDirty = !isEqual(form.data(), defaults)
      if (rememberKey) {
        router.remember(cloneDeep(newValue.__remember()), rememberKey)
      }
    },
    { immediate: true, deep: true }
  )

  return form
}
