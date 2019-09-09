import DataTable, { ColumnDefs } from '~/toolkit/DataTable'

import { Song } from '.'

type SongTableProps = {
  songs: Song[]
}

const songTableColumnDefs: ColumnDefs<Song> = [
  {
    name: 'title',
    header: 'Name',
    size: '2fr',
    render: ({ title }) => <a href="#">{title}</a>,
  },
  {
    name: 'artist',
    size: '2fr',
  },
  {
    name: 'themes',
    size: '3fr',
    render: ({ themes }) => themes.join(', '),
  },
]

export default function SongTable({ songs }: SongTableProps) {
  return <DataTable data={songs} columnDefs={songTableColumnDefs} />
}
