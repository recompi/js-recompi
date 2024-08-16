const { RecomPIException, RecomPIFieldTypeError } = require('./exceptions')

class Tag {
  constructor(id, name, desc = null) {
    this.id = id
    this.name = name
    this.desc = desc || name

    RecomPIFieldTypeError.ifNotValidated('Tag.constructor', 'id', this.id, String)
    RecomPIFieldTypeError.ifNotValidated(
      'Tag.constructor',
      'name',
      this.name,
      String,
    )
    RecomPIFieldTypeError.ifNotValidated(
      'Tag.constructor',
      'desc',
      this.desc,
      String,
    )

    if (!this.id || !this.name) {
      throw new RecomPIException(
        'Both `id` and `name` are required for initializing a Tag.',
      )
    }
  }

  toJSON() {
    return { id: this.id, name: this.name, desc: this.desc }
  }

  toString() {
    return JSON.stringify(this.toJSON())
  }
}

module.exports = Tag