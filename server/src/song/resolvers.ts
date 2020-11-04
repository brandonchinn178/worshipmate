import * as _ from 'lodash'

import { QueryParent, Resolver, Resolvers } from '~/graphql/resolvers'
import { AvailableFilter, QuerySearchSongsArgs, Song } from '~/graphql/types'

import { SearchOptions } from './api'
import { validateSearchFilter } from './searchFilter'

type SongSearchResultParent = SearchOptions

type QueryResolvers = Resolvers<
  QueryParent,
  {
    searchSongs: Resolver<QuerySearchSongsArgs, SongSearchResultParent>
  }
>

const Query: QueryResolvers = {
  searchSongs(parent, args) {
    const { query, filters } = args

    const searchOptions = {
      query: query ?? undefined,
      filters: _.map(filters, validateSearchFilter),
    }
    return searchOptions
  },
}

type SongSearchResultResolvers = Resolvers<
  SongSearchResultParent,
  {
    songs: Resolver<Song[]>
    availableFilters: Resolver<AvailableFilter[]>
  }
>

const SongSearchResult: SongSearchResultResolvers = {
  async songs(parent, args, { dataSources: { songAPI } }) {
    const searchOptions = parent

    const songs = await songAPI.searchSongs(searchOptions)
    return songs
  },

  async availableFilters(parent, args, { dataSources: { songAPI } }) {
    const searchOptions = parent

    const availableFilters = await songAPI.getAvailableFilters(searchOptions)
    return _.map(availableFilters, (values, name) => {
      return { name, values } as AvailableFilter
    })
  },
}

export const resolvers = { Query, SongSearchResult }
