import { GraphQLScalarType } from 'graphql'
import * as _ from 'lodash'
import * as yup from 'yup'

import { QueryParent, Resolver, Resolvers } from '~/graphql/resolvers'
import {
  QuerySearchSongsArgs,
  QuerySongArgs,
  Scalars,
  Song,
} from '~/graphql/types'

import { TimeSignature } from './models'

/** Query **/

type QueryResolvers = Resolvers<
  QueryParent,
  {
    searchSongs: Resolver<QuerySearchSongsArgs, Song[]>
    song: Resolver<QuerySongArgs, Song | null>
  }
>

const Query: QueryResolvers = {
  searchSongs(parent, args, { songAPI }) {
    const { query, filters } = args

    return songAPI.searchSongs({
      query: query ?? undefined,
      filters: filters ? _.pickBy(filters) : undefined,
    })
  },
  song(parent, args, { songAPI }) {
    const { id } = args

    return songAPI.getSong(id)
  },
}

/** TimeSignature scalar **/

const parseTimeSignature = (value: unknown): [number, number] | null => {
  const schema = yup
    .array()
    .min(2)
    .max(2)
    .of(yup.number().positive().integer().required())
    .required()

  let result
  try {
    result = schema.validateSync(value)
  } catch (_) {
    result = null
  }

  if (!result) {
    throw new Error('Invalid time signature')
  }

  return result
}

const TimeSignature = new GraphQLScalarType({
  name: 'TimeSignature',
  description:
    "The `TimeSignature` scalar type represents a song's time signature, where `4/4` is represented as `[4, 4]`.",
  serialize(value: unknown): Scalars['TimeSignature'] | null {
    return parseTimeSignature(value)
  },
  parseValue(value: unknown): TimeSignature | null {
    return parseTimeSignature(value)
  },
})

/** Resolver Map **/

export const resolvers = { Query, TimeSignature }
