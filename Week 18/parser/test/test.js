// const add = require('../add.js')
// import { add, mul } from '../add'

import { parseHTML } from '../src/parser';
var assert = require('assert')

describe('Parse HTML:', function () {
    it('<a>123</a>', function() {
        let tree = parseHTML('<a>123</a>')
        console.info('tree:', tree)
        assert.equal(1, 1)
    })
})
