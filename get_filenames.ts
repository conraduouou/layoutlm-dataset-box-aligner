import fs from 'fs'

export default async function getFilenames() : Promise<object | undefined> {
  try {
    const files = await fs.promises.readdir('/annotations')
    const fileNames = files.filter(file => fs.statSync(file).isFile())
    const response: CustomResponse | undefined = { status: 200, body: fileNames }
    return response
  } catch (error) {
    return undefined
  }
}