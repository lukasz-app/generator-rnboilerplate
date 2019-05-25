var Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const Git = require("./utils/git");
const replace = require("replace-in-file");

const defIOSBuindleIdentifier = "org.reactjs.native.example";
const defAndroidPackageName = "com";

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

  changeBundleIdIos() {
    const { appName, bundleId } = this.props;
    const newBundleId = bundleId.endsWith("." + appName)
      ? bundleId.replace(new RegExp("." + appName + "$"), "")
      : bundleId;
    const iosDefIDRegEx = new RegExp(defIOSBuindleIdentifier, "g");
    const options = {
      files: [
        `ios/${appName}.xcodeproj/project.pbxproj`,
        `ios/${appName}-tvOS/Info.plist`,
        `ios/${appName}-tvOSTests/Info.plist`
      ],
      from: iosDefIDRegEx,
      to: newBundleId
    };
    try {
      const changes = replace.sync(options);
      console.log("Modified files:", changes.join(", "));
    } catch (error) {
      console.error("Error occurred:", error);
    }
    this.git.commit("Changed iOS bundleId");
  }

  changePackageName() {
    const { appName, bundleId } = this.props;
    const newBundleId = bundleId.endsWith("." + appName)
      ? bundleId
      : bundleId + "." + appName;
    const androidDefIDRegEx = new RegExp(
      defAndroidPackageName + "." + appName,
      "g"
    );
    const options = {
      files: [
        `android/app/build.gradle`,
        `android/app/BUCK`,
        `android/app/src/main/AndroidManifest.xml`,
        `android/app/src/main/java/${defAndroidPackageName}/${appName}/MainActivity.java`,
        `android/app/src/main/java/${defAndroidPackageName}/${appName}/MainApplication.java`
      ],
      from: androidDefIDRegEx,
      to: newBundleId
    };
    try {
      const changes = replace.sync(options);
      console.log("Modified files:", changes.join(", "));
    } catch (error) {
      console.error("Error occurred:", error);
    }
    const newDirectoryStructure = newBundleId.split(".");
    const newDirectoryStructureString = newBundleId.split(".").join("/");
    for (let i = 0; i < newDirectoryStructure.length; i++) {
      let path = `android/app/src/main/java`;
      for (let j = 0; j <= i; j++) {
        path = path + "/" + newDirectoryStructure[j];
      }
      this.spawnCommandSync("mkdir", [path]);
    }
    this.spawnCommandSync("mv", [
      `android/app/src/main/java/${defAndroidPackageName}/${appName}/MainActivity.java`,
      `android/app/src/main/java/${newDirectoryStructureString}/MainActivity.java`
    ]);
    this.spawnCommandSync("mv", [
      `android/app/src/main/java/${defAndroidPackageName}/${appName}/MainApplication.java`,
      `android/app/src/main/java/${newDirectoryStructureString}/MainApplication.java`
    ]);
    this.spawnCommandSync("rm -rf", [
      `android/app/src/main/java/${defAndroidPackageName}/${appName}`
    ]);
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
