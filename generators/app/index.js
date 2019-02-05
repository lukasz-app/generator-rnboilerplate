var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option("name"); // This method adds support for a `--name` flag
  }

  method1() {
    this.log("method 1 just ran");
  }

  method2() {
    this.log("method 2 just ran");
  }
};
