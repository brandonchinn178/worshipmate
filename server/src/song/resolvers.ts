import { QueryResolvers } from '~/types'

const Query: QueryResolvers = {
  songs(parent, { query }) {
    // TODO
    console.log(`Searching for songs with query: ${query}`)
    return []
  },
}

export const resolvers = { Query }
