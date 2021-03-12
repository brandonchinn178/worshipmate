import { useCurrentUserQuery } from '~/api/currentUser.generated'

export default function Dashboard() {
  const { data } = useCurrentUserQuery()
  if (!data) {
    return null
  }

  const {
    me: { name },
  } = data

  return <p>Welcome: {name}!</p>
}
