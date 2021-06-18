import * as _ from 'lodash'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import styled from 'styled-components'

import { color } from '~/theme'
import { ErrorMessage } from '~/ui-kit/ErrorMessage'

import { TimeSignature } from './models'

export type SongFormValues = {
  slug: string
  title: string
  recommendedKey: string
  timeSignature: TimeSignature
  bpm: number
}

type SongFormProps = {
  initialSong?: SongFormValues
  onSubmit: (payload: SongFormValues) => Promise<void>
}

export function SongForm({ initialSong, onSubmit }: SongFormProps) {
  const {
    formState: { isSubmitting, isSubmitSuccessful, errors },
    control,
    handleSubmit,
    register,
  } = useForm<SongFormValues>({
    defaultValues: {
      slug: initialSong?.slug,
      title: initialSong?.title,
      recommendedKey: initialSong?.recommendedKey,
      timeSignature: initialSong?.timeSignature ?? [4, 4],
      bpm: initialSong?.bpm,
    },
  })

  const postSubmitLoading = isSubmitting || isSubmitSuccessful

  const timeSignatureOptions = getTimeSignatureOptions(
    initialSong?.timeSignature,
  )

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      {initialSong && (
        <FormField>
          <label htmlFor="slug">Slug</label>
          <input id="slug" {...register('slug', { required: true })} />
          <ErrorMessage name="slug" errors={errors} />
        </FormField>
      )}

      <FormField>
        <label htmlFor="title">Title</label>
        <input id="title" {...register('title', { required: true })} />
        <ErrorMessage name="title" errors={errors} />
      </FormField>

      <FormField>
        <label htmlFor="recommendedKey">Recommended Key</label>
        <input
          id="recommendedKey"
          {...register('recommendedKey', { required: true })}
        />
        <ErrorMessage name="recommendedKey" errors={errors} />
      </FormField>

      <FormField>
        <label htmlFor="timeSignature">Time Signature</label>
        <Controller
          name="timeSignature"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => {
            return (
              <Select
                instanceId="timeSignature"
                inputId="timeSignature"
                options={timeSignatureOptions}
                value={_.find(timeSignatureOptions, { value })}
                onChange={(option) => onChange(option?.value)}
                onBlur={onBlur}
                className="time-signature-container"
              />
            )
          }}
        />
      </FormField>

      <FormField>
        <label htmlFor="bpm">BPM</label>
        <input
          id="bpm"
          type="number"
          {...register('bpm', { required: true, valueAsNumber: true })}
        />
        <ErrorMessage name="bpm" errors={errors} />
      </FormField>

      <button disabled={postSubmitLoading}>Submit</button>
    </FormContainer>
  )
}

const getTimeSignatureOptions = (existingTimeSignature?: TimeSignature) => {
  const timeSignatures = _.compact([
    existingTimeSignature,
    [4, 4],
    [3, 4],
    [6, 8],
    [2, 4],
  ])

  const options = _.map(timeSignatures, (value) => {
    const [top, bottom] = value
    return {
      label: `${top}/${bottom}`,
      value,
    }
  })

  return _.uniqBy(options, 'label')
}

const FormContainer = styled.form`
  display: grid;
  width: 600px;
  margin: 50px auto 0;

  border: 4px ridge ${color('lightGray')};
  padding: 25px 75px;
`

const FormField = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-areas:
    'label input'
    'error error';
  align-items: center;

  margin-bottom: 1rem;

  ${ErrorMessage.Style} {
    grid-area: error;
    line-height: 1.5rem;
    margin-bottom: -0.5rem;
  }
`
