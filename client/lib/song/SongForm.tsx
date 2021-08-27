import * as _ from 'lodash'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'

import { useGetThemesQuery } from '~/api/songApi.generated'
import { color } from '~/theme'
import { ErrorMessage } from '~/ui-kit/ErrorMessage'
import { Select } from '~/ui-kit/Select'

import { TimeSignature } from './models'

export type SongFormValues = {
  slug: string
  title: string
  artist: string
  recommendedKey: string
  timeSignature: TimeSignature
  bpm: number
  themes: string[]
}

type SongFormProps = {
  initialSong?: SongFormValues
  onSubmit: (payload: SongFormValues) => Promise<void>
}

export function SongForm({ initialSong, onSubmit }: SongFormProps) {
  const { data } = useGetThemesQuery()
  const themes = _.map(data?.themes, ({ name }) => ({
    label: name,
    value: name,
  }))

  const {
    formState: { isSubmitting, isSubmitSuccessful, errors },
    control,
    handleSubmit,
    register,
  } = useForm<SongFormValues>({
    defaultValues: {
      slug: initialSong?.slug,
      title: initialSong?.title,
      artist: initialSong?.artist,
      recommendedKey: initialSong?.recommendedKey,
      timeSignature: initialSong?.timeSignature ?? [4, 4],
      bpm: initialSong?.bpm,
      themes: initialSong?.themes ?? [],
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
        <label htmlFor="artist">Artist</label>
        <input id="artist" {...register('artist', { required: true })} />
        <ErrorMessage name="artist" errors={errors} />
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
        <Select
          name="timeSignature"
          control={control}
          options={timeSignatureOptions}
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

      <FormField layout="vertical">
        <label htmlFor="themes">Themes</label>
        <Select
          name="themes"
          control={control}
          options={themes}
          isMulti
          components={{
            DropdownIndicator: null,
          }}
          styles={{
            valueContainer: (provided: Record<string, unknown>) => ({
              ...provided,
              cursor: 'text',
            }),
            multiValueLabel: (provided: Record<string, unknown>) => ({
              ...provided,
              cursor: 'default',
            }),
            multiValueRemove: (provided: Record<string, unknown>) => ({
              ...provided,
              cursor: 'pointer',
            }),
          }}
          placeholder={null}
        />
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

const FormField = styled.div<{ layout?: 'horizontal' | 'vertical' }>`
  ${({ layout = 'horizontal' }) => {
    switch (layout) {
      case 'horizontal':
        return `
          display: grid;
          grid-template-columns: 200px 1fr;
          grid-template-areas:
            'label input'
            'error error';
          align-items: center;
        `
      case 'vertical':
        return `
          label {
            display: block;
            margin-bottom: 0.5rem;
          }
        `
    }
  }}

  margin-bottom: 1rem;

  ${ErrorMessage.Style} {
    grid-area: error;
    line-height: 1.5rem;
    margin-bottom: -0.5rem;
  }
`
