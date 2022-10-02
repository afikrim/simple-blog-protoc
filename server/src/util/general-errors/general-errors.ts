export const ErrBadRequestName = 'ErrBadRequest'
export const ErrNotFoundName = 'ErrNotFound'

const defaultErrBadRequestMessage = 'Bad request'
const defaultErrNotFoundMessage = 'Not found'

export class ErrBadRequest extends Error {
  constructor(message?: string) {
    if (!message) {
      message = defaultErrBadRequestMessage
    }

    super(message)
    this.name = ErrBadRequestName
  }
}

export class ErrNotFound extends Error {
  constructor(message?: string) {
    if (!message) {
      message = defaultErrNotFoundMessage
    }

    super(message)
    this.name = ErrNotFoundName
  }
}
