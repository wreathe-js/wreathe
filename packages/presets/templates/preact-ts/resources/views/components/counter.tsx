// @ts-nocheck
import { useState } from 'preact/hooks'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button type="button" onClick={() => setCount((count) => count + 1)}>
      Counter {count}
    </button>
  )
}
