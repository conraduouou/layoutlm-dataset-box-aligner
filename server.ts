import http from 'http'
import * as k from './constants'
import getFilenames from './get_filenames'
import fixResumeJson from './fix_resume_json'
import fixResumeLabelJson from './fix_resume_label_json'
import fixIdJson from './fix_id_json'

function handleResponse(response: CustomResponse, res: http.ServerResponse) {
  res.writeHead(response.status ?? 404, k.DEFAULT_MESSAGE_HEADERS)

  switch (response.status) {
    case 500:
      res.end(JSON.stringify(response ?? k.DEFAULT_ERROR_MESSAGE))
      break
    case 200:
    case 201:
      res.end(JSON.stringify(response ?? k.DEFAULT_SUCCESS_MESSAGE))
      break
    default:
      res.end(JSON.stringify(k.DEFAULT_NOT_FOUND_MESSAGE))
  }
}

async function handlePost(req: http.IncomingMessage, res: http.ServerResponse) {
  let response: CustomResponse = {}

  let body = ''

  req.on('data', chunk => {
    body += chunk.toString()
  })

  req.on('end', async () => {
    switch (req.url) {
      case '/fix-resume-json':
        try {
          const requestBody = JSON.parse(body)
          const result: CustomResponse | undefined = await fixResumeJson(requestBody.filename)
          if (result) response = result
          handleResponse(response, res)
        } catch (error) {
          const filenamesResult = await getFilenames()
          if (!filenamesResult) handleResponse(response, res)
          const filenames = filenamesResult!.body.filenames
  
          for (const name of filenames) {
            await fixResumeJson(name)
          }
  
          response = { status: 201, message: `Fixing of resume jsons was successful! Check the 'annotations-fixed' folder!` }
  
          handleResponse(response, res)
        }
  
        break
  
      case '/fix-resume-label-json':
        try {
          const requestBody = JSON.parse(body)
          const result: CustomResponse | undefined = await fixResumeLabelJson(requestBody.filename)
          console.log(result)
          if (result) response = result
          handleResponse(response, res)
        } catch (error) {
          const filenamesResult = await getFilenames()
          if (!filenamesResult) handleResponse(response, res)
          const filenames = filenamesResult!.body.filenames
  
          for (const name of filenames) {
            await fixResumeLabelJson(name)
          }
  
          response = { status: 201, message: `Fixing of resume jsons' labels was successful! Check the 'annotations-fixed' folder!` }
  
          handleResponse(response, res)
        }

        break
  
      case '/fix-id-json':
        try {
          const requestBody = JSON.parse(body)
          const result: CustomResponse | undefined = await fixIdJson(requestBody.filename)
          console.log(result)
          if (result) response = result
          handleResponse(response, res)
        } catch (error) {
          const filenamesResult = await getFilenames()
          if (!filenamesResult) handleResponse(response, res)
          const filenames = filenamesResult!.body.filenames
  
          for (const name of filenames) {
            await fixIdJson(name)
          }
  
          response = { status: 201, message: `Fixing of resume jsons' IDs was successful! Check the 'annotations-fixed' folder!` }
  
          handleResponse(response, res)
        }
        break
  
      default:
        response = { status: 404 }
        handleResponse(response, res)
    }
  })
}

async function handleGet(req: http.IncomingMessage, res: http.ServerResponse) {
  let response: CustomResponse = {}

  switch (req.url) {
    case '/filenames': {
      const result = await getFilenames()
      if (result) response = result
      handleResponse(response, res)
      break
    }
    default:
      response = { status: 404 }
      handleResponse(response, res)
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