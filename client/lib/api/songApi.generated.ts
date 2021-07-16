import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './types'
export type SongFieldsFragment = { __typename?: 'Song' } & Pick<
  Types.Song,
  'id' | 'slug' | 'title' | 'recommendedKey' | 'timeSignature' | 'bpm'
> & { artist: { __typename?: 'Artist' } & Pick<Types.Artist, 'id' | 'name'> }

export type SearchSongsQueryVariables = Types.Exact<{
  query?: Types.Maybe<Types.Scalars['String']>
  filters?: Types.Maybe<Types.SearchFilters>
}>

export type SearchSongsQuery = { __typename?: 'Query' } & {
  searchSongs: Array<{ __typename?: 'Song' } & SongFieldsFragment>
}

export type GetSongQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']
}>

export type GetSongQuery = { __typename?: 'Query' } & {
  song?: Types.Maybe<{ __typename?: 'Song' } & SongFieldsFragment>
}

export type AddSongMutationVariables = Types.Exact<{
  data: Types.AddSongInput
}>

export type AddSongMutation = { __typename?: 'Mutation' } & {
  addSong: { __typename?: 'Song' } & SongFieldsFragment
}

export type UpdateSongMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']
  data: Types.UpdateSongInput
}>

export type UpdateSongMutation = { __typename?: 'Mutation' } & {
  updateSong?: Types.Maybe<{ __typename?: 'Song' } & SongFieldsFragment>
}

export const SongFieldsFragmentDoc = gql`
  fragment songFields on Song {
    id
    slug
    title
    artist {
      id
      name
    }
    recommendedKey
    timeSignature
    bpm
  }
`
export const SearchSongsDocument = gql`
  query searchSongs($query: String, $filters: SearchFilters) {
    searchSongs(query: $query, filters: $filters) {
      ...songFields
    }
  }
  ${SongFieldsFragmentDoc}
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
export const GetSongDocument = gql`
  query getSong($slug: String!) {
    song(slug: $slug) {
      ...songFields
    }
  }
  ${SongFieldsFragmentDoc}
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
export const AddSongDocument = gql`
  mutation addSong($data: AddSongInput!) {
    addSong(data: $data) {
      ...songFields
    }
  }
  ${SongFieldsFragmentDoc}
`
export type AddSongMutationFn = Apollo.MutationFunction<
  AddSongMutation,
  AddSongMutationVariables
>

/**
 * __useAddSongMutation__
 *
 * To run a mutation, you first call `useAddSongMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddSongMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addSongMutation, { data, loading, error }] = useAddSongMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAddSongMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddSongMutation,
    AddSongMutationVariables
  >,
) {
  return Apollo.useMutation<AddSongMutation, AddSongMutationVariables>(
    AddSongDocument,
    baseOptions,
  )
}
export type AddSongMutationHookResult = ReturnType<typeof useAddSongMutation>
export type AddSongMutationResult = Apollo.MutationResult<AddSongMutation>
export type AddSongMutationOptions = Apollo.BaseMutationOptions<
  AddSongMutation,
  AddSongMutationVariables
>
export const UpdateSongDocument = gql`
  mutation updateSong($id: ID!, $data: UpdateSongInput!) {
    updateSong(id: $id, data: $data) {
      ...songFields
    }
  }
  ${SongFieldsFragmentDoc}
`
export type UpdateSongMutationFn = Apollo.MutationFunction<
  UpdateSongMutation,
  UpdateSongMutationVariables
>

/**
 * __useUpdateSongMutation__
 *
 * To run a mutation, you first call `useUpdateSongMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSongMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSongMutation, { data, loading, error }] = useUpdateSongMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateSongMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateSongMutation,
    UpdateSongMutationVariables
  >,
) {
  return Apollo.useMutation<UpdateSongMutation, UpdateSongMutationVariables>(
    UpdateSongDocument,
    baseOptions,
  )
}
export type UpdateSongMutationHookResult = ReturnType<
  typeof useUpdateSongMutation
>
export type UpdateSongMutationResult = Apollo.MutationResult<UpdateSongMutation>
export type UpdateSongMutationOptions = Apollo.BaseMutationOptions<
  UpdateSongMutation,
  UpdateSongMutationVariables
>
