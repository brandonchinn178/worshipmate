import { INestApplication } from '@nestjs/common'
import supertest from 'supertest'
import { createConnection, getConnection } from 'typeorm'

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

// A helper for ensuring that a TypeORM connection is running.
export const setupConnection = () => {
  beforeAll(async () => {
    await createConnection()
  })

  afterAll(async () => {
    // close test database connection
    const connection = await getConnection()
    await connection.close()
  })
}
