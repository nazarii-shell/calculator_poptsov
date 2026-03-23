const readline = require("readline");
const calculator = require("./calculator");
const validator = require("./validator");

/**
 * Parse and validate calculator input
 * @param {string} input - Input string in format: "operation num1 num2"
 * @returns {object} Result with success flag and message or result
 */
const parseInput = (input) => {
  // Validate input format
  const formatValidation = validator.validateInputFormat(input);
  if (!formatValidation.valid) {
    return { success: false, message: formatValidation.error };
  }

  const parts = input.trim().split(/\s+/);

  if (parts.length === 0 || parts[0].toLowerCase() === "exit") {
    return { success: false, exit: true, message: "Exiting calculator..." };
  }

  if (parts[0].toLowerCase() === "help") {
    return { success: true, help: true };
  }

  const operation = parts[0].toLowerCase();

  // Validate operation exists
  const opValidation = validator.validateOperation(operation);
  if (!opValidation.valid) {
    return { success: false, message: opValidation.error };
  }

  // Parse operands
  const operands = parts.slice(1).map((p) => parseFloat(p));

  // Validate operand count
  const countValidation = validator.validateOperandCount(
    operation,
    operands.length,
  );
  if (!countValidation.valid) {
    return { success: false, message: countValidation.error };
  }

  // Validate operands
  const operandValidation = validator.validateOperands(operation, operands);
  if (!operandValidation.valid) {
    return { success: false, message: operandValidation.error };
  }

  try {
    let result;
    let op = operation;

    switch (operation) {
      case "+":
      case "add":
        result = calculator.add(operands[0], operands[1]);
        op = "add";
        break;
      case "-":
      case "subtract":
        result = calculator.subtract(operands[0], operands[1]);
        op = "subtract";
        break;
      case "*":
      case "multiply":
        result = calculator.multiply(operands[0], operands[1]);
        op = "multiply";
        break;
      case "/":
      case "divide":
        result = calculator.divide(operands[0], operands[1]);
        op = "divide";
        break;
      case "^":
      case "power":
        result = calculator.power(operands[0], operands[1]);
        op = "power";
        break;
      case "square":
        result = calculator.square(operands[0]);
        op = "square";
        break;
      case "sqrt":
      case "squareroot":
        result = calculator.squareRoot(operands[0]);
        op = "squareroot";
        break;
      default:
        return { success: false, message: `Unknown operation: '${operation}'` };
    }

    // Validate result
    const resultValidation = validator.validateResult(result);
    if (!resultValidation.valid) {
      return { success: false, message: resultValidation.error };
    }

    return { success: true, result, operation: op, operands };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Display help message
 */
const showHelp = () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║               CALCULATOR OPERATIONS                     ║
╚════════════════════════════════════════════════════════╝

BINARY OPERATIONS (2 numbers):
  add, +              : num1 + num2
  subtract, -         : num1 - num2
  multiply, *         : num1 × num2
  divide, /           : num1 ÷ num2
  power, ^            : num1 ^ num2

UNARY OPERATIONS (1 number):
  square              : num ^ 2
  sqrt, squareroot    : √num

EXAMPLES:
  add 5 3             → 8
  divide 20 4         → 5
  + 10 7              → 17
  square 5            → 25
  sqrt 16             → 4

COMMANDS:
  help                : Show this help message
  exit                : Exit the calculator

  `);
};

/**
 * Start interactive calculator mode
 */
const startInteractive = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(`
╔════════════════════════════════════════════════════════╗
║           Welcome to Calculator v1.0                   ║
║     Type 'help' for commands or 'exit' to quit         ║
╚════════════════════════════════════════════════════════╝
  `);

  const prompt = () => {
    rl.question("> ", (input) => {
      const result = parseInput(input);

      if (result.exit) {
        console.log(result.message);
        rl.close();
        return;
      }

      if (result.help) {
        showHelp();
        prompt();
        return;
      }

      if (result.success) {
        const operands = result.operands.join(" ");
        console.log(`Result: ${result.result}`);
      } else {
        console.error(`Error: ${result.message}`);
      }

      prompt();
    });
  };

  prompt();
};

/**
 * Handle command-line arguments
 * @param {string[]} args - Command-line arguments
 */
const handleCLIArgs = (args) => {
  if (args.length === 0) {
    startInteractive();
    return;
  }

  const input = args.join(" ");
  const result = parseInput(input);

  if (result.help) {
    showHelp();
    return;
  }

  if (result.exit) {
    console.log(result.message);
    return;
  }

  if (result.success) {
    console.log(`Result: ${result.result}`);
  } else {
    console.error(`Error: ${result.message}`);
    process.exit(1);
  }
};

module.exports = {
  parseInput,
  showHelp,
  startInteractive,
  handleCLIArgs,
};
