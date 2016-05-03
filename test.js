'use strict'

const test = require('tap').test
const Parser = require('./')

test('Parser', (t) => {
  t.throws(() => {
    new Parser()
  }, /str must be a string/)

  t.throws(() => {
    new Parser('')
  }, /validator is required and must be an object/)

  t.throws(() => {
    new Parser('', null)
  }, /validator is required and must be an object/)

  t.throws(() => {
    new Parser('', {})
  }, 'validator.report() is required')

  {
    const input = `commit e7c077c610afa371430180fbd447bfef60ebc5ea
Author: Calvin Metcalf <cmetcalf@appgeo.com>
Date:   Tue Apr 12 15:42:23 2016 -0400

    stream: make null an invalid chunk to write in object mode

    this harmonizes behavior between readable, writable, and transform
    streams so that they all handle nulls in object mode the same way by
    considering them invalid chunks.

    PR-URL: https://github.com/nodejs/node/pull/6170
    Reviewed-By: James M Snell <jasnell@gmail.com>
    Reviewed-By: Matteo Collina <matteo.collina@gmail.com>`

    const data = { name: 'biscuits' }

    const v = {
      report: (obj) => {
        t.pass('called report')
        t.equal(obj.data, data, 'obj')
      }
    }
    const p = new Parser(input, v)
    t.equal(p.sha, 'e7c077c610afa371430180fbd447bfef60ebc5ea', 'sha')
    t.equal(p.author, 'Calvin Metcalf <cmetcalf@appgeo.com>', 'author')
    p.report(data)
  }
  t.end()
})
