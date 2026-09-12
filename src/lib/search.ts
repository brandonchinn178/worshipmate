const SEARCH_KEY = "q"

export type SearchFilters = {
  query: string | null
}

export const getSearchFilters = (url: URL): SearchFilters => {
  return {
    query: getParam(url, SEARCH_KEY),
  }
}

export const setSearchFilters = (url: URL, search: SearchFilters): URL => {
  const newUrl = new URL(url)
  setParam(newUrl, SEARCH_KEY, search.query)
  return newUrl
}

const getParam = (url: URL, key: string): string | null => {
  const v = url.searchParams.get(key)
  return v === "" ? null : v
}

const setParam = (url: URL, key: string, value: string | null): void => {
  console.log(url.searchParams)
  if (value) {
    url.searchParams.set(key, value)
  } else {
    url.searchParams.delete(key)
  }
}
