import { readFile, writeFile } from 'node:fs/promises'

export default async function fixResumeLabelJson(filename: string): Promise<CustomResponse | undefined> {
  try {
    const response = await readFile('./annotations/' + filename, { encoding: 'utf8' })
    const json = JSON.parse(response)

    for (const entry of json.form) {
      entry.label = 'other'
    }

    await writeFile('./annotations-fixed/' + filename, JSON.stringify(json))

    return <CustomResponse>{ status: 201, message: `Fixing of ${filename}'s labels was successful! Check the 'annotations-fixed' folder!` }
  } catch (error) {
    return undefined
  }
}