import type { Page } from '@wreathe-js/core'
import { createContext } from 'preact'

const pageContext = createContext<Page | undefined>(undefined)
pageContext.displayName = 'WreathePageContext'

export default pageContext
