import { Request } from 'express'
import { Database } from 'pg-fusion'

import { SongAPI } from '~/song/api'

export type ApolloContext = {
  songAPI: SongAPI
}

export const getContext = async (
  req: Request,
  db: Database,
): Promise<ApolloContext> => {
  return {
    songAPI: new SongAPI(db),
  }
}
