import * as _ from 'lodash'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { useSearchSongs } from '~/api'
import { setQueryString } from '~/router'
import { addFilter, loadFilters, removeFilter } from '~/router/filters'
import { SongFilter } from '~/song/SongFilter'
import { SongTable } from '~/song/SongTable'
import { SearchBar } from '~/ui-kit/SearchBar'

function pluralize(...args: [string, number] | [string, string, number]) {
  const [singular, plural, count] =
    args.length === 2 ? [args[0], args[0] + 's', args[1]] : args

  switch (count) {
    case 0:
      return plural
    case 1:
      return singular
    default:
      return plural
  }
}

export default function Home() {
  const router = useRouter()

  const { query } = router
  const search = router.query.search as string | undefined
  const activeFilters = loadFilters(query)

  const { data } = useSearchSongs({
    variables: {
      search,
      filters: _.toPairs(activeFilters).map(([key, value]) => ({ key, value })),
    },
  })

  const songs = data?.searchSongs ?? []
  const songFilters = data?.filters ?? []

  return (
    <Grid>
      <Sidebar>
        <SongFilter
          filters={songFilters}
          activeFilters={activeFilters}
          addFilter={(key, value) => addFilter(router, key, value)}
          removeFilter={(key) => removeFilter(router, key)}
        />
      </Sidebar>
      <SongSearch>
        <SearchBar
          initial={search}
          onSubmit={(query: string) => {
            setQueryString(router, 'search', query)
          }}
        />
      </SongSearch>
      <SongCount>
        {songs.length} {pluralize('song', songs.length)}
      </SongCount>
      <SongTableCell>
        <SongTable songs={songs} />
      </SongTableCell>
    </Grid>
  )
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 400px auto;
  grid-template-rows: max-content max-content auto;
  grid-template-areas:
    'sidebar search'
    'sidebar song-count'
    'sidebar table';
  grid-column-gap: 25px;
  grid-row-gap: 10px;
`

const Sidebar = styled.div`
  grid-area: sidebar;
`

const SongSearch = styled.div`
  grid-area: search;
`

const SongCount = styled.p`
  font-weight: bold;
`

const SongTableCell = styled.div`
  grid-area: table;
`
