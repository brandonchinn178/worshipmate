import { DataSource } from 'apollo-datasource'

import { Song } from './models'

export class SongAPI extends DataSource {
  constructor() {
    super()
  }

  async searchSongs(query?: string): Promise<Song[]> {
    console.log(query)
    return []
  }
}
