module.exports = class Git {
  constructor(spawnCommandSync) {
    this.spawnCommandSync = spawnCommandSync;
  }

  init() {
    this.spawnCommandSync("git", ["init"]);
  }

  commit(message) {
    this.spawnCommandSync("git", ["add", "."]);
    this.spawnCommandSync("git", ["commit", "-m", message]);
  }
};
