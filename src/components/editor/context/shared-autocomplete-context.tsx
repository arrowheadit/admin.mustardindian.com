import * as React from "react"
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

type Suggestion = null | string
type CallbackFn = (newSuggestion: Suggestion) => void
type SubscribeFn = (callbackFn: CallbackFn) => () => void
type PublishFn = (newSuggestion: Suggestion) => void
type ContextShape = [SubscribeFn, PublishFn]
type HookShape = [suggestion: Suggestion, setSuggestion: PublishFn]

const Context: React.Context<ContextShape> = createContext([
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_cb) => () => {
    return
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_newSuggestion: Suggestion) => {
    return
  },
])

export function SharedAutocompleteContext({
  children,
}: {
  children: ReactNode
}) {
  const context: ContextShape = useMemo(() => {
    let suggestion: Suggestion | null = null
    const listeners: Set<CallbackFn> = new Set()
    return [
      (cb: (newSuggestion: Suggestion) => void) => {
        cb(suggestion)
        listeners.add(cb)
        return () => {
          listeners.delete(cb)
        }
      },
      (newSuggestion: Suggestion) => {
        suggestion = newSuggestion
        for (const listener of Array.from(listeners)) {
          listener(newSuggestion)
        }
      },
    ]
  }, [])
  return <Context.Provider value={context}>{children}</Context.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSharedAutocompleteContext = (): HookShape => {
  const [subscribe, publish]: ContextShape = useContext(Context)
  const [suggestion, setSuggestion] = useState<Suggestion>(null)
  useEffect(() => {
    return subscribe((newSuggestion: Suggestion) => {
      setSuggestion(newSuggestion)
    })
  }, [subscribe])
  return [suggestion, publish]
}
