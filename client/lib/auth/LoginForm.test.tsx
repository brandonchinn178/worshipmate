import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderUI, waitForAllStateChanges } from '~jest-utils'

import { LoginForm } from './LoginForm'

it('renders the login form', () => {
  const { container } = renderUI(<LoginForm onSubmit={jest.fn()} />)

  expect(container).toMatchSnapshot()
  expect(screen.getByLabelText('Username')).toBeVisible()
  expect(screen.getByLabelText('Password')).toBeVisible()
  expect(screen.getByText('Login', { selector: 'button' })).toBeVisible()
})

describe('form validation', () => {
  it('triggers onSubmit when passes', async () => {
    const onSubmit = jest.fn()
    renderUI(<LoginForm onSubmit={onSubmit} />)

    userEvent.type(screen.getByLabelText('Username'), 'user')
    userEvent.type(screen.getByLabelText('Password'), 'pw')
    userEvent.click(screen.getByText('Login'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })
  })

  it('does not trigger onSubmit when username is missing', async () => {
    const onSubmit = jest.fn()
    renderUI(<LoginForm onSubmit={onSubmit} />)

    userEvent.type(screen.getByLabelText('Password'), 'pw')
    userEvent.click(screen.getByText('Login'))

    await waitForAllStateChanges()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not trigger onSubmit when password is missing', async () => {
    const onSubmit = jest.fn()
    renderUI(<LoginForm onSubmit={onSubmit} />)

    userEvent.type(screen.getByLabelText('Username'), 'user')
    userEvent.click(screen.getByText('Login'))

    await waitForAllStateChanges()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not trigger onSubmit when both username and password are missing', async () => {
    const onSubmit = jest.fn()

    renderUI(<LoginForm onSubmit={onSubmit} />)

    userEvent.click(screen.getByText('Login'))

    await waitForAllStateChanges()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
