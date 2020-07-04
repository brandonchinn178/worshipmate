import { initServer } from './apollo'

const server = initServer()
server.listen(4000).then(({ url }: { url: string }) => {
  console.log(`🚀  Server ready at ${url}`)
})
