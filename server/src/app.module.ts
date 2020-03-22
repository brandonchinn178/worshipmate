import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SongModule } from './song/song.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      debug: false,
      playground: false,
      autoSchemaFile: 'schema.gql',
    }),

    SongModule,
  ],
})
export class AppModule {}
