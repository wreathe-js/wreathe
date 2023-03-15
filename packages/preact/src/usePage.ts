import PageContext from './PageContext'
import type { Page, PageProps } from '@wreathe-js/core'
import { useContext } from 'preact/hooks'

export default function usePage<T extends PageProps = PageProps>(): Page<T> {
  const page = useContext(PageContext)

  if (!page) {
    throw new Error('usePage must be used within the wreathe component')
  }

  return page as Page<T>
}
