// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./okta__jwt-verifier.d.ts" />

import OktaJwtVerifier = require('@okta/jwt-verifier')
import { AuthenticationError } from 'apollo-server'
import { Request } from 'express'

import { env } from '~/env'
import { User } from '~/user/models'

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: `https://${env.OKTA_DOMAIN}/oauth2/default`,
  clientId: env.OKTA_CLIENT_ID,
  assertClaims: {
    cid: env.OKTA_CLIENT_ID,
  },
})

const getTokenFromRequest = (req: Request): string | null => {
  const token = req.headers.authorization?.match(/^Bearer (.*)/)?.[1]

  if (!token) {
    return null
  }

  return token
}

const verifyToken = async (token: string) => {
  try {
    const jwt = await oktaJwtVerifier.verifyAccessToken(token, 'api://default')
    return jwt
  } catch (e) {
    if (e.message === 'Jwt is expired') {
      throw new AuthenticationError('Token is expired')
    }
    throw e
  }
}

export const getUserFromRequest = async (
  req: Request,
): Promise<User | null> => {
  const token = getTokenFromRequest(req)
  if (!token) {
    return null
  }

  const jwt = await verifyToken(token)

  const username = jwt.claims.sub

  // TODO: get/create from database
  return { name: username }
}
