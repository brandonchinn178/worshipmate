import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Song } from './song.entity'

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  // TODO: add filters
  searchSongs(query?: string) {
    let queryBuilder = this.songRepository.createQueryBuilder('song')

    if (query) {
      queryBuilder = queryBuilder.where('song.title ILIKE :query', {
        query: `%${query}%`,
      })
    }

    return queryBuilder.getMany()
  }
}
