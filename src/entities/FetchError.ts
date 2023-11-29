export interface FetchError extends Error {
  info: string
  status: number
  message: string
}

export class FetchError implements FetchError {
  constructor(message: string, status: number, info: string) {
    this.name = 'FetchError'
    this.info = info
    this.status = status
    this.message = message
  }
}
