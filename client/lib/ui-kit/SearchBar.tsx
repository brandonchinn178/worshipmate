import { useState } from 'react'
import styled from 'styled-components'

import Icon from '~/ui-kit/Icon'

type SearchBarProps = {
  initial?: string
  onSubmit: (query: string) => void
}

export default function SearchBar({ initial = '', onSubmit }: SearchBarProps) {
  const [query, setQuery] = useState(initial)

  const doSearch = () => onSubmit(query)

  return (
    <SearchContainer>
      <SearchInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            doSearch()
          }
        }}
      />
      <SearchBox onClick={doSearch}>
        <Icon name="search" />
      </SearchBox>
    </SearchContainer>
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

const SearchBox = styled.div`
  display: grid;
  align-items: center;
  justify-items: center;

  height: 33px;
  width: 33px;
  border: 1px solid black;
  cursor: pointer;
`
