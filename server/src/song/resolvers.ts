import * as _ from 'lodash'

import { QueryParent, Resolver, Resolvers } from '~/graphql/resolvers'
import { QuerySearchSongsArgs, Song } from '~/graphql/types'

import { validateSearchFilter } from './searchFilter'

type QueryResolvers = Resolvers<
  QueryParent,
  {
    searchSongs: Resolver<QuerySearchSongsArgs, Song[]>
  }
>

const Query: QueryResolvers = {
  searchSongs(parent, args, { dataSources: { songAPI } }) {
    const { query, filters } = args

    return songAPI.searchSongs({
      query: query ?? undefined,
      filters: _.map(filters, validateSearchFilter),
    })
  },
}

export const resolvers = { Query }
