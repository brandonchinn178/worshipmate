import { useRouter } from 'next/router'
import { ComponentType, useEffect } from 'react'

import { useCurrentUserQuery } from '~/api/userApi.generated'

export type User = {
  name: string
}

export type WithAuthProps = {
  user: User
}

export type WithAuth<T> = WithAuthProps & T

/**
 * A HOC that ensures a user is authenticated in order to render the given
 * component.
 *
 * Usage:
 *
 *   type MyComponentProps = {
 *     myProp: ...
 *   }
 *
 *   function MyComponent({ user, myProp }: WithAuth<MyComponentProps>) {
 *     ...
 *   }
 *
 *   export default withAuth(MyComponent)
 */
export const withAuth = <T,>(Component: ComponentType<WithAuth<T>>) => (
  props: T,
) => {
  const router = useRouter()
  const { data, loading } = useCurrentUserQuery()

  useEffect(() => {
    const user = data?.me
    if (!loading && !user) {
      router.push({
        pathname: '/login',
        query: {
          next: router.pathname,
        },
      })
    }
  }, [data, loading, router])

  if (loading) {
    return null
  }

  const user = data?.me

  if (!user) {
    return null
  }

  return <Component user={user} {...props} />
}
