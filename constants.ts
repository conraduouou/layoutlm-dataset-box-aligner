export const DEFAULT_MESSAGE_HEADERS = { 'Content-Type': 'text/plain' }
export const DEFAULT_ERROR_MESSAGE = 'Internal Server Error'
export const DEFAULT_NOT_FOUND_MESSAGE = 'Not Found'
export const DEFAULT_SUCCESS_MESSAGE = 'Success!'

export const PORT = process.env.PORT || 3000

export default {
  DEFAULT_ERROR_MESSAGE,
  DEFAULT_MESSAGE_HEADERS,
  DEFAULT_NOT_FOUND_MESSAGE,
  DEFAULT_SUCCESS_MESSAGE,
  PORT
}