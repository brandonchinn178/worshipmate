import { screen, waitFor } from '@testing-library/react'

import { CurrentUserDocument } from '~/api/userApi.generated'
import { mkRouter } from '~/router/testutils'
import { renderUI } from '~jest-utils'

import { withAuth } from './hoc'

const mockUseRouter = jest.fn()

jest.mock('next/router', () => {
  return {
    useRouter: () => mockUseRouter(),
  }
})

const TestComponent = withAuth(({ user }) => <p>{user.name}</p>)

const mockCurrentUser = (name?: string | null) => {
  const user = name ? { id: '1', name } : null

  return {
    request: {
      query: CurrentUserDocument,
    },
    result: {
      data: {
        me: user,
      },
    },
  }
}

describe('withAuth', () => {
  it('returns null when query is loading', async () => {
    const { container } = renderUI(<TestComponent />, {
      mocks: [mockCurrentUser()],
    })

    expect(container.children).toHaveLength(0)
  })

  it('redirects to login when user is unauthenticated', async () => {
    const mockRouter = mkRouter()
    mockUseRouter.mockReturnValue(mockRouter)

    renderUI(<TestComponent />, { mocks: [mockCurrentUser(null)] })

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/login',
        query: {
          next: '/',
        },
      })
    })
  })

  it('redirects to login with the redirect set to the current path', async () => {
    const mockRouter = mkRouter({ pathname: '/asdf' })
    mockUseRouter.mockReturnValue(mockRouter)

    renderUI(<TestComponent />, { mocks: [mockCurrentUser(null)] })

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/login',
        query: {
          next: '/asdf',
        },
      })
    })
  })

  it('passes user to component when user is authenticated', async () => {
    renderUI(<TestComponent />, { mocks: [mockCurrentUser('user1')] })

    expect(await screen.findByText('user1')).toBeVisible()
  })
})
