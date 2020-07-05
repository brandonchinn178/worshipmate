import { initServer } from './apollo'
import { initDatabase } from './db'

const db = initDatabase()
const server = initServer(db)

server.listen(4000).then(({ url }: { url: string }) => {
  console.log(`🚀  Server ready at ${url}`)
})
