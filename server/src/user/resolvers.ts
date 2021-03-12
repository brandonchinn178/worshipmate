import { QueryParent, Resolver, Resolvers } from '~/graphql/resolvers'
import { User } from '~/graphql/types'

/** Query **/

type QueryResolvers = Resolvers<
  QueryParent,
  {
    me: Resolver<User | null>
  }
>

const Query: QueryResolvers = {
  me(parent, args, { user }) {
    return user
  },
}

/** Resolver Map **/

export const resolvers = { Query }
