import { useState } from 'react'

type FilterFunc<T> = (query: string, elem: T) => boolean

type SearchState = {
  query: string
  setQuery: (query: string) => void
  doSearch: () => void
}

export function useSearch<T>(
  data: readonly T[],
  filterFunc: FilterFunc<T>,
): [readonly T[], SearchState] {
  const [query, setQuery] = useState('')
  const [searchResult, setSearchResult] = useState(data)
  const searchState = {
    query,
    setQuery,
    doSearch: () => {
      setSearchResult(data.filter((elem) => filterFunc(query, elem)))
    },
  }

  return [searchResult, searchState]
}

export function SearchInput({ query, setQuery, doSearch }: SearchState) {
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.keyCode === 13) {
          doSearch()
        }
      }}
    />
  )
}
