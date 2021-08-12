import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'

import { color } from '~/theme'
import { Icon } from '~/ui-kit/Icon'

type Form = {
  search: string
}

type SearchBarProps = {
  initial?: string
  onSubmit: (query: string) => void
}

export function SearchBar({ initial = '', onSubmit }: SearchBarProps) {
  const { register, handleSubmit, setValue } = useForm<Form>()

  useEffect(() => {
    setValue('search', initial)
  }, [setValue, initial])

  const doSubmit = handleSubmit(({ search }) => onSubmit(search))

  return (
    <form onSubmit={doSubmit}>
      <SearchContainer>
        <SearchInput {...register('search')} />
        <SearchBox>
          <Icon name="search" width={16} />
        </SearchBox>
      </SearchContainer>
    </form>
  )
}

const SearchContainer = styled.div`
  display: grid;
  grid-template-columns: auto min-content;
  grid-template-areas: 'search-input search-button';
  grid-gap: 10px;
  align-items: center;
`

const SearchInput = styled.input.attrs({ type: 'text' })`
  grid-area: search-input;
  width: 100%;
  border: 1px solid black;
  padding: 5px;
  outline: 0;
`

const SearchBox = styled.button`
  // HACK cuz grid not working in button
  // display: grid;
  // align-items: center;
  // justify-items: center;
  padding-top: 4px;

  height: 33px;
  width: 33px;
  border: 1px solid black;

  background: ${color('white')};

  // reset default button font color styling
  color: inherit;
  &:hover {
    color: inherit;
  }
`
