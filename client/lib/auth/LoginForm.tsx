import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import styled from 'styled-components'

import { font, fontFamily } from '~/theme'

export type LoginFormValues = {
  username: string
  password: string
}

export type LoginFormProps = {
  onSubmit: (payload: LoginFormValues) => Promise<void>
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const { formState, handleSubmit, register } = useForm<LoginFormValues>()

  const { isSubmitting, isSubmitSuccessful } = formState
  const postLoginLoading = isSubmitting || isSubmitSuccessful

  const onFormSubmit = handleSubmit(async (payload) => {
    try {
      await onSubmit(payload)
    } catch (e) {
      toast.error(e.toString())
      console.error(e)
      throw e
    }
  })

  return (
    <LoginFormContainer onSubmit={onFormSubmit}>
      <LoginLabel htmlFor="username">Username</LoginLabel>
      <LoginInput id="username" {...register('username', { required: true })} />
      <LoginLabel htmlFor="password">Password</LoginLabel>
      <LoginInput
        id="password"
        type="password"
        {...register('password', { required: true })}
      />
      <LoginButton disabled={postLoginLoading}>Login</LoginButton>
    </LoginFormContainer>
  )
}

const LoginFormContainer = styled.form`
  display: grid;
  grid-columns: 1fr;

  margin: 0 auto;
  max-width: 500px;

  padding: 25px 50px;
`

const LoginLabel = styled.label`
  margin-top: 5px;

  ${font('label')}
`

const LoginInput = styled.input`
  margin-bottom: 0.5rem;
  padding: 2px 5px;

  font-family: ${fontFamily('notoSerif')};
`

const LoginButton = styled.button`
  margin: 20px auto 0;
  padding: 5px 20px;
  width: min-content;
`
