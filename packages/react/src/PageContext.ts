import type { Page } from '@wreathe-js/core'
import { createContext } from 'react'

const pageContext = createContext(undefined as unknown as Page)
pageContext.displayName = 'WreathePageContext'

export default pageContext
