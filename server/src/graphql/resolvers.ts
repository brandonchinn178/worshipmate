import { GraphQLResolveInfo } from 'graphql'

import { ApolloContext } from '~/apollo/context'

/**
 * Usage:
 *
 * type PersonParent = { id: number; name: string }
 * type PersonResolvers = Resolvers<PersonParent, {
 *   jobs: Resolver<PersonJobsArgs, Job[]>
 *   address: Resolver<string>
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

/**
 * A resolver for a field in the Resolvers definition.
 *
 * Can either specify just the result (for a field without args) or both
 * the args and result.
 */
export type Resolver<ArgOrResult, Result = undefined> = Result extends undefined
  ? { arg: unknown; result: ArgOrResult }
  : { arg: ArgOrResult; result: Result }

type ResolverResult<T> = Promise<T> | T

/* Query */

export type QueryParent = Record<string, never>
