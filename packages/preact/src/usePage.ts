import { useContext } from 'preact/hooks'
import PageContext from './PageContext'

export default function usePage() {
  const page = useContext(PageContext)

  if (!page) {
    throw new Error('usePage must be used within the Wreathe component')
  }

  return page
}
