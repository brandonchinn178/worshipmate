import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderUI, waitForAllStateChanges } from '~jest-utils'

import { LoginForm } from './LoginForm'

/** Mock react-toastify **/

const mockToastError = jest.fn()
jest.mock('react-toastify', () => {
  return {
    toast: {
      error: (...args: unknown[]) => mockToastError(...args),
    },
  }
})

/** Mock console.error **/

afterEach(jest.restoreAllMocks)

const mockConsoleError = () =>
  jest.spyOn(console, 'error').mockImplementation(() => {})

/** Tests **/

it('renders the login form', () => {
  const { container } = renderUI(<LoginForm onSubmit={jest.fn()} />)

  expect(container).toMatchSnapshot()
  expect(screen.getByLabelText('Username')).toBeVisible()
  expect(screen.getByLabelText('Password')).toBeVisible()
  expect(screen.getByText('Login', { selector: 'button' })).toBeVisible()
})

it('shows errors when onSubmit fails', async () => {
  const e = new Error('onSubmit failed')
  const onSubmit = jest.fn().mockRejectedValue(e)
  const consoleError = mockConsoleError()

  renderUI(<LoginForm onSubmit={onSubmit} />)

  userEvent.type(screen.getByLabelText('Username'), 'user')
  userEvent.type(screen.getByLabelText('Password'), 'pw')
  userEvent.click(screen.getByText('Login'))

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled()
  })

  expect(consoleError).toHaveBeenCalledWith(e)
  expect(mockToastError).toHaveBeenCalledWith(
    expect.stringContaining('onSubmit failed'),
  )
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

describe('submit button', () => {
  it('is enabled at start', async () => {
    renderUI(<LoginForm onSubmit={jest.fn()} />)

    expect(screen.getByRole('button')).not.toHaveAttribute('disabled')
  })

  it('is disabled during and after submitting', async () => {
    const onSubmit = jest.fn()
    renderUI(<LoginForm onSubmit={onSubmit} />)

    userEvent.type(screen.getByLabelText('Username'), 'user')
    userEvent.type(screen.getByLabelText('Password'), 'pw')
    userEvent.click(screen.getByText('Login'))

    expect(screen.getByRole('button')).toHaveAttribute('disabled')

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })

    expect(screen.getByRole('button')).toHaveAttribute('disabled')
  })

  it('is enabled after form validation fails', async () => {
    const onSubmit = jest.fn()
    renderUI(<LoginForm onSubmit={onSubmit} />)

    userEvent.click(screen.getByText('Login'))

    await waitForAllStateChanges()
    expect(onSubmit).not.toHaveBeenCalled()

    expect(screen.getByRole('button')).not.toHaveAttribute('disabled')
  })

  it('is enabled after submission fails', async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error())
    mockConsoleError()

    renderUI(<LoginForm onSubmit={onSubmit} />)

    userEvent.type(screen.getByLabelText('Username'), 'user')
    userEvent.type(screen.getByLabelText('Password'), 'pw')
    userEvent.click(screen.getByText('Login'))

    expect(screen.getByRole('button')).toHaveAttribute('disabled')

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })

    expect(screen.getByRole('button')).not.toHaveAttribute('disabled')
  })
})
