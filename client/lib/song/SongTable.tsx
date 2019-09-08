import DataTable, { ColumnDefs } from '~/toolkit/DataTable'

import { Song } from '.'

type SongTableProps = {
  songs: Song[]
}

const songTableColumnDefs: ColumnDefs<Song> = [
  {
    name: 'title',
    size: '2fr',
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
