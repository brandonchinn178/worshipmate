import { INestApplication } from '@nestjs/common'
import supertest from 'supertest'

type GraphQLQuery = {
  query: string
  variables?: object
}

export const request = async (app: INestApplication, query: GraphQLQuery) => {
  const response = await supertest(app.getHttpServer())
    .post('/graphql')
    .send(query)
    .expect(200)

  const { data } = response.body

  return data
}
