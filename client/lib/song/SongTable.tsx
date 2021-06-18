import * as _ from 'lodash'
import NextLink from 'next/link'

import { ColumnDefs, DataTable } from '~/ui-kit/DataTable'
import { Icon } from '~/ui-kit/Icon'

import { Song } from './models'

type SongTableProps = {
  songs: readonly Song[]
  isAdmin?: boolean
}

export function SongTable({ songs, isAdmin = false }: SongTableProps) {
  const songTableColumnDefs: ColumnDefs<Song> = _.compact([
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
    isAdmin && {
      name: 'actions',
      header: '',
      render: ({ slug }) => (
        <NextLink href={`/song/${slug}/edit`}>
          <a>
            <Icon name="edit" width={16} />
          </a>
        </NextLink>
      ),
    },
  ])

  return (
    <DataTable
      data={songs}
      columnDefs={songTableColumnDefs}
      rowKey={({ slug }) => slug}
    />
  )
}
