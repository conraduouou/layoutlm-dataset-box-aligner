import writeJson from './write_json'
import http from 'http'
import * as k from './constants'
import getFilenames from './get_filenames'

async function handlePost(req: http.IncomingMessage, res: http.ServerResponse) {
  let response: CustomResponse = {}

  switch (req.url) {
    case '/write': {
      let body = ''

      req.on('data', chunk => {
        body += chunk.toString()
      })

      req.on('end', async () => {
        const result = await writeJson('example.json', body)

        if (result) {
          response = { status: 201, message: 'Data written successfully!' }
        }
      })

      break
    }
    default:
      response = { status: 404 }
  }

  res.writeHead(response.status ?? 404, k.DEFAULT_MESSAGE_HEADERS)

  switch (response.status) {
    case 500:
      res.end(response.message ?? k.DEFAULT_ERROR_MESSAGE)
      break
    case 201:
      res.end(response.message ?? k.DEFAULT_SUCCESS_MESSAGE)
      break
    default:
      res.end(k.DEFAULT_NOT_FOUND_MESSAGE)
  }
}

async function handleGet(req: http.IncomingMessage, res: http.ServerResponse) {
  let response: CustomResponse = {}

  switch (req.url) {
    case '/get-filenames': {
      req.on('end', async () => {
        const result = await getFilenames()
        if (result) response = result
      })

      break
    }
    default:
      response = { status: 404 }
  }

  res.writeHead(response.status ?? 404, k.DEFAULT_MESSAGE_HEADERS)

  switch (response.status) {
    case 500:
      res.end(response.message ?? k.DEFAULT_ERROR_MESSAGE)
      break
    case 200:
      res.end(response.message ?? k.DEFAULT_SUCCESS_MESSAGE)
      break
    default:
      res.end(k.DEFAULT_NOT_FOUND_MESSAGE)
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST')

  switch (req.method) {
    case 'POST':
      handlePost(req, res)
      break
    case 'GET':
      handleGet(req, res)
      break
    default:
      res.writeHead(404, k.DEFAULT_MESSAGE_HEADERS)
      res.end(k.DEFAULT_ERROR_MESSAGE)
  }
})

server.listen(k.PORT, () => {
  console.log(`Server running on http://localhost:${k.PORT}`)
})