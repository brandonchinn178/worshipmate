import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

import { SongModule } from './song/song.module'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: false,
      playground: false,
      autoSchemaFile: 'schema.gql',
    }),

    SongModule,
  ],
})
export class AppModule {}
