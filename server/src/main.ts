import { initServer } from './apollo'
import { initDatabase } from './db'

const runServer = async () => {
  const db = await initDatabase()
  const server = initServer(db)

  // starts an HttpServer in the background
  const { url } = await server.listen(4000)

  console.log(`🚀  Server ready at ${url}`)
}

runServer().catch((e) => {
  console.error(e)
  process.exit(1)
})
