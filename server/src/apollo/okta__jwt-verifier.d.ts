// https://github.com/okta/okta-oidc-js/pull/976

declare module '@okta/jwt-verifier' {
  declare class OktaJwtVerifier {
    constructor(options: VerifierOptions)
    /**
     * Verify an access token
     *
     * The expected audience passed to verifyAccessToken() is required, and can be
     * either a string (direct match) or an array of strings (the actual aud claim
     * in the token must match one of the strings).
     *
     * @param {string} accessTokenString
     * @param {string | string[]} expectedAudience
     * @returns {Promise<Jwt>}
     * @memberof OktaJwtVerifier
     */
    verifyAccessToken(
      accessTokenString: string,
      expectedAudience: string | string[],
    ): Promise<Jwt>
    /**
     * Verify ID Tokens
     *
     * The expected client ID passed to verifyIdToken() is required. Expected nonce
     * value is optional and required if the claim is present in the token body.
     *
     * @param {string} idTokenString
     * @param {string} expectedClientId
     * @param {string} expectedNonce
     * @returns {Promise<Jwt>}
     * @memberof OktaJwtVerifier
     */
    verifyIdToken(
      idTokenString: string,
      expectedClientId: string,
      expectedNonce: string,
    ): Promise<Jwt>

    /**
     * @private
     */
    verifyAsPromise(tokenString: string): Promise<Jwt>
  }

  export interface VerifierOptions {
    /**
     * Issuer/Authorization server URL
     * @example
     * "https://{yourOktaDomain}/oauth2/default"
     */
    issuer: string
    /**
     * Client ID
     */
    clientId?: string
    /**
     * Custom claim assertions
     *
     * For basic use cases, you can ask the verifier to assert a custom set of
     * claims. For example, if you need to assert that this JWT was issued for a
     * given client id:
     *
     * ```js
     * const verifier = new OktaJwtVerifier({
     *  issuer: 'https://{yourOktaDomain}/oauth2/default',
     *  clientId: '{clientId}'
     *  assertClaims: {
     *    cid: '{clientId}'
     *  }
     * });
     * ```
     * Validation fails and an error is returned if the token does not have the configured claim.
     *
     * Read more: https://github.com/okta/okta-oidc-js/tree/master/packages/jwt-verifier#custom-claims-assertions
     */
    assertClaims?: Record<string, unknown>
    /**
     * By default, found keys are cached by key ID for one hour. This can be
     * configured with the cacheMaxAge option for cache entries.
     *
     * Read more: https://github.com/okta/okta-oidc-js/tree/master/packages/jwt-verifier#caching--rate-limiting
     */
    cacheMaxAge?: number
    /**
     * If a key ID is not found in the cache, the JWKs endpoint will be requested.
     * To prevent a DoS if many not-found keys are requested, a rate limit of 10
     * JWKs requests per minute is enforced. This is configurable with the
     * jwksRequestsPerMinute option.
     *
     * Read more: https://github.com/okta/okta-oidc-js/tree/master/packages/jwt-verifier#caching--rate-limiting
     */
    jwksRequestsPerMinute?: number
  }

  type Algorithm =
    | 'HS256'
    | 'HS384'
    | 'HS512'
    | 'RS256'
    | 'RS384'
    | 'RS512'
    | 'ES256'
    | 'ES384'
    | 'ES512'
    | 'PS256'
    | 'PS384'
    | 'PS512'
    | 'none'

  export interface JwtHeader {
    alg: Algorithm
    typ?: string
    kid?: string
    jku?: string
    x5u?: string
    x5t?: string
  }

  export interface JwtClaims {
    iss?: string
    sub: string
    aud?: string
    exp?: number
    nbf?: number
    iat?: number
    jti?: string
    nonce?: string
    scp?: string[]
    [key: string]: unknown
  }

  export interface Jwt {
    claims: JwtClaims
    header: JwtHeader
    toString(): string
  }

  export = OktaJwtVerifier
}
