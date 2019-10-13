import { ChangeEvent, useState } from 'react'

type FilterFunc<T> = (query: string, elem: T) => boolean

type SearchState = {
  query: string
  setQuery: (query: string) => void
  doSearch: () => void
}

// properties that should be attached to the search bar.
type SearchInputProps = object

export function useSearch<T>(
  data: readonly T[],
  filterFunc: FilterFunc<T>,
): [readonly T[], SearchInputProps, SearchState] {
  const [query, setQuery] = useState('')
  const [searchResult, setSearchResult] = useState(data)
  const doSearch = () => {
    setSearchResult(data.filter((elem) => filterFunc(query, elem)))
  }

  const searchState = {
    query,
    setQuery,
    doSearch,
  }

  const searchInputProps = {
    value: query,
    onChange: (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        doSearch()
      }
    },
  }

  return [searchResult, searchInputProps, searchState]
}
