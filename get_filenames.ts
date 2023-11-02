import fs from 'fs'

export default async function getFilenames() : Promise<object | undefined> {
  try {
    const files = await fs.promises.readdir('./annotations')
    const fileNames = files.filter(file => fs.statSync('./annotations/' + file).isFile())

    const body = {
      length: fileNames.length,
      filenames: fileNames
    }

    const response: CustomResponse | undefined = { status: 200, body: body }
    return response
  } catch (error) {
    console.log(error)
    return undefined
  }
}