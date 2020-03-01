import { fireEvent, wait } from '@testing-library/react'

import { renderUI } from '~jest-utils'

import SearchBar from './SearchBar'

it('allows typing and submission', async () => {
  const onSubmit = jest.fn()
  const { getByRole } = renderUI(<SearchBar onSubmit={onSubmit} />)

  const input = getByRole('textbox')
  fireEvent.change(input, { target: { value: 'hello!' } })

  const button = getByRole('button')
  fireEvent.click(button)

  await wait(() => {
    expect(onSubmit).toHaveBeenCalled()
  })
  expect(onSubmit.mock.calls[0][0]).toBe('hello!')
})

it('allows submission via Enter', async () => {
  const onSubmit = jest.fn()
  const { getByRole } = renderUI(<SearchBar onSubmit={onSubmit} />)

  const input = getByRole('textbox')
  fireEvent.change(input, { target: { value: 'hello!' } })
  fireEvent.submit(input)

  await wait(() => {
    expect(onSubmit).toHaveBeenCalled()
  })
})

it('sets initial input', async () => {
  const onSubmit = jest.fn()
  const { getByRole } = renderUI(
    <SearchBar initial="initial" onSubmit={onSubmit} />,
  )

  const button = getByRole('button')
  fireEvent.click(button)

  await wait(() => {
    expect(onSubmit).toHaveBeenCalled()
  })
  expect(onSubmit.mock.calls[0][0]).toBe('initial')
})
