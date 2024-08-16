const { RecomPIException, RecomPIFieldTypeError } = require('./exceptions')

class Location {
  constructor(ip = null, url = null, referer = null, useragent = null) {
    this.ip = ip
    this.url = url
    this.referer = referer
    this.useragent = useragent

    if (!this.ip && !this.url && !this.referer && !this.useragent) {
      throw new RecomPIException(
        'At least one of the location fields must be provided.',
      )
    }

    if (this.ip) {
      RecomPIFieldTypeError.ifNotValidated(
        'Location.constructor',
        'ip',
        this.ip,
        String,
      )
    }
    if (this.url) {
      RecomPIFieldTypeError.ifNotValidated(
        'Location.constructor',
        'url',
        this.url,
        String,
      )
    }
    if (this.referer) {
      RecomPIFieldTypeError.ifNotValidated(
        'Location.constructor',
        'referer',
        this.referer,
        String,
      )
    }
    if (this.useragent) {
      RecomPIFieldTypeError.ifNotValidated(
        'Location.constructor',
        'useragent',
        this.useragent,
        String,
      )
    }
  }

  toJSON() {
    const data = {}
    if (this.ip) data.ip = this.ip
    if (this.url) data.url = this.url
    if (this.referer) data.referer = this.referer
    if (this.useragent) data.useragent = this.useragent
    return data
  }

  toString() {
    return JSON.stringify(this.toJSON())
  }
}

module.exports = Location
