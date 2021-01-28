# 工具鏈

### 脚手架

脚手架和工具链不是一回事，一般来说 generator 是指的脚手架

### Yeoman

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
