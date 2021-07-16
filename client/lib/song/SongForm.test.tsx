import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderUI, waitForAllStateChanges } from '~jest-utils'

import { TimeSignature } from './models'
import { SongForm } from './SongForm'

describe('initial render', () => {
  it('renders an empty form', () => {
    const { container } = renderUI(<SongForm onSubmit={jest.fn()} />)

    expect(container).toMatchSnapshot()

    const inputTitle = screen.getByLabelText('Title')
    expect(inputTitle).toBeVisible()
    expect(inputTitle).toHaveValue('')

    const inputArtist = screen.getByLabelText('Artist')
    expect(inputArtist).toBeVisible()
    expect(inputArtist).toHaveValue('')

    const inputRecommendedKey = screen.getByLabelText('Recommended Key')
    expect(inputRecommendedKey).toBeVisible()
    expect(inputRecommendedKey).toHaveValue('')

    const selectTimeSignature = screen.getByLabelText('Time Signature')
    expect(selectTimeSignature).toBeVisible()
    expect(selectTimeSignature).toHaveValue('[4,4]')

    const inputBpm = screen.getByLabelText('BPM')
    expect(inputBpm).toBeVisible()
    expect(inputBpm).toHaveValue(null)
  })

  it('renders an initially populated form', () => {
    const song = {
      slug: 'blessed-be-your-name',
      title: 'Blessed Be Your Name',
      artist: 'Matt Redman',
      recommendedKey: 'A',
      timeSignature: [3, 4] as TimeSignature,
      bpm: 120,
    }
    renderUI(<SongForm initialSong={song} onSubmit={jest.fn()} />)

    expect(screen.getByLabelText('Title')).toHaveValue(song.title)
    expect(screen.getByLabelText('Artist')).toHaveValue(song.artist)
    expect(screen.getByLabelText('Recommended Key')).toHaveValue(
      song.recommendedKey,
    )
    expect(screen.getByLabelText('Time Signature')).toHaveValue('[3,4]')
    expect(screen.getByLabelText('BPM')).toHaveValue(120)

    // verify that '3/4' isn't duplicated
    expect(screen.getAllByText('3/4')).toHaveLength(1)
  })

  it('renders populated form with non-standard time signature', () => {
    const song = {
      slug: 'take-five',
      title: 'Take Five',
      artist: 'Dave Brubeck',
      recommendedKey: 'Eb',
      timeSignature: [5, 4] as TimeSignature,
      bpm: 170,
    }
    renderUI(<SongForm initialSong={song} onSubmit={jest.fn()} />)

    const selectTimeSignature = screen.getByLabelText('Time Signature')
    expect(selectTimeSignature).toHaveValue('[5,4]')
  })
})

describe('form validation', () => {
  it('triggers onSubmit when passes', async () => {
    const onSubmit = jest.fn()
    renderUI(<SongForm onSubmit={onSubmit} />)

    populateForm()

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })
  })

  it('does not trigger onSubmit with empty fields', async () => {
    const onSubmit = jest.fn()
    renderUI(<SongForm onSubmit={onSubmit} />)

    userEvent.click(screen.getByRole('button'))

    const errorMessage = await screen.findByText('Title is required')
    expect(errorMessage).toBeVisible()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})

describe('submit button', () => {
  it('is enabled at start', async () => {
    renderUI(<SongForm onSubmit={jest.fn()} />)

    expect(screen.getByRole('button')).not.toHaveAttribute('disabled')
  })

  it('is disabled during and after submitting', async () => {
    const onSubmit = jest.fn()
    renderUI(<SongForm onSubmit={onSubmit} />)

    populateForm()

    expect(screen.getByRole('button')).toHaveAttribute('disabled')

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })

    expect(screen.getByRole('button')).toHaveAttribute('disabled')
  })

  it('is enabled after form validation fails', async () => {
    const onSubmit = jest.fn()
    renderUI(<SongForm onSubmit={onSubmit} />)

    userEvent.click(screen.getByRole('button'))

    await waitForAllStateChanges()
    expect(onSubmit).not.toHaveBeenCalled()

    expect(screen.getByRole('button')).not.toHaveAttribute('disabled')
  })

  it('is enabled after submission fails', async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error())

    renderUI(<SongForm onSubmit={onSubmit} />)

    populateForm()

    expect(screen.getByRole('button')).toHaveAttribute('disabled')

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })

    expect(screen.getByRole('button')).not.toHaveAttribute('disabled')
  })
})

const populateForm = () => {
  userEvent.type(screen.getByLabelText('Title'), 'Blessed Be Your Name')
  userEvent.type(screen.getByLabelText('Artist'), 'Matt Redman')
  userEvent.type(screen.getByLabelText('Recommended Key'), 'A')
  userEvent.selectOptions(screen.getByLabelText('Time Signature'), '[3,4]')
  userEvent.type(screen.getByLabelText('BPM'), '120')
  userEvent.click(screen.getByRole('button'))
}
