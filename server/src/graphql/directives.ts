import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { defaultFieldResolver, GraphQLSchema } from 'graphql'
import * as graphql from 'graphql'

import { ApolloContext } from '~/apollo/context'

type GraphQLFieldConfig = graphql.GraphQLFieldConfig<unknown, ApolloContext>

const needsAuthDirective = (directiveName: string) => (schema: GraphQLSchema) =>
  mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig: GraphQLFieldConfig) => {
      const directive = getDirective(schema, fieldConfig, directiveName)?.[0]
      if (directive) {
        const { resolve = defaultFieldResolver } = fieldConfig
        fieldConfig.resolve = (parent, args, context, info) => {
          if (context.user === null) {
            throw new Error('Unauthenticated user cannot run this mutation')
          }

          return resolve(parent, args, context, info)
        }
        return fieldConfig
      }
    },
  })

export const schemaDirectives = [needsAuthDirective('needsAuth')]
