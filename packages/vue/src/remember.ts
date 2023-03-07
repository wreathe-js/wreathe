import { router } from '@wreathe-js/core'
import cloneDeep from 'lodash.clonedeep'

export default {
  created() {
    // @ts-expect-error TS(2339): Property '$options' does not exist on type '{ crea... Remove this comment to see the full error message
    if (!this.$options.remember) {
      return
    }

    // @ts-expect-error TS(2339): Property '$options' does not exist on type '{ crea... Remove this comment to see the full error message
    if (Array.isArray(this.$options.remember)) {
      // @ts-expect-error TS(2339): Property '$options' does not exist on type '{ crea... Remove this comment to see the full error message
      this.$options.remember = { data: this.$options.remember }
    }

    // @ts-expect-error TS(2339): Property '$options' does not exist on type '{ crea... Remove this comment to see the full error message
    if (typeof this.$options.remember === 'string') {
      // @ts-expect-error TS(2339): Property '$options' does not exist on type '{ crea... Remove this comment to see the full error message
      this.$options.remember = { data: [this.$options.remember] }
    }

    // @ts-expect-error TS(2339): Property '$options' does not exist on type '{ crea... Remove this comment to see the full error message
    if (typeof this.$options.remember.data === 'string') {
      // @ts-expect-error TS(2339): Property '$options' does not exist on type '{ crea... Remove this comment to see the full error message
      this.$options.remember = { data: [this.$options.remember.data] }
    }

    const rememberKey =
      // @ts-expect-error TS(2339): Property '$options' does not exist on type '{ crea... Remove this comment to see the full error message
      this.$options.remember.key instanceof Function
        ? // @ts-expect-error TS(2339): Property '$options' does not exist on type '{ crea... Remove this comment to see the full error message
          this.$options.remember.key.call(this)
        : // @ts-expect-error TS(2339): Property '$options' does not exist on type '{ crea... Remove this comment to see the full error message
          this.$options.remember.key

    const restored = router.restore(rememberKey)

    // @ts-expect-error TS(2339): Property '$options' does not exist on type '{ crea... Remove this comment to see the full error message
    const rememberable = this.$options.remember.data.filter((key: any) => {
      return !(
        // rome-ignore format: temp
        (
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          this[key] !== null &&
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          typeof this[key] === 'object' &&
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          this[key].__rememberable === false
        )
      )
    })

    const hasCallbacks = (key: any) => {
      return (
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this[key] !== null &&
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        typeof this[key] === 'object' &&
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        typeof this[key].__remember === 'function' &&
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        typeof this[key].__restore === 'function'
      )
    }

    rememberable.forEach((key: any) => {
      if (
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this[key] !== undefined &&
        restored !== undefined &&
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        restored[key] !== undefined
      ) {
        hasCallbacks(key)
          ? // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            this[key].__restore(restored[key])
          : // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            (this[key] = restored[key])
      }

      // @ts-expect-error TS(2339): Property '$watch' does not exist on type '{ create... Remove this comment to see the full error message
      this.$watch(
        key,
        () => {
          router.remember(
            rememberable.reduce(
              // @ts-expect-error TS(7006): Parameter 'data' implicitly has an 'any' type.
              (data, key) => ({
                ...data,
                [key]: cloneDeep(
                  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                  hasCallbacks(key) ? this[key].__remember() : this[key]
                ),
              }),
              {}
            ),
            rememberKey
          )
        },
        { immediate: true, deep: true }
      )
    })
  },
}
