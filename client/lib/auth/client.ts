import { OktaAuth } from '@okta/okta-auth-js'

abstract class AuthClientBase {
  abstract getToken(): Promise<string | null>
  abstract login(username: string, password: string): Promise<void>
}

class AuthClientOkta extends AuthClientBase {
  private oktaAuth: OktaAuth

  constructor() {
    super()

    const oktaDomain = process.env.NEXT_PUBLIC_OKTA_DOMAIN
    const oktaClientId = process.env.NEXT_PUBLIC_OKTA_CLIENT_ID
    const origin = window.location.origin

    this.oktaAuth = new OktaAuth({
      issuer: `https://${oktaDomain}/oauth2/default`,
      clientId: oktaClientId,
      redirectUri: `${origin}/login/callback`,
    })
  }

  async getToken() {
    const tokens = await this.oktaAuth.tokenManager.getTokens()
    return tokens.accessToken?.value ?? null
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
}

class AuthClientSSR extends AuthClientBase {
  async getToken() {
    return null
  }

  async login() {
    return
  }
}

const getAuthClient = (): AuthClientBase => {
  // server-side rendering
  if (typeof window === 'undefined') {
    return new AuthClientSSR()
  }

  return new AuthClientOkta()
}

const authClient = getAuthClient()
export const getToken = authClient.getToken.bind(authClient)
export const login = authClient.login.bind(authClient)
