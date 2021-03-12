import { screen } from '@testing-library/react'

import { renderUI } from '~jest-utils'

import { Header } from './Header'

it('shows login link', () => {
  renderUI(<Header isUserLoggedIn={false} />)

  expect(screen.getByText('Login')).toBeVisible()
})

it('shows dashboard link if user is logged in', () => {
  renderUI(<Header isUserLoggedIn={true} />)

  expect(screen.getByText('Dashboard')).toBeVisible()
})
