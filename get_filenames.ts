import fs from 'fs'

export default async function getFilenames() : Promise<object | undefined> {
  let response: CustomResponse | undefined

  fs.readdir('/annotations', (err, files) => {
    if (err) {
      response = undefined
    } else {
      const fileNames = files.filter(file => fs.statSync(file).isFile())
      
      let message = ''
      for (const name in fileNames) {
        message += name + "\n"
      }

      response = { status: 200, message: message }
    }
  })

  return response
}