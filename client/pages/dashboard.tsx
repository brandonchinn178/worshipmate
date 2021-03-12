import { User, withAuth } from '~/auth/hoc'

type DashboardProps = {
  user: User
}

function Dashboard({ user }: DashboardProps) {
  return <p>Welcome: {user.name}!</p>
}

export default withAuth(Dashboard)
