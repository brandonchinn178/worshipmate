import { renderUI } from '~jest-utils'

import { Header } from './Header'

it('shows login link', () => {
  const { getByText } = renderUI(<Header isUserLoggedIn={false} />)

  expect(getByText('Login')).toBeVisible()
})

it('shows dashboard link if user is logged in', () => {
  const { getByText } = renderUI(<Header isUserLoggedIn={true} />)

  expect(getByText('Dashboard')).toBeVisible()
})
