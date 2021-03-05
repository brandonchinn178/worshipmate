import React, { ReactNode, useContext, useEffect, useState } from 'react'

import { getToken, onUpdateToken } from './client'

type Session = {
  token: string
}

/** Session result **/

type SessionHookLoading = {
  session: null
  loading: true
  error: null
}

const sessionLoading: SessionHookLoading = {
  session: null,
  loading: true,
  error: null,
}

type SessionHookError = {
  session: null
  loading: false
  error: Error
}

const mkSessionError = (error: Error): SessionHookError => ({
  session: null,
  loading: false,
  error,
})

type SessionHookLoaded = {
  session: Session | null
  loading: false
  error: null
}

const mkSession = (token: string | null): SessionHookLoaded => ({
  session: token ? { token } : null,
  loading: false,
  error: null,
})

type SessionHookResult =
  | SessionHookLoading
  | SessionHookError
  | SessionHookLoaded

/** Session providers + consumers **/

const SessionContext = React.createContext<SessionHookResult | undefined>(
  undefined,
)

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [result, setResult] = useState<SessionHookResult>(sessionLoading)

  useEffect(() => {
    getToken()
      .then((token) => {
        setResult(mkSession(token))
      })
      .catch((e) => {
        console.error(e)
        setResult(mkSessionError(e))
      })
  }, [])

  onUpdateToken((token) => {
    setResult(mkSession(token))
  })

  return (
    <SessionContext.Provider value={result}>{children}</SessionContext.Provider>
  )
}

export const useSession = (): SessionHookResult => {
  const result = useContext(SessionContext)
  if (!result) {
    throw new Error('Session not initialized -- did you use SessionProvider?')
  }

  return result
}
