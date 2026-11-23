import { useCallback, useEffect, useRef, useState } from "react"

export type CopyState = "idle" | "copied" | "failed"

export function useCopy(resetAfterMs = 1600) {
  const [state, setState] = useState<{ key: string | null; status: CopyState }>({
    key: null,
    status: "idle",
  })
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = useCallback(
    async (key: string, value: string) => {
      let status: CopyState = "copied"
      try {
        await navigator.clipboard.writeText(value)
      } catch {
        status = "failed"
      }
      setState({ key, status })
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setState({ key: null, status: "idle" }), resetAfterMs)
    },
    [resetAfterMs],
  )

  const statusFor = (key: string): CopyState => (state.key === key ? state.status : "idle")

  return { copy, statusFor }
}
