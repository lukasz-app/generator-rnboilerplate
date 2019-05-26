var Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const Git = require("./utils/git");
const AndroidUtils = require("./utils/androidUtils");
const IOSUtils = require("./utils/iosUtils");

module.exports = class extends Generator {
  welcome() {
    this.log(
      yosay(
        `Welcome to the sensational ${chalk.red(
          "generator-rnboilerplate"
        )} generator!`
      )
    );
  }

  prompting() {
    const prompts = [
      {
        type: "input",
        name: "appName",
        message: "Application name",
        default: "mobileApplication",
        filter: name => name.toLowerCase(),
        transformer: name => name.toLowerCase()
      },
      {
        type: "input",
        name: "author",
        message: "Author",
        default: "Lukasz Mistrz"
      },
      {
        type: "input",
        name: "bundleId",
        message: "Bundle id",
        default: ({ appName }) => `org.lukaszchopin.${appName}`,
        filter: name => name.toLowerCase(),
        transformer: name => name.toLowerCase()
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  initHelpers() {
    this.git = new Git(this.spawnCommandSync);
    this.androidUtils = new AndroidUtils(this.spawnCommandSync);
    this.iosUtils = new IOSUtils(this.spawnCommandSync);
  }

  initRN() {
    this.spawnCommandSync("react-native", [
      "init",
      this.props.appName,
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

  changeBundleIdIos() {
    this.iosUtils.changeBundleIdIos(this.props.appName, this.props.bundleId);
    this.git.commit("Changed iOS bundleId");
  }

  changePackageNameAndroid() {
    this.androidUtils.changePackageName(
      this.props.appName,
      this.props.bundleId
    );
    this.git.commit("Changed android package name");
  }

  writeReadme() {
    this.fs.copyTpl(
      this.templatePath("README.md"),
      this.destinationPath("README.md"),
      { appName: this.props.appName, author: this.props.author }
    );
  }

  end() {
    this.git.commit("last commit");
    this.spawnCommandSync("code", ["."]);
    this.log("Happend!!!");
  }
};
