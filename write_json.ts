import fs from 'fs'

export default async function writeJson(location: string, data: string) : Promise<object | undefined> {
  const json = JSON.parse(data)
  const stringJson = JSON.stringify(json)

  let response: CustomResponse | undefined

  fs.writeFile(location, stringJson, (err) => {
    if (err) {
      response = undefined
    } else {
      response = { status: 201 }
    }
  })

  return response
}