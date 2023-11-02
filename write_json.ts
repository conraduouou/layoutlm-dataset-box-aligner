import fs from 'fs'

export default async function writeJson(location: string, data: string): Promise<CustomResponse | undefined> {
  try {
    const json = JSON.parse(data)
    const stringJson = JSON.stringify(json)
  
    // perform write
    await fs.promises.writeFile(location, stringJson)

    return <CustomResponse>{ status: 201 }
  } catch (error) {
    return undefined
  }
}