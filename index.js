'use strict'

const headingRE = /([^\:]+):([\s]+)(.*)/

module.exports = class Parser {
  constructor(str, validator) {
    if (typeof str !== 'string') {
      throw new TypeError('str must be a string')
    }
    if (!validator || typeof validator !== 'object') {
      throw new TypeError('validator is required and must be an object')
    }
    if (!validator.report) {
      throw new Error('validator.report() is required')
    }
    this._raw = str
    this.sha = null
    this.title = null
    this.author = null
    this.date = null
    this.body = null
    this.validator = validator
    this.options = validator.config
    this.parse()
  }

  toJSON() {
    return {
      sha: this.sha
    , title: this.title
    , author: this.author
    , date: this.date
    , body: this.body
    }
  }

  inspect(depth, opts) {
    if (opts && opts.showHidden) {
      return Object.assign(this.toJSON(), {
        _raw: this._raw
      })
    }
    return this.toJSON()
  }

  parse() {
    const splits = this._raw.split('\n')
    const commitLine = splits.shift()

    this.sha = commitLine.replace('commit ', '')
    var line
    while (line = splits.shift()) {
      line = line.trim()
      if (!line) break // stop on the first empty line
      const matches = line.match(headingRE)
      if (matches) {
        const key = matches[1].toLowerCase()
        const val = matches[3]
        if (key === 'date' || key === 'authordate') {
          this.date = val
        } else if (key === 'author') {
          this.author = val
        }
      }
    }

    const body = splits.map((item) => {
      // TODO(evanlucas) maybe support commit messages that are not
      // indented by 4 spaces
      if (item.length) return item.slice(4, item.length)
      return ''
    })

    this.title = body.shift()

    this.body = body
  }

  report(data) {
    this.validator.report({
      commit: this
    , data: data
    })
  }
}
