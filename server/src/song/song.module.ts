import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Song } from './song.entity'
import { SongResolver } from './song.resolver'
import { SongService } from './song.service'

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  providers: [SongResolver, SongService],
})
export class SongModule {}
