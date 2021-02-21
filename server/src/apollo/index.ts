import { loadTypedefsSync } from '@graphql-toolkit/core'
import { GraphQLFileLoader } from '@graphql-toolkit/graphql-file-loader'
import { mergeTypeDefs } from '@graphql-toolkit/schema-merging'
import { ApolloServer } from 'apollo-server'
import { Database } from 'pg-fusion'

import * as song from '~/song/resolvers'

import { initDataSources } from './context'

const getTypeDefs = () => {
  const typeDefs = loadTypedefsSync('**/*.graphql', {
    loaders: [new GraphQLFileLoader()],
  })

  return mergeTypeDefs(
    typeDefs.flatMap((r) => (r.document ? [r.document] : [])),
  )
}

export const initServer = (db: Database) => {
  return new ApolloServer({
    typeDefs: getTypeDefs(),
    resolvers: [song.resolvers],
    dataSources: () => initDataSources(db),
    introspection: true,
    playground: true,
  })
}
