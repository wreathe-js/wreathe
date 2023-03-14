import { router } from '@wreathe-js/core'
import { useEffect, useState } from 'preact/hooks'

type SetStateAction<S> = S | ((prevState: S) => S)
type Dispatch<A> = (value: A) => void

export default function useRemember<State>(
  initialState: State,
  key?: string
): [State, Dispatch<SetStateAction<State>>] {
  const [state, setState] = useState(() => {
    const restored = router.restore(key) as State

    return restored !== undefined ? restored : initialState
  })

  useEffect(() => {
    router.remember(state, key)
  }, [state, key])

  return [state, setState]
}
