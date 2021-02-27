import { LoginForm, LoginFormValues } from '~/auth/LoginForm'

export default function Login() {
  const onSubmit = async ({ username, password }: LoginFormValues) => {
    console.log('TODO: login', { username, password })
  }

  return <LoginForm onSubmit={onSubmit} />
}
