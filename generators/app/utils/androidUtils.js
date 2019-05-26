const replace = require("replace-in-file");
const defAndroidPackageName = "com";

module.exports = class AndroidUtils {
  constructor(spawnCommandSync, appName, bundleId) {
    this.spawnCommandSync = spawnCommandSync;
    this.appName = appName;
    this.bundleId = bundleId;
    this.newBundleId = bundleId.endsWith("." + appName)
      ? bundleId
      : bundleId + "." + appName;
  }

  changePackageName() {
    this.replaceInFiles();
    this.moveJavaFiles();
    this.removeFolders();
  }

  replaceInFiles() {
    const androidDefIDRegEx = new RegExp(
      defAndroidPackageName + "." + this.appName,
      "g"
    );
    const options = {
      files: [
        `android/app/build.gradle`,
        `android/app/BUCK`,
        `android/app/src/main/AndroidManifest.xml`,
        `android/app/src/main/java/${defAndroidPackageName}/${
          this.appName
        }/MainActivity.java`,
        `android/app/src/main/java/${defAndroidPackageName}/${
          this.appName
        }/MainApplication.java`
      ],
      from: androidDefIDRegEx,
      to: this.newBundleId
    };
    try {
      const changes = replace.sync(options);
      console.log("Modified files:", changes.join(", "));
    } catch (error) {
      console.error("Error occurred:", error);
    }
  }

  moveJavaFiles() {
    const newDirectoryStructure = this.newBundleId.split(".");
    const newDirectoryStructureString = this.newBundleId.split(".").join("/");
    for (let i = 0; i < newDirectoryStructure.length; i++) {
      let path = `android/app/src/main/java`;
      for (let j = 0; j <= i; j++) {
        path = path + "/" + newDirectoryStructure[j];
      }
      this.spawnCommandSync("mkdir", [path]);
    }
    this.spawnCommandSync("mv", [
      `android/app/src/main/java/${defAndroidPackageName}/${
        this.appName
      }/MainActivity.java`,
      `android/app/src/main/java/${newDirectoryStructureString}/MainActivity.java`
    ]);
    this.spawnCommandSync("mv", [
      `android/app/src/main/java/${defAndroidPackageName}/${
        this.appName
      }/MainApplication.java`,
      `android/app/src/main/java/${newDirectoryStructureString}/MainApplication.java`
    ]);
  }

  removeFolders() {
    const newDirectoryStructure = `android/app/src/main/java/${this.newBundleId
      .split(".")
      .join("/")}`.split("/");
    const oldDirectoryStrucure = `android/app/src/main/java/${defAndroidPackageName}/${
      this.appName
    }`.split("/");
    let i = 0;
    while (newDirectoryStructure[i] === oldDirectoryStrucure[i]) {
      i++;
    }
    if (oldDirectoryStrucure.length === i) {
      console.log("REDUNDANT : NONE");
      return;
    }
    const redundantDir = oldDirectoryStrucure.slice(0, i + 1).join("/");
    console.log("REDUNDANT : ", redundantDir);
    this.spawnCommandSync("rm", ["-rf", redundantDir]);
  }
};
