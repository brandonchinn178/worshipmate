import * as _ from 'lodash'
import { GetStaticProps } from 'next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import {
  SearchSongsDocument,
  SearchSongsQuery,
  useSearchSongsQuery,
} from '~/api/songApi.generated'
import { useCurrentUserQuery } from '~/api/userApi.generated'
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

type HomePageProps = {
  /**
   * The full list of songs to show at the start.
   */
  initialSongs: SearchSongsQuery['searchSongs']
}

function HomePage({ initialSongs }: HomePageProps) {
  const router = useRouter()

  const search = router.query.search as string | undefined
  const activeFilters = loadActiveFilters(router)

  const { data } = useSearchSongsQuery({
    variables: {
      query: search,
      filters: activeFilters,
    },
  })

  const { data: currentUserData } = useCurrentUserQuery()
  const user = currentUserData?.me

  const songs = _.map(data?.searchSongs ?? initialSongs, (song) => ({
    ...song,
    artist: song.artist.name,
    themes: ['TODO1', 'TODO2'],
  }))

  const availableFilters = getAvailableFilters(songs)

  return (
    <HomePageContent>
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
      <SongTableMetaArea>
        <SongCount>
          {songs.length} {pluralize('song', songs.length)}
        </SongCount>
        {user && (
          <NextLink href="/add-song" passHref>
            <AddSongLink>Add Song</AddSongLink>
          </NextLink>
        )}
      </SongTableMetaArea>
      <SongTableArea>
        <SongTable songs={songs} isAdmin={!!user} />
      </SongTableArea>
    </HomePageContent>
  )
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
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

const HomePageContent = styled.div`
  display: grid;
  grid-template-columns: 400px auto;
  grid-template-rows: max-content max-content auto;
  grid-template-areas:
    'sidebar search'
    'sidebar table-meta'
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

const SongTableMetaArea = styled.div`
  grid-area: table-meta;
`

const SongCount = styled.span`
  font-weight: bold;
`

const AddSongLink = styled.a`
  float: right;
  &:before {
    content: '\\FF0B';
    font-size: 1rem;
  }
`

const SongTableArea = styled.div`
  grid-area: table;
`

export default HomePage
