import { Args, Query, Resolver } from '@nestjs/graphql'

import { Song } from './song.entity'
import { SongService } from './song.service'

@Resolver(() => Song)
export class SongResolver {
  constructor(private songService: SongService) {}

  @Query((_returns) => [Song], { name: 'songs' })
  async searchSongs(@Args('query') query: string) {
    return this.songService.searchSongs(query)
  }
}
