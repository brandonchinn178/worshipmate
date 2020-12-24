import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './types'
export type SearchSongsQueryVariables = Types.Exact<{
  query?: Types.Maybe<Types.Scalars['String']>
  filters?: Types.Maybe<Types.SearchFilters>
}>

export type SearchSongsQuery = { __typename?: 'Query' } & {
  searchSongs: Array<
    { __typename?: 'Song' } & Pick<
      Types.Song,
      'slug' | 'title' | 'recommendedKey' | 'timeSignature' | 'bpm'
    >
  >
}

export const SearchSongsDocument = gql`
  query searchSongs($query: String, $filters: SearchFilters) {
    searchSongs(query: $query, filters: $filters) {
      slug
      title
      recommendedKey
      timeSignature
      bpm
    }
  }
`

/**
 * __useSearchSongsQuery__
 *
 * To run a query within a React component, call `useSearchSongsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchSongsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchSongsQuery({
 *   variables: {
 *      query: // value for 'query'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useSearchSongsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    SearchSongsQuery,
    SearchSongsQueryVariables
  >,
) {
  return Apollo.useQuery<SearchSongsQuery, SearchSongsQueryVariables>(
    SearchSongsDocument,
    baseOptions,
  )
}
export function useSearchSongsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SearchSongsQuery,
    SearchSongsQueryVariables
  >,
) {
  return Apollo.useLazyQuery<SearchSongsQuery, SearchSongsQueryVariables>(
    SearchSongsDocument,
    baseOptions,
  )
}
export type SearchSongsQueryHookResult = ReturnType<typeof useSearchSongsQuery>
export type SearchSongsLazyQueryHookResult = ReturnType<
  typeof useSearchSongsLazyQuery
>
export type SearchSongsQueryResult = Apollo.QueryResult<
  SearchSongsQuery,
  SearchSongsQueryVariables
>
