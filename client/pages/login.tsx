import { useRouter } from 'next/router'

import { login } from '~/auth/client'
import { LoginForm, LoginFormValues } from '~/auth/LoginForm'

export default function Login() {
  const router = useRouter()

  const onSubmit = async ({ username, password }: LoginFormValues) => {
    await login(username, password)
    router.push('/')
  }

  return <LoginForm onSubmit={onSubmit} />
}
