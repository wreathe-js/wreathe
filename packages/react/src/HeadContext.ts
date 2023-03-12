import type { HeadManager } from './Head'
import { createContext } from 'react'

const headContext = createContext(undefined as unknown as HeadManager)
headContext.displayName = 'WreatheHeadContext'

export default headContext
