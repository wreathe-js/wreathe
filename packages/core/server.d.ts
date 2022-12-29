import type { WreatheAppResponse, Page } from '@wreathe-js/core'

declare module '@wreathe-js/react/server' {
  export type AppCallback = (page: Page) => WreatheAppResponse
  export default function createServer(
    render: AppCallback,
    port?: number | undefined
  ): void
}
