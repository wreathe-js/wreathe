// @ts-nocheck
import type {
  Page as _Page,
  PageProps,
  Errors,
  ErrorBag,
} from '@wreathe-js/core'

declare global {
  export interface Page extends _Page<PageProps> {
    props: {
      errors: Errors & ErrorBag
      auth: {
        user: {
          name: string
        }
      }
      versions: {
        laravel: string
        php: string
      }
    }
  }

  export interface LayoutProps {
    children?: preact.Component | undefined
  }
}
