import { GetStaticPaths, GetStaticProps } from 'next'

import { GetSongDocument } from '~/api/getSong.generated'
import { getApolloClient } from '~/apollo'
import { Song } from '~/song/models'

type SongPageProps = {
  song: Song
}

function SongPage({ song }: SongPageProps) {
  // TODO
  return JSON.stringify(song)
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

  const { data: song } = await apolloClient.query({
    query: GetSongDocument,
    variables: { slug },
  })

  return {
    props: { song },
    revalidate: 30,
  }
}

export default SongPage
