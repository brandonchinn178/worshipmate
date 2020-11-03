import { GraphQLResolveInfo } from 'graphql'

import { ApolloContext } from '~/apollo/context'

/**
 * Usage:
 *
 * type PersonParent = { id: number; name: string }
 * type PersonResolvers = Resolvers<PersonParent, {
 *   address: Resolver<PersonAddressArgs, string>
 * }
 */
export type Resolvers<
  Parent,
  FieldResolvers extends Record<string, Resolver<unknown, unknown>>
> = {
  [Field in keyof FieldResolvers]: (
    parent: Parent,
    args: FieldResolvers[Field]['arg'],
    context: ApolloContext,
    info: GraphQLResolveInfo,
  ) => ResolverResult<FieldResolvers[Field]['result']>
}

export type Resolver<Arg, Result> = {
  arg: Arg
  result: Result
}

type ResolverResult<T> = Promise<T> | T

/* Query */

export type QueryParent = Record<string, never>
