import { createContext } from 'react'

// @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
const pageContext = createContext()
pageContext.displayName = 'WreathePageContext'

export default pageContext
