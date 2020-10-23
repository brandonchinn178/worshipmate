import * as _ from 'lodash'

import { QueryResolvers } from '~/types'

import { validateSearchFilter } from './searchFilter'

const Query: QueryResolvers = {
  searchSongs(parent, { query, filters }, { dataSources: { songAPI } }) {
    return songAPI.searchSongs({
      query,
      filters: _.map(filters, validateSearchFilter),
    })
  },
}

export const resolvers = { Query }
