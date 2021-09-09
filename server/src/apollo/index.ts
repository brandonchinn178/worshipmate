import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServer } from 'apollo-server'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import * as _ from 'lodash'
import { Database } from 'pg-fusion'

import { schemaDirectives } from '~/graphql/directives'
import * as song from '~/song/resolvers'
import * as user from '~/user/resolvers'

import { getContext } from './context'

const getSchema = () => {
  const schema = makeExecutableSchema({
    typeDefs: loadSchemaSync('**/*.graphql', {
      loaders: [new GraphQLFileLoader()],
    }),
    resolvers: [song.resolvers, user.resolvers],
  })

  return _.flow(schemaDirectives)(schema)
}

export const initServer = (db: Database) => {
  return new ApolloServer({
    schema: getSchema(),
    context: ({ req }) => getContext(req, db),
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  })
}
