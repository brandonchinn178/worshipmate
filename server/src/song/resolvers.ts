import * as _ from 'lodash'

import { QueryParent, Resolver, Resolvers } from '~/graphql/resolvers'
import { QuerySearchSongsArgs, SongSearchResult } from '~/graphql/types'

import { validateSearchFilter } from './searchFilter'

type QueryResolvers = Resolvers<
  QueryParent,
  {
    searchSongs: Resolver<QuerySearchSongsArgs, SongSearchResult>
  }
>

const Query: QueryResolvers = {
  async searchSongs(parent, { query, filters }, { dataSources: { songAPI } }) {
    const songs = await songAPI.searchSongs({
      query: query ?? undefined,
      filters: _.map(filters, validateSearchFilter),
    })
    return { songs }
  },
}

export const resolvers = { Query }
