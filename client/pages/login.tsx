import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

import { apolloCache } from '~/apollo'
import { login } from '~/auth/client'
import { LoginForm, LoginFormValues } from '~/auth/LoginForm'
import { useSession } from '~/auth/session'

function Login() {
  const { session } = useSession()
  const router = useRouter()

  // clear getting the current user, forcing the next
  // page to query the graphql server again for the
  // current user
  useEffect(() => {
    apolloCache.modify({
      id: 'ROOT_QUERY',
      fields: {
        me(refs, { DELETE }) {
          return DELETE
        },
      },
    })
  }, [])

  // automatically redirect if user is already logged in
  useEffect(() => {
    if (session) {
      const redirect = (router.query.next ?? '/') as string
      router.push(redirect)
    }
  }, [router, session])

  const onSubmit = async ({ username, password }: LoginFormValues) => {
    try {
      await login(username, password)
    } catch (e) {
      console.error(e)
      toast.error(e)
      throw e
    }
  }

  return <LoginForm onSubmit={onSubmit} />
}

export default Login
