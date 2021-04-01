import { SchemaDirectiveVisitor } from 'apollo-server'
import { defaultFieldResolver, GraphQLField } from 'graphql'

import { ApolloContext } from '~/apollo/context'

class NeedsAuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<unknown, ApolloContext>) {
    const resolveOriginal = field.resolve ?? defaultFieldResolver

    field.resolve = (parent, args, context, info) => {
      if (context.user === null) {
        throw new Error('Unauthenticated user cannot run this mutation')
      }

      return resolveOriginal(parent, args, context, info)
    }
  }
}

export const schemaDirectives = {
  needsAuth: NeedsAuthDirective,
}
