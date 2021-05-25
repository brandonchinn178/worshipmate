import NextLink from 'next/link'

import { ColumnDefs, DataTable } from '~/ui-kit/DataTable'

import { Song } from './models'

type SongTableProps = {
  songs: readonly Song[]
}

const songTableColumnDefs: ColumnDefs<Song> = [
  {
    name: 'title',
    header: 'Name',
    size: '2fr',
    render: ({ title, slug }) => (
      <NextLink href={`/song/${slug}`}>
        <a>{title}</a>
      </NextLink>
    ),
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

export function SongTable({ songs }: SongTableProps) {
  return (
    <DataTable
      data={songs}
      columnDefs={songTableColumnDefs}
      rowKey={({ slug }) => slug}
    />
  )
}
