import type { HeadManager } from './Head'
import { createContext } from 'preact'

const headContext = createContext<HeadManager>({} as HeadManager)
headContext.displayName = 'WreatheHeadContext'

export default headContext
