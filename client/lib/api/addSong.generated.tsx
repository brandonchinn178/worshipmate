import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './types'
export type AddSongMutationVariables = Types.Exact<{
  data: Types.AddSongInput
}>

export type AddSongMutation = { __typename?: 'Mutation' } & {
  addSong: { __typename?: 'Song' } & Pick<Types.Song, 'slug'>
}

export const AddSongDocument = gql`
  mutation addSong($data: AddSongInput!) {
    addSong(data: $data) {
      slug
    }
  }
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
