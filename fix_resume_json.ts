import { readFile, writeFile } from 'node:fs/promises'

export default async function fixResumeJson(path: string): Promise<CustomResponse | undefined> {
  try {
    const response = await readFile('./annotations/' + path, { encoding: 'utf8' })
    const json = JSON.parse(response)

    let i = 0
    while (i < json.form.length) {
      if (i === 0) {
        i++
        continue
      }

      let current = json.form[i]

      for (let before = 0; before < i; before++) {
        const startEntry = json.form[before]

        while (current.box[1] === startEntry.box[1] && current.box[3] === startEntry.box[3]) {
          for (let k = 0; k < current.words.length; k++) {
            const currentWords = {
              "text": current.words[k].text,
              "box": current.words[k].box
            }

            // if the current word entry the iterator is pointing to goes first visually in the image,
            // then append it to the front of the text and the `words` list of `startEntry`
            if (current.box[0] < startEntry.box[0]) {
              startEntry.words.unshift(currentWords)
              startEntry.text = current.words[k].text + " " + startEntry.text
            } else {
              startEntry.words.push(currentWords)
              startEntry.text += " " + current.words[k].text
            }
          }

          // essentially just remove the current element
          json.form.splice(i, 1)

          if (i >= json.form.length) break

          current = json.form[i]
        }
      }

      i++
    }

    await writeFile('./annotations-fixed/' + path, JSON.stringify(json))

    return <CustomResponse>{ status: 201, message: `Fixing of ${path} was successful! Check the 'annotations-fixed' folder!` }
  } catch (error) {
    console.log(error)
    return undefined
  }
}