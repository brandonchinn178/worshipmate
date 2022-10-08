import { OktaAuth } from '@okta/okta-auth-js'

import {
  NODE_ENV,
  OKTA_CLIENT_ID,
  OKTA_DOMAIN,
  UNSAFE_IGNORE_AUTH,
} from '~/config'

abstract class AuthClientBase {
  abstract getToken(): Promise<string | null>
  abstract onUpdateToken(callback: (token: string | null) => void): void
  abstract login(username: string, password: string): Promise<void>
  abstract logout(): Promise<void>
}

class AuthClientOkta extends AuthClientBase {
  private oktaAuth: OktaAuth

  constructor() {
    super()

    this.oktaAuth = new OktaAuth({
      issuer: `https://${OKTA_DOMAIN}/oauth2/default`,
      clientId: OKTA_CLIENT_ID,
    })
  }

  async getToken() {
    const tokens = await this.oktaAuth.tokenManager.getTokens()
    return tokens.accessToken?.value ?? null
  }

  onUpdateToken(callback: (token: string | null) => void) {
    this.oktaAuth.authStateManager.subscribe(() => {
      this.getToken().then(callback)
    })
  }

  async login(username: string, password: string): Promise<void> {
    const result = await this.oktaAuth.signInWithCredentials({
      username,
      password,
    })

    if (result.status !== 'SUCCESS') {
      throw new Error(`Unsuccessful login: ${JSON.stringify(result)}`)
    }

    const { tokens } = await this.oktaAuth.token.getWithoutPrompt({
      sessionToken: result.sessionToken,
    })

    return new Promise((resolve) => {
      this.oktaAuth.authStateManager.subscribe(() => resolve())
      this.oktaAuth.tokenManager.setTokens(tokens)
    })
  }

  async logout() {
    await this.oktaAuth.signOut()
  }
}

class AuthClientSSR extends AuthClientBase {
  async getToken() {
    return null
  }

  onUpdateToken() {
    return
  }

  async login() {
    return
  }

  async logout() {
    return
  }
}

class AuthClientFake extends AuthClientBase {
  private token: string | null
  private callback: ((token: string | null) => void) | null

  USERNAME = 'testuser'
  PASSWORD = 'password'

  constructor() {
    super()
    this.token = null
    this.callback = null
  }

  async getToken() {
    if (document.cookie.includes('authenticated=TRUE')) {
      return 'validtoken'
    }

    return this.token
  }

  onUpdateToken(callback: (token: string | null) => void) {
    this.callback = callback
  }

  async login(username: string, password: string) {
    if (username !== this.USERNAME || password !== this.PASSWORD) {
      throw new Error('Invalid credentials')
    }

    this.setToken(username + password)
  }

  async logout() {
    this.setToken(null)
  }

  private setToken(token: string | null) {
    this.token = token
    if (this.callback) {
      this.callback(token)
    }
  }
}

const getAuthClient = (): AuthClientBase => {
  // server-side rendering
  if (typeof window === 'undefined') {
    return new AuthClientSSR()
  }

  if (NODE_ENV === 'test' || UNSAFE_IGNORE_AUTH) {
    return new AuthClientFake()
  }

  return new AuthClientOkta()
}

const authClient = getAuthClient()
export const getToken = authClient.getToken.bind(authClient)
export const onUpdateToken = authClient.onUpdateToken.bind(authClient)
export const login = authClient.login.bind(authClient)
export const logout = authClient.logout.bind(authClient)
