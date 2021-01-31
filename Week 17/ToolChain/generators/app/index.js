var Generator = require('yeoman-generator')

module.exports = class extends Generator {
    // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts)

    // Next, add your custom code
    this.option('babel') // This method adds support for a `--babel` flag
  }
  method1() {
    this.log('method 1 just ran')
  }

  method2() {
    this.log('method 2 just ran')
  }

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

  async prompting() {
    this.answers = await this.prompt([
      {
        type    : 'input',
        name    : 'title',
        message : 'Your project title',
        default : 'Templating with Yeoman what fuck toolchain'
      },
      {
        type    : 'confirm',
        name    : 'spa',
        message : 'Your project is spa',
      },
      {
        type    : 'input',
        name    : 'content',
        message : 'Your project content',
      }
    ]);
  }

  async step1() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      {
        title: this.answers.title,
        isSpa: this.answers.spa,
        content: this.answers.content
      }
    )
  }
}
