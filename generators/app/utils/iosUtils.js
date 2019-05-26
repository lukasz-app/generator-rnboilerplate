const replace = require("replace-in-file");
const defIOSBuindleIdentifier = "org.reactjs.native.example";

module.exports = class IOSUtils {
  constructor(spawnCommandSync) {
    this.spawnCommandSync = spawnCommandSync;
  }

  changeBundleIdIos(appName, bundleId) {
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
  }
};
