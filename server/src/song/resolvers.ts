import { GraphQLScalarType } from 'graphql'
import * as _ from 'lodash'
import * as yup from 'yup'

import {
  MutationParent,
  QueryParent,
  Resolver,
  Resolvers,
} from '~/graphql/resolvers'
import {
  MutationAddSongArgs,
  MutationUpdateSongArgs,
  QuerySearchSongsArgs,
  QuerySongArgs,
  Scalars,
} from '~/graphql/types'

import { Artist, Song, TimeSignature } from './models'

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
    const { slug } = args

    return songAPI.getSongBySlug(slug)
  },
}

/** Mutation **/

type MutationResolvers = Resolvers<
  MutationParent,
  {
    addSong: Resolver<MutationAddSongArgs, Song>
    updateSong: Resolver<MutationUpdateSongArgs, Song | null>
  }
>

const Mutation: MutationResolvers = {
  addSong(parent, args, { songAPI }) {
    const { data } = args
    return songAPI.createSong({
      ...data,
      slug: data.slug ?? undefined,
    })
  },
  async updateSong(parent, args, { songAPI }) {
    const { id, data } = args
    await songAPI.updateSong(id, _.pickBy(data))
    return songAPI.getSong(id)
  },
}

/** Song **/

type SongResolvers = Resolvers<
  Song,
  {
    artist: Resolver<Artist>
  }
>

const Song: SongResolvers = {
  artist(parent, args, { songAPI }) {
    return songAPI.getArtistForSong(parent)
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

export const resolvers = { Query, Mutation, Song, TimeSignature }
