import { useRouter } from 'next/router'

import { useAddSongMutation } from '~/api/songApi.generated'
import { withAuth } from '~/auth/hoc'
import { SongForm, SongFormValues } from '~/song/SongForm'

function AddSongPage() {
  const router = useRouter()
  const [addSong] = useAddSongMutation()

  const onSubmit = async (payload: SongFormValues) => {
    await addSong({
      variables: { data: payload },
    })
    router.push({ pathname: '/' })
  }

  return <SongForm onSubmit={onSubmit} />
}

export default withAuth(AddSongPage)
