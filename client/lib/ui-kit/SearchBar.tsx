import { useForm } from 'react-hook-form'
import styled from 'styled-components'

import Icon from '~/ui-kit/Icon'

type Form = {
  search: string
}

type SearchBarProps = {
  initial?: string
  onSubmit: (query: string) => void
}

export default function SearchBar({ initial = '', onSubmit }: SearchBarProps) {
  const { register, handleSubmit } = useForm<Form>({
    defaultValues: {
      search: initial,
    },
  })

  const doSubmit = handleSubmit(({ search }) => onSubmit(search))

  return (
    <form onSubmit={doSubmit}>
      <SearchContainer>
        <SearchInput name="search" ref={register} />
        <SearchBox>
          <Icon name="search" />
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

const SearchInput = styled.input`
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
  cursor: pointer;
`
