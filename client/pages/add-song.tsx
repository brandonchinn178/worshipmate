import { withAuth } from '~/auth/hoc'
import { SongForm, SongFormValues } from '~/song/SongForm'

function AddSongPage() {
  const onSubmit = async (payload: SongFormValues) => {
    console.log(payload)
  }

  return <SongForm onSubmit={onSubmit} />
}

export default withAuth(AddSongPage)
