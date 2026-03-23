const calculator = require("./calculator");
const inputHandler = require("./inputHandler");

// If run directly from command line
if (require.main === module) {
  const args = process.argv.slice(2);
  inputHandler.handleCLIArgs(args);
}

module.exports = calculator;
