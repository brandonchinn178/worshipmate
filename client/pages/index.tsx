import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { useSearchSongs } from '~/api'
import { setQueryString } from '~/router'
import SongFilter from '~/song/SongFilter'
import SongTable from '~/song/SongTable'
import SearchBar from '~/ui-kit/SearchBar'

type HomeProps = {
  search: string
  filters: Array<{
    key: string
    value: string
  }>
}

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

export default function Home({ search, filters }: HomeProps) {
  const router = useRouter()

  const { data } = useSearchSongs({
    variables: {
      search,
      filters,
    },
  })

  const numSongs = data?.songs?.length ?? 0

  return (
    <Grid>
      <Sidebar>
        <SongFilter />
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
        {numSongs} {pluralize('song', numSongs)}
      </SongCount>
      <SongTableCell>
        <SongTable songs={data?.songs ?? []} />
      </SongTableCell>
    </Grid>
  )
}

Home.getInitialProps = ({ query }: NextPageContext) => {
  const filters = Array.isArray(query.filters)
    ? query.filters[0]
    : query.filters

  return {
    search: query.search,
    filters: filters && JSON.parse(filters),
  }
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 400px auto;
  grid-template-rows: auto auto auto;
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
