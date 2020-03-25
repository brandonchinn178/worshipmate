import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Song } from './song.entity'
import { SongResolver } from './song.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  providers: [SongResolver],
})
export class SongModule {}
