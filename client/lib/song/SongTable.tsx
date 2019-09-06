import { FC } from 'react'

import { Song } from '.'

type SongTableProps = {
  songs: Song[]
}

const SongTable: FC<SongTableProps> = ({ songs }) => (
  <div>
    {songs.map(({ slug, title, artist, themes }) => (
      <div key={slug} style={{ borderBottom: '1px solid black' }}>
        <div>Slug: {slug}</div>
        <div>Title: {title}</div>
        <div>Artist: {artist}</div>
        <div>Themes: {themes.join(', ')}</div>
      </div>
    ))}
  </div>
)

export default SongTable
