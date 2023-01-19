import { createContext } from 'preact'

// @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
const headContext = createContext()
headContext.displayName = 'WreatheHeadContext'

export default headContext
