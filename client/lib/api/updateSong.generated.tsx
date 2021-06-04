import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './types'
export type UpdateSongMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']
  data: Types.UpdateSongInput
}>

export type UpdateSongMutation = { __typename?: 'Mutation' } & {
  updateSong?: Types.Maybe<{ __typename?: 'Song' } & Pick<Types.Song, 'slug'>>
}

export const UpdateSongDocument = gql`
  mutation updateSong($id: ID!, $data: UpdateSongInput!) {
    updateSong(id: $id, data: $data) {
      slug
    }
  }
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
