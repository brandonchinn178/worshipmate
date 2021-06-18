import { GetStaticPaths, GetStaticProps } from 'next'
import NextLink from 'next/link'

import { useCurrentUserQuery } from '~/api/currentUser.generated'
import { GetSongDocument } from '~/api/getSong.generated'
import { getApolloClient } from '~/apollo'
import { Song } from '~/song/models'

type SongPageProps = {
  song: Song
}

/* TODO: fill in */
function SongPage({ song }: SongPageProps) {
  const { data: currentUserData } = useCurrentUserQuery()
  const user = currentUserData?.me

  return (
    <div>
      <p>{JSON.stringify(song)}</p>
      {user && (
        <p>
          <NextLink href={`/song/${song.slug}/edit`}>
            <a>Edit</a>
          </NextLink>
        </p>
      )}
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<SongPageProps> = async ({
  params = {},
}) => {
  const { slug } = params

  const apolloClient = getApolloClient()

  const {
    data: { song },
  } = await apolloClient.query({
    query: GetSongDocument,
    variables: { slug },
  })

  if (!song) {
    return { notFound: true }
  }

  return {
    props: { song },
    revalidate: 30,
  }
}

export default SongPage
