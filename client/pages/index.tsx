import * as _ from 'lodash'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import {
  SearchSongsDocument,
  SearchSongsQuery,
  useSearchSongsQuery,
} from '~/api/searchSongs.generated'
import { getApolloClient } from '~/apollo'
import { setQueryString } from '~/router'
import {
  getAvailableFilters,
  loadActiveFilters,
  mkFilterHandler,
} from '~/song/filters'
import { SongFilterPanel } from '~/song/SongFilterPanel'
import { SongTable } from '~/song/SongTable'
import { SearchBar } from '~/ui-kit/SearchBar'

const pluralize = (...args: [string, number] | [string, string, number]) => {
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

type HomeStaticProps = {
  /**
   * The full list of songs to show at the start.
   */
  initialSongs: SearchSongsQuery['searchSongs']
}

export default function Home({ initialSongs }: HomeStaticProps) {
  const router = useRouter()

  const search = router.query.search as string | undefined
  const activeFilters = loadActiveFilters(router)

  const { data } = useSearchSongsQuery({
    variables: {
      query: search,
      filters: activeFilters,
    },
  })

  const songs = _.map(data?.searchSongs ?? initialSongs, (song) => ({
    ...song,
    artist: 'TODO',
    themes: ['TODO1', 'TODO2'],
  }))

  const availableFilters = getAvailableFilters(songs)

  return (
    <Grid>
      <SidebarArea>
        <SongFilterPanel
          availableFilters={availableFilters}
          activeFilters={activeFilters}
          filterHandler={mkFilterHandler(router)}
        />
      </SidebarArea>
      <SongSearchArea>
        <SearchBar
          initial={search}
          onSubmit={(query: string) => {
            setQueryString(router, 'search', query)
          }}
        />
      </SongSearchArea>
      <SongCountArea>
        {songs.length} {pluralize('song', songs.length)}
      </SongCountArea>
      <SongTableArea>
        <SongTable songs={songs} />
      </SongTableArea>
    </Grid>
  )
}

export const getStaticProps = async () => {
  const apolloClient = getApolloClient()

  const { data } = await apolloClient.query({
    query: SearchSongsDocument,
  })

  return {
    props: {
      initialSongs: data.searchSongs,
    },
    revalidate: 30,
  }
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

const SidebarArea = styled.div`
  grid-area: sidebar;
`

const SongSearchArea = styled.div`
  grid-area: search;
`

const SongCountArea = styled.p`
  grid-area: song-count;
  font-weight: bold;
`

const SongTableArea = styled.div`
  grid-area: table;
`
