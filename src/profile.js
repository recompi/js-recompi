const crypto = require('crypto')
const { RecomPIException, RecomPIFieldTypeError } = require('./exceptions')

class Profile {
  constructor(name, id) {
    this.id = id
    this.name = name

    RecomPIFieldTypeError.ifNotValidated(
      'Profile.constructor',
      'id',
      this.id,
      String,
    )
    RecomPIFieldTypeError.ifNotValidated(
      'Profile.constructor',
      'name',
      this.name,
      String,
    )

    if (!this.id || !this.name) {
      throw new RecomPIException(
        'Both `id` and `name` are required for initializing a Profile.',
      )
    }
  }

  toJSON() {
    return { [this.name]: this.id }
  }

  toString() {
    return JSON.stringify(this.toJSON())
  }
}

class SecureProfile extends Profile {
  constructor(name, id) {
    super(name, id)
  }

  toJSON(hashSalt = null) {
    const hash = (value) =>
      crypto
        .createHash('sha256')
        .update(value + (hashSalt || ''))
        .digest('hex')
    return {
      [this.name]: hash(this.id),
    }
  }
}

module.exports = { Profile, SecureProfile }
