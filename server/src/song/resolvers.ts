import { QueryResolvers } from '~/types'

const Query: QueryResolvers = {
  songs(parent, { query }, { dataSources: { songAPI } }) {
    return songAPI.searchSongs(query)
  },
}

export const resolvers = { Query }
