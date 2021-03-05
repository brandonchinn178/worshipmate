import { Request } from 'express'
import { Database } from 'pg-fusion'

import { SongAPI } from '~/song/api'
import { User } from '~/user/models'

import { getUserFromRequest } from './auth'

export type ApolloContext = {
  user: User | null
  songAPI: SongAPI
}

export const getContext = async (
  req: Request,
  db: Database,
): Promise<ApolloContext> => {
  const user = await getUserFromRequest(req, db)

  return {
    user,
    songAPI: new SongAPI(db),
  }
}
