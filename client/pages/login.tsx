import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { login } from '~/auth/client'
import { LoginForm, LoginFormValues } from '~/auth/LoginForm'
import { useSession } from '~/auth/session'

export default function Login() {
  const { session } = useSession()
  const router = useRouter()

  // automatically redirect if user is already logged in
  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [router, session])

  const onSubmit = async ({ username, password }: LoginFormValues) => {
    await login(username, password)
    router.push('/')
  }

  return <LoginForm onSubmit={onSubmit} />
}
