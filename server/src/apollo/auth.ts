// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./okta__jwt-verifier.d.ts" />

import OktaJwtVerifier = require('@okta/jwt-verifier')
import { AuthenticationError } from 'apollo-server'
import { Request } from 'express'
import { Database } from 'pg-fusion'

import { env } from '~/env'
import { UserAPI } from '~/user/api'
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
  if (env.NODE_ENV === 'test' || env.UNSAFE_IGNORE_AUTH) {
    return {
      claims: {
        sub: 'testuser',
      },
    }
  }

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
  db: Database,
): Promise<User | null> => {
  const token = getTokenFromRequest(req)
  if (!token) {
    return null
  }

  const jwt = await verifyToken(token)

  const username = jwt.claims.sub

  const userAPI = new UserAPI(db)
  const user = await userAPI.getOrCreate(username)

  return user
}
