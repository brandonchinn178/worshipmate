import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './types'
export type GetSongQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']
}>

export type GetSongQuery = { __typename?: 'Query' } & {
  song?: Types.Maybe<
    { __typename?: 'Song' } & Pick<
      Types.Song,
      'id' | 'slug' | 'title' | 'recommendedKey' | 'timeSignature' | 'bpm'
    >
  >
}

export const GetSongDocument = gql`
  query getSong($slug: String!) {
    song(slug: $slug) {
      id
      slug
      title
      recommendedKey
      timeSignature
      bpm
    }
  }
`

/**
 * __useGetSongQuery__
 *
 * To run a query within a React component, call `useGetSongQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSongQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSongQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetSongQuery(
  baseOptions: Apollo.QueryHookOptions<GetSongQuery, GetSongQueryVariables>,
) {
  return Apollo.useQuery<GetSongQuery, GetSongQueryVariables>(
    GetSongDocument,
    baseOptions,
  )
}
export function useGetSongLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSongQuery,
    GetSongQueryVariables
  >,
) {
  return Apollo.useLazyQuery<GetSongQuery, GetSongQueryVariables>(
    GetSongDocument,
    baseOptions,
  )
}
export type GetSongQueryHookResult = ReturnType<typeof useGetSongQuery>
export type GetSongLazyQueryHookResult = ReturnType<typeof useGetSongLazyQuery>
export type GetSongQueryResult = Apollo.QueryResult<
  GetSongQuery,
  GetSongQueryVariables
>
