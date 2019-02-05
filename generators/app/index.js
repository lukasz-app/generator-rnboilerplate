var Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const _ = require("lodash");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
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
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.appName;
      this.props = props;
    });
  }

  writing() {
    this.log("app name : ", this.props.appName);
    const readmeTpl = _.template(
      this.fs.read(this.templatePath("dummyfile.txt"))
    );

    this.fs.write(
      this.destinationPath("dummyfile.txt"),
      readmeTpl({ appName: this.props.appName })
    );
  }
};
