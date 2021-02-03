
// const add = require('../add.js')
import { add, mul } from '../add'
var assert = require('assert')

describe('add function testing', function () {
    it('1 + 2 should return 3', function() {
        assert.equal(add(1, 2), 3)
    })
    
    it('2 + 2 should return 4', function() {
        assert.equal(add(2, 2), 4)
    })
    
    it('5 + 5 should return 10', function() {
        assert.equal(add(5, 5), 10)
    })

    it('5 * 5 should return 25', function() {
        assert.equal(mul(5, 5), 25)
    })
})
