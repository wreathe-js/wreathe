import { router } from '@wreathe-js/core'
import { useEffect, useState } from 'react'

export default function useRemember(initialState: any, key: any) {
  const [state, setState] = useState(() => {
    const restored = router.restore(key)

    return restored !== undefined ? restored : initialState
  })

  useEffect(() => {
    router.remember(state, key)
  }, [state, key])

  return [state, setState]
}
