class RecomPIException extends Error {
  constructor(...args) {
    super(...args)
    this.name = 'RecomPIException'
  }
}

class RecomPIFieldTypeError extends RecomPIException {
  constructor(op, field, value, targetClass) {
    super(
      `In \`${op}\` operation expecting the \`${field}\` to be an instance of \`${targetClass}\`; but got an instance of \`${value.constructor.name}\``,
    )
  }

  static ifNotValidated(op, name, value, as_, isArray = false) {
    if (typeof value === 'object') {
      value = new Object(value)
    }
    if (typeof value === 'string') {
      value = new String(value)
    }
    if (typeof value === 'number') {
      value = new Number(value)
    }
    if (typeof value === 'boolean') {
      value = new Boolean(value)
    }

    if (isArray) {
      if (!Array.isArray(value)) {
        throw new RecomPIFieldTypeError(op, name, value, 'Array')
      }
      value.forEach((val, index) => {
        if (!(val instanceof as_)) {
          throw new RecomPIFieldTypeError(
            op,
            `${name}[${index}]`,
            val,
            as_.name,
          )
        }
      })
    } else {
      if (!(value instanceof as_)) {
        throw new RecomPIFieldTypeError(op, name, value, as_.name)
      }
    }
  }
}

module.exports = { RecomPIException, RecomPIFieldTypeError }
