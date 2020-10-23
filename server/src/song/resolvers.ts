import * as _ from 'lodash'

import { QueryResolvers } from '~/types'

import { validateSearchFilter } from './searchFilter'

const Query: QueryResolvers = {
  async searchSongs(parent, { query, filters }, { dataSources: { songAPI } }) {
    const songs = await songAPI.searchSongs({
      query,
      filters: _.map(filters, validateSearchFilter),
    })
    return { songs }
  },
}

export const resolvers = { Query }
