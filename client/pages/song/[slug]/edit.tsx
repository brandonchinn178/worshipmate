import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'

import {
  GetSongDocument,
  useGetSongQuery,
  useUpdateSongMutation,
} from '~/api/songApi.generated'
import { getApolloClient } from '~/apollo'
import { WithAuth, withAuth } from '~/auth/hoc'
import { SongForm, SongFormValues } from '~/song/SongForm'

type EditSongPageProps = {
  id: string
  slug: string
}

function EditSongPage({ id, slug }: WithAuth<EditSongPageProps>) {
  const router = useRouter()
  const { data: getSongData } = useGetSongQuery({
    variables: { slug },
  })
  const [updateSong] = useUpdateSongMutation()

  const onSubmit = async (payload: SongFormValues) => {
    const { data: updateSongData } = await updateSong({
      variables: {
        id,
        data: payload,
      },
    })
    const updatedSlug = updateSongData?.updateSong?.slug ?? slug
    router.push({ pathname: `/song/${updatedSlug}` })
  }

  const song = getSongData?.song
  if (!song) {
    return null
  }

  const initialSong = {
    ...song,
    artist: song.artist.name,
  }

  return <SongForm initialSong={initialSong} onSubmit={onSubmit} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<EditSongPageProps> = async ({
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
    props: {
      id: song.id,
      slug: slug as string,
    },
    revalidate: 300,
  }
}

export default withAuth(EditSongPage)
