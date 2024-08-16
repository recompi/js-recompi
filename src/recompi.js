const axios = require('axios')
const Tag = require('./tag')
const Geo = require('./geo')
const Location = require('./location')
const RecomPIResponse = require('./response')
const { Profile, SecureProfile } = require('./profile')
const { RecomPIException, RecomPIFieldTypeError } = require('./exceptions')

class API {
  constructor(apiKey, version = 2, secureUrl = true, hashSalt = null) {
    this.apiKey = apiKey
    this.version = version
    this.hashSalt = hashSalt

    RecomPIFieldTypeError.ifNotValidated(
      'RecomPI.constructor',
      'apiKey',
      apiKey,
      String,
    )
    RecomPIFieldTypeError.ifNotValidated(
      'RecomPI.constructor',
      'version',
      version,
      Number,
    )
    RecomPIFieldTypeError.ifNotValidated(
      'RecomPI.constructor',
      'secureUrl',
      secureUrl,
      Boolean,
    )

    if (version <= 0) {
      throw new RecomPIException('Version must be greater than 0.')
    }

    if (hashSalt !== null) {
      RecomPIFieldTypeError.ifNotValidated(
        'RecomPI.constructor',
        'hashSalt',
        hashSalt,
        String,
      )
    }

    this.BASE_URL = secureUrl
      ? 'https://api.recompi.com'
      : 'http://api.recompi.com'
  }

  async _request(method, endpoint, data, headers = {}) {
    if (typeof headers !== 'object') {
      headers = {}
    }

    headers['Content-Type'] = headers['Content-Type'] || 'application/json'

    const response = await axios({
      method,
      url: `${this.BASE_URL}/${endpoint}`,
      headers,
      data,
    })

    return new RecomPIResponse(this.version, response)
  }

  static _list2dict(arr) {
    return arr.reduce((acc, curr) => ({ ...acc, ...curr }), {})
  }

  _validateProfiles(profiles) {
    if (!Array.isArray(profiles)) {
      throw new RecomPIException(
        'profiles must be a list of Profile or SecureProfile instances.',
      )
    }

    if (profiles.length === 0) {
      throw new RecomPIException(
        'At least one profile must be provided for personalized recommendations.',
      )
    }

    profiles.forEach((profile, index) => {
      if (profile instanceof Profile) {
        RecomPIFieldTypeError.ifNotValidated(
          'push',
          `profiles[${index}]`,
          profile,
          Profile,
        )
      } else if (profile instanceof SecureProfile) {
        RecomPIFieldTypeError.ifNotValidated(
          'push',
          `profiles[${index}]`,
          profile,
          SecureProfile,
        )
      } else {
        throw new RecomPIException(
          'All profiles must be either Profile or SecureProfile instances.',
        )
      }
    })
  }

  async push(label, tags, profiles, location, geo = null) {
    RecomPIFieldTypeError.ifNotValidated('push', 'label', label, String)

    if (tags instanceof Tag) {
      tags = [tags]
    }
    RecomPIFieldTypeError.ifNotValidated('push', 'tags', tags, Tag, true)

    if (profiles instanceof Profile) profiles = [profiles]

    if (profiles instanceof SecureProfile) profiles = [profiles]

    this._validateProfiles(profiles)

    RecomPIFieldTypeError.ifNotValidated(
      'push',
      'location',
      location,
      Location,
    )

    if (geo) RecomPIFieldTypeError.ifNotValidated('push', 'geo', geo, Geo)

    const payload = {
      label,
      tags: tags.map((tag) => tag.toJSON()),
      profiles: profiles.map((profile) => profile.toJSON(this.hashSalt)),
      location: location.toJSON(),
      geo: geo ? geo.toJSON() : undefined,
    }

    return await this._request(
      'POST',
      `push/v${this.version}/${this.apiKey}`,
      payload,
    )
  }

  async recom(labels, profiles = null, geo = null) {
    if (labels instanceof String) {
      labels = [labels]
    }
    RecomPIFieldTypeError.ifNotValidated(
      'push',
      'labels',
      labels,
      String,
      true,
    )

    if (profiles) {
      if (profiles instanceof Profile) profiles = [profiles]

      this._validateProfiles(profiles)
    }

    if (geo) {
      RecomPIFieldTypeError.ifNotValidated('push', 'geo', geo, Geo)
    }

    if (!profiles && !geo)
      throw new RecomPIException(
        'At least one of profiles or geo must be provided!',
      )

    data = {
      labels: labels,
    }

    if (profiles) {
      data['profiles'] = RecomPI._list2dict(
        profiles.map((profile) => profile.toJSON(this.hashSalt)),
      )
    }

    if (geo) data['geo'] = geo.to_json()

    return this._request('POST', `recom/v${this.version}/${this.apiKey}`, data)
  }

  async verify() {
    return this._request('GET', `verify/v${this.version}/${this.apiKey}`, null)
  }
}

module.exports = {
  API,
  Tag,
  Geo,
  Location,
  RecomPIResponse,
  Profile,
  SecureProfile,
  RecomPIException,
  RecomPIFieldTypeError,
}
