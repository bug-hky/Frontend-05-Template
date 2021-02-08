var Generator = require('yeoman-generator')

module.exports = class extends Generator {
    // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts)

    // Next, add your custom code
    this.option('babel') // This method adds support for a `--babel` flag
  }

  async initPackages () {
    let answers = await this.prompt([
      {
        type    : 'input',
        name    : 'name',
        message : 'Your project title',
        default : this.appname
      }
    ]);
    const pkgJson = {
      "name": answers.name,
      "version": "1.0.0",
      "description": "",
      "main": "generator/app/index.js",
      "scripts": {
        "build": "webpack",
        "test": "mocha --require @babel/register",
        "coverage": "nyc mocha --require @babel/register"
      },
      "author": "",
      "license": "ISC",
      "devDependencies": {
      },
      "dependencies": {
      }
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    this.npmInstall([
      "vue",
      "@vue/compiler-sfc"
    ], {'save-dev': false});
    this.npmInstall([
      "webpack",
      "webpack-cli",
      "vue-loader@15",
      "vue-style-loader",
      "css-loader",
      "vue-template-compiler",
      "copy-webpack-plugin",
      "mocha",
      "nyc",
      "babel-loader",
      "@babel/core",
      "@babel/preset-env",
      "@babel/register"
    ], {'save-dev': true});

    this.fs.copyTpl(
      this.templatePath('test.js'),
      this.destinationPath('test/test.js')
    )

    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc')
    )

    this.fs.copyTpl(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore')
    )
    
    this.fs.copyTpl(
      this.templatePath('index.vue'),
      this.destinationPath('src/main.vue')
    )

    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js')
    )

    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js')
    )

    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      {
        title: answers.name
      }
    )
  }

  // async prompting() {
  //   this.answers = await this.prompt([
  //     {
  //       type    : 'input',
  //       name    : 'title',
  //       message : 'Your project title',
  //       default : 'Templating with Yeoman what fuck toolchain'
  //     },
  //     {
  //       type    : 'confirm',
  //       name    : 'spa',
  //       message : 'Your project is spa',
  //     },
  //     {
  //       type    : 'input',
  //       name    : 'content',
  //       message : 'Your project content',
  //     }
  //   ]);
  // }

  // async step1() {
  //   this.fs.copyTpl(
  //     this.templatePath('index.html'),
  //     this.destinationPath('public/index.html'),
  //     {
  //       title: this.answers.title,
  //       isSpa: this.answers.spa,
  //       content: this.answers.content
  //     }
  //   )
  // }
}
