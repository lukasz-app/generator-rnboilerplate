var Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const Git = require("./utils/git");
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
        message: "Application name",
        default: "mobileApplication"
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

  initHelpers() {
    this.git = new Git(this.spawnCommandSync);
  }

  initRN() {
    this.spawnCommandSync("react-native", [
      "init",
      this.props.appName,
      // "-package",
      // "your.bundle.identifier",
      "--template",
      "https://github.com/lukaszchopin/react-native-template-typescript"
    ]);
  }

  changeDirectory() {
    this.destinationRoot(`${this.destinationRoot()}/${this.props.appName}`);
  }

  createRepository() {
    this.git.init();
    this.git.commit("Init commit");
  }

  writeReadme() {
    this.fs.copyTpl(
      this.templatePath("README.md"),
      this.destinationPath("README.md"),
      { appName: this.props.appName, author: this.props.author }
    );
  }

  finishing() {
    this.spawnCommandSync("code", ["."]);
    this.log("Happend!!!");
  }
};
