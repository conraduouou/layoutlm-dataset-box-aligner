interface FilenamesResponse extends CustomResponse {
  body: {
    length: number,
    filenames: string[]
  }
}