const { RecomPIFieldTypeError } = require('./exceptions')

class RecomPIResponse {
  constructor(version, response) {
    RecomPIFieldTypeError.ifNotValidated(
      'RecomPIResponse',
      'response',
      response,
      Object,
    )
    this.version = version
    this.body = response.data
    this.status = response.status
  }

  isSuccess() {
    return this.status >= 200 && this.status < 300
  }

  toString() {
    return `[success: ${this.isSuccess()}] ${this.body ? JSON.stringify(this.body) : ''}`
  }
}

module.exports = RecomPIResponse
