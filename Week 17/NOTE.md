# 工具鏈

## 脚手架

脚手架和工具链不是一回事，一般来说 generator 是指的脚手架

### Yeoman

- 初始化并使用 Yeoman

  Yeoman 是生成脚手架的构建工具

  1. 新建文件夹

  ```cmd
  mkdir ToolChain && cd ToolChain && npm init
  ```

  2. 安装 yeoman, 全局安装 yo

  ```cmd
  npm i -g yo && npm i yeoman-generator
  ```

  3. 配置文件目录

  ```cmd
  mkdir generators && cd generators && mkdir app && cd app && echo > index.js
  ```

  4. 使用 yeoman

  index.js

  ```js
  var Generator = require("yeoman-generator");

  module.exports = class extends (
    Generator
  ) {
    // The name `constructor` is important here
    constructor(args, opts) {
      // Calling the super constructor is important so our generator is correctly set up
      super(args, opts);

      // Next, add your custom code
      this.option("babel"); // This method adds support for a `--babel` flag
    }
    method1() {
      this.log("method 1 just ran");
    }

    method2() {
      this.log("method 2 just ran");
    }
  };
  ```

  package.json

  ```JSON
  {
    "name": "generator-toolchain",
    "version": "1.0.0",
    "description": "",
    "main": "generator/app/index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC",
    "dependencies": {
      "yeoman-generator": "^4.12.0"
    }
  }

  ```

  5. npm link

  在根目录下`npm link`

  6. yo toolchain

  在根目录下`yo toolchain`

- yeoman 文件模板系统

  1. 在`generators/app/`目录下新建`templates/index.html`

  ```html
  <html>
    <head>
      <title><%= title %></title>
    </head>
  </html>
  ```

  2. 使用`copyTpl`动态插入内容生成目标文件

  ```js
  var Generator = require("yeoman-generator");

  module.exports = class extends (
    Generator
  ) {
    // The name `constructor` is important here
    constructor(args, opts) {
      // Calling the super constructor is important so our generator is correctly set up
      super(args, opts);

      // Next, add your custom code
      this.option("babel"); // This method adds support for a `--babel` flag
    }
    method1() {
      this.log("method 1 just ran");
    }

    method2() {
      this.log("method 2 just ran");
    }

    async step1() {
      this.fs.copyTpl(
        this.templatePath("index.html"),
        this.destinationPath("public/index.html"),
        { title: "Templating with Yeoman what fuck XXX" }
      );
    }
  };
  ```

  3. 可以根据 prompting 的来动态生成目标文件的模板

  ejs 模板的 if, else, include 的用法

  ```js
  // include
  <%- include xxx.ejs %>
  <%- include xxx.html %>

  // if ... else ...
  <% if (xxx) { %>
  <%= xxx变量 %>
  <% } else { %>
  <%= xxx变量2 %>
  <% } %>

  ```

  - yeoman 依赖系统

  可以配置`extendJSON`和`destinationPath`还有`npmInstall`组合生成 package.json 并安装相关依赖

  ```js
  var Generator = require('yeoman-generator')

  module.exports = class extends Generator {
      // The name `constructor` is important here
    constructor(args, opts) {
      // Calling the super constructor is important so our generator is correctly set up
      super(args, opts)

      // Next, add your custom code
      this.option('babel') // This method adds support for a `--babel` flag
    }
    ...

    initPackages () {
      const pkgJson = {
        devDependencies: {
          eslint: '^3.15.0'
        },
        dependencies: {
          react: '^16.2.0'
        }
      };

      // Extend or create package.json file in destination path
      this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
      this.npmInstall();
    }
    ...
  }

  ```

- 使用 yeoman 而非 vue-cli 构建可以跑 vue 代码的环境

  > 跟着课程的配置 webpack 打包后会报错
  > `main.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]:7 Uncaught TypeError: (0 , vue__WEBPACK_IMPORTED_MODULE_0__.withScopeId) is not a function`

### Webpack

最初是为 Node 而设计的一个打包工具，能力是把 Node 的代码打包成一个浏览器可用的 js 包
它的核心设计理念就是最后打包出一个 js 文件，在 html 里面来引用 js 文件
安装 webpack 需要 webpack-cli webpack 两个依赖
如果想只在项目内本地安装 webpack 推荐使用 npx webpack

## webpack 的 loader 是灵魂

从本质上来说 loader 只是做了文本转换，最后使用`import`语句或者是`require`函数，把文件加载进来，通过 rules 里面的 test 正则筛选匹配的文件使用对应的 loader， 也有多个 loader 处理同一个文件的情况

loader 是 webpack 的核心机制，plugin 相比于 loader 更像是一个独立的机制

## Babel - 一个独立的转换工具

作用是把新版本的 JS 转换成老版本的 JS 的一个工具

项目目录下放置一个`.babelrc`文件

```
{
  "presets": ["#babel/preset-env"]
}
```

更多的时候我们用的是 babel-loader，在 webpack 打包过程中使用它对每个文件处理成低版本的 JS
一般来说使用 preset 和一些 plugin 来完成工作
