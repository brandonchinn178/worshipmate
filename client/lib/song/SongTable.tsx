import { FC } from 'react'

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

const SongTable: FC<SongTableProps> = ({ songs }) => (
  <DataTable data={songs} columnDefs={songTableColumnDefs} />
)

export default SongTable
