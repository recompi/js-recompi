const { RecomPIException, RecomPIFieldTypeError } = require('./exceptions')

class Geo {
  constructor(country = null, province = null) {
    this.country = country
    this.province = province

    RecomPIFieldTypeError.ifNotValidated(
      'Geo.constructor',
      'country',
      this.country,
      String,
    )
    RecomPIFieldTypeError.ifNotValidated(
      'Geo.constructor',
      'province',
      this.province,
      String,
    )

    if (!this.country && !this.province) {
      throw new RecomPIException(
        'At least one of the geo fields must be provided.',
      )
    }
  }

  toJSON() {
    const data = {}
    if (this.country) data.country = this.country
    if (this.province) data.province = this.province
    return data
  }

  toString() {
    return JSON.stringify(this.toJSON())
  }
}

module.exports = Geo
