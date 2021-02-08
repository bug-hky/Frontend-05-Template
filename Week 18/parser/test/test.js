// const add = require('../add.js')
// import { add, mul } from '../add'

import { parseHTML } from '../src/parser';
var assert = require('assert')

let htmlText = `<html>
<head>
  <title>vue-g</title>
  <style>
    .test-link {
        color: red;
        font-size: 20px;
    }
    #app {
        height: 100px;
        width: 100px;
        background: #CCCCCC;
    }
    a {
        text-decoration: underline;
    }
  </style>
</head>
<body>
  <div%
    data-range
    isError='false'
    id="app"
    return>
    <a
        href="https://zh.wikipedia.org/wiki/File:Andy_Lau_(cropped).jpg"
        class="test-link"
    >
        123345
    </a>
    1234
  </div%>
  <br/>
  <img src="https://zh.wikipedia.org/wiki/File:Andy_Lau_(cropped).jpg" />
</body>
</html>`
describe('Parse HTML:', function () {
    // it('<a>123</a>', function() {
    //     let tree = parseHTML('<a></a>')
    //     console.info('tree:', tree)
    //     assert.equal(tree.children[0].tagName, 'a')
    //     assert.equal(tree.children[0].children.length, 0)
    //     assert.equal(tree.children[0].type, 'element')
    // })

    it('htmlText', function() {
        let tree2 = parseHTML(htmlText)
        console.info('tree2:', tree2)
        assert.equal(tree2.children[0].tagName, 'html')
        assert.equal(tree2.children[0].type, 'element')
    })
})
