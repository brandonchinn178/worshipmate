import { useCurrentUserQuery } from '~/api/currentUser.generated'

function Dashboard() {
  const { data } = useCurrentUserQuery()
  if (!data) {
    return null
  }

  const {
    me: { name },
  } = data

  return <p>Welcome: {name}!</p>
}

export default Dashboard
