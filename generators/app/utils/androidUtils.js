const replace = require("replace-in-file");
const defAndroidPackageName = "com";

module.exports = class AndroidUtils {
  constructor(spawnCommandSync) {
    this.spawnCommandSync = spawnCommandSync;
  }

  changePackageName(appName, bundleId) {
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
    this.spawnCommandSync("rm", [
      "-rf",
      `android/app/src/main/java/${defAndroidPackageName}/${appName}`
    ]);
    if (!newDirectoryStructureString.startsWith(`${defAndroidPackageName}/`)) {
      this.spawnCommandSync("rm", [
        "-rf",
        `android/app/src/main/java/${defAndroidPackageName}`
      ]);
    }
  }
};
