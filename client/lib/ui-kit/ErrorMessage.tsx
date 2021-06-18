import * as _ from 'lodash'
import { FieldErrors, FieldPath } from 'react-hook-form'
import * as reactHookForm from 'react-hook-form'
import styled from 'styled-components'

import { color } from '~/theme'

type ErrorMessageProps<FormValues> = {
  name: FieldPath<FormValues>
  errors: FieldErrors<FormValues>
}

export function ErrorMessage<FormValues>({
  name,
  errors,
}: ErrorMessageProps<FormValues>) {
  const error = reactHookForm.get(errors, name)

  if (!error) {
    return null
  }

  if (error.type === 'required') {
    const label = _.capitalize(_.lowerCase(name))
    return <StyledMessage>{label} is required</StyledMessage>
  }

  return <StyledMessage>{error.message}</StyledMessage>
}

const StyledMessage = styled.p`
  color: ${color('error')};
`

ErrorMessage.Style = StyledMessage
