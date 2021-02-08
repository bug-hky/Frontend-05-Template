# 测试工具

- 测试是工具链中的重要一环
- 对于大部分的开源项目，测试是一个必需品
- 商业项目里的组件库复用程度比较高的情况下，测试的收益是比较高的
- 如果不是写的一次性的业务代码，尽量还是使用单元测试

## mocha

### 安装使用 mocha

```bash
mkdir test-demo && cd test-demo && npm init && npm install mocha --save-dev && echo >.gitignore /node_modules/
```

```es6
// add.js
function add(a, b) {
  return a + b;
}

module.exports = add;
```

```bash
mkdir test && cd test && echo >test.js
```

```es6
// test.js

const add = require("../add.js");
var assert = require("assert");

describe("add function testing", function () {
  it("1 + 2 should return 3", function () {
    assert.equal(add(1, 2), 3);
  });

  it("2 + 2 should return 4", function () {
    assert.equal(add(2, 2), 4);
  });

  it("5 + 5 should return 10", function () {
    assert.equal(add(5, 5), 10);
  });
});
```

### 使用@babel/register 配合 mocha 测试

如果在 add.js 中使用 export 会报错，因为 node.js 默认是不支持 export 写法的，解决方法有两个:

1. package.json 的 type 改成 module（会有很多问题）
2. 使用 babel 对代码做转化

如果单元测试要依赖 webpack 打包后的结果那代价太大
babel 提供了一个`@babel/register`工具
安装它:`npm install @babel/core @babel/register --save-dev`
如果安装的是本地的 mocha(没有全局安装)，需要使用`./node_modules/.bin/mocha`来跑测试
接着使用`@babel/register`来动态编译 es6 语法`./node_modules/.bin/mocha --require @babel/register`
输入的命令行太长太麻烦把它集成到 package.json 的 scripts 中
使用本地的依赖指令时，package.json 的 scripts 里面的脚本默认都会加上`./node_modules/.bin/`的前缀

## Code Coverage - 测试覆盖率

一般来说我们关心的指标的四个维度:

- 行覆盖率(line coverage): 是否每一行都执行了？
- 函数覆盖率(function coverage): 是否每个函数都调用了？
- 分支覆盖率(branch coverage): 是否每个 if 代码块都执行了？
- 语句覆盖率(statement coverage): 是否每个语句都执行了？

### 安装使用 nyc (istanbuljs 的命令行工具)

1. 安装

```bash
npm install --save-dev nyc
```

2. 添加脚本 coverage

```JSON
{
  "name": "test-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "mocha --require @babel/register",
    "coverage": "nyc mocha --require @babel/register"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.12.13",
    "@babel/preset-env": "^7.12.13",
    "@babel/register": "^7.12.13",
    "mocha": "^8.2.1",
    "nyc": "^15.1.0"
  }
}

```

3. 用 nyc 测试覆盖率`npm run coverage`

## HTML-PARSER 单测编写

引入`parser.js`和`layout.js`
完善测试用例，尽可能的提示测试覆盖率以及查找相关代码的 BUG

# 把测试相关的依赖补充进工具链中，完善工具链

##
