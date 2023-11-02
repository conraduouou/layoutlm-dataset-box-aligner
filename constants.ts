export const DEFAULT_MESSAGE_HEADERS = { 'Content-Type': 'application/json' }
export const DEFAULT_ERROR_MESSAGE = { status: 500, message: 'Internal Server Error' }
export const DEFAULT_NOT_FOUND_MESSAGE = { status: 404, message: 'Not Found' }
export const DEFAULT_SUCCESS_MESSAGE = { status: 200, message: 'Success!' }

export const PORT = process.env.PORT || 3000

export default {
  DEFAULT_ERROR_MESSAGE,
  DEFAULT_MESSAGE_HEADERS,
  DEFAULT_NOT_FOUND_MESSAGE,
  DEFAULT_SUCCESS_MESSAGE,
  PORT
}