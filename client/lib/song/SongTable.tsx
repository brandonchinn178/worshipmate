import DataTable, { ColumnDefs } from '~/toolkit/DataTable'
import Link from '~/toolkit/Link'

import { Song } from '.'

type SongTableProps = {
  songs: Song[]
}

const songTableColumnDefs: ColumnDefs<Song> = [
  {
    name: 'title',
    header: 'Name',
    size: '2fr',
    render: ({ title }) => <Link href="#">{title}</Link>,
  },
  {
    name: 'artist',
    size: '2fr',
  },
  {
    name: 'themes',
    size: '3fr',
    render: (song) => song.themes.join(', '),
  },
]

export default function SongTable({ songs }: SongTableProps) {
  return <DataTable data={songs} columnDefs={songTableColumnDefs} />
}
