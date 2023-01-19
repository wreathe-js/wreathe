// @ts-nocheck
import { Head } from '@wreathe-js/preact'
import { Fragment } from 'preact'

import Counter from '@/views/components/counter'
import Layout from '@/views/layouts/default'

const Example = () => {
  return (
    <Fragment>
      <Head title="Example" />
      <h1>Counter</h1>
      <p>
        This is a simple, hydrated <code>Counter</code> component.
      </p>
      <Counter />
    </Fragment>
  )
}

Example.layout = (page: Page) => <Layout children={page} />

export default Example
