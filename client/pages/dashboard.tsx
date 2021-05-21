import { WithAuth, withAuth } from '~/auth/hoc'

type DashboardProps = Record<string, never>

function Dashboard({ user }: WithAuth<DashboardProps>) {
  return <p>Welcome: {user.name}!</p>
}

export default withAuth(Dashboard)
