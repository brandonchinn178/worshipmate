import { useRouter } from 'next/router'
import { ComponentType } from 'react'

import { useCurrentUserQuery } from '~/api/currentUser.generated'

export type User = {
  name: string
}

/**
 * A HOC that ensures a user is authenticated in order to render the given
 * component.
 *
 * Usage:
 *
 *   type MyComponentProps = WithAuth<{ myProp: ... }>
 *
 *   function MyComponent({ user, myProp }: MyComponentProps) {
 *     ...
 *   }
 */
export const withAuth = (Component: ComponentType<{ user: User }>) => (
  props: unknown,
) => {
  const router = useRouter()
  const { data, loading } = useCurrentUserQuery()

  if (loading) {
    return null
  }

  const user = data?.me

  if (!user) {
    router.push('/login')
    return null
  }

  return <Component user={user} {...props} />
}
