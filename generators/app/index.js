var Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(
        `Welcome to the sensational ${chalk.red(
          "generator-rnboilerplate"
        )} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "appName",
        message: "app name",
        default: this.appname
      },
      {
        type: "input",
        name: "author",
        message: "Author",
        default: "Lukasz Mistrz"
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
      this.log("app name : ", this.props.appName);
    });
  }

  initRN() {
    this.spawnCommandSync("react-native", [
      "init",
      this.props.appName,
      "--template",
      "typescript"
    ]);
  }

  changeDirectory() {
    this.destinationRoot(`${this.destinationRoot()}/${this.props.appName}`);
  }

  cleanUp() {
    this.spawnCommandSync("node", ["setup.js"]);
  }

  writeReadme() {
    this.fs.copyTpl(
      this.templatePath("README.md"),
      this.destinationPath("README.md"),
      { appName: this.props.appName, author: this.props.author }
    );
  }

  createRepository() {
    this.spawnCommandSync("git", ["init"]);
    this.spawnCommandSync("git", ["add", "."]);
    this.spawnCommandSync("git", ["commit", "-m", "init commit"]);
  }

  finishing() {
    this.log("Happend!!!");
  }
};
