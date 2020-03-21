import { Query, Resolver } from '@nestjs/graphql'

@Resolver()
export class SongResolver {
  @Query((_returns) => String)
  test() {
    return 'Test!'
  }
}
