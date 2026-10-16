import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const routeParams = routes.find((route) => {
    return route.method === method && route.path.test(url)
  })

  if (routeParams) {
    const routeParamsValues = req.url.match(routeParams.path)
    const { query, ...params } = routeParamsValues.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return routeParams.handler(req, res)
  }

  return res.writeHead(404).end(JSON.stringify({ error: 'Rota não encontrada' }))
})

server.listen(3333, () => {
  console.log('🚀 Servidor rodando na porta 3333')
})