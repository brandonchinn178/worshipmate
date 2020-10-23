import * as _ from 'lodash'

import { QueryResolvers } from '~/types'

import { validateSearchFilter } from './searchFilter'

const Query: QueryResolvers = {
  songs(parent, { query, filters }, { dataSources: { songAPI } }) {
    return songAPI.searchSongs({
      query,
      filters: _.map(filters, validateSearchFilter),
    })
  },
}

export const resolvers = { Query }
