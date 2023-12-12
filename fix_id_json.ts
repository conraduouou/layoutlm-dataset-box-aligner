import { readFile, writeFile } from 'node:fs/promises'

export default async function fixIdJson(filename: string): Promise<CustomResponse | undefined> {
  try {
    const response = await readFile('./annotations/' + filename, { encoding: 'utf8' })
    const json = JSON.parse(response)

    for (let i = 0; i < json.form.length; i++) {
      json.form[i].id = i
    }

    await writeFile('./annotations-fixed/' + filename, JSON.stringify(json))

    return <CustomResponse>{ status: 201, message: `Fixing of ${filename}'s IDs was successful! Check the 'annotations-fixed' folder!` }
  } catch (error) {
    return undefined
  }
}