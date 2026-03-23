const readline = require("readline");
const calculator = require("./calculator");

/**
 * Parse and validate calculator input
 * @param {string} input - Input string in format: "operation num1 num2"
 * @returns {object} Result with success flag and message or result
 */
const parseInput = (input) => {
  const parts = input.trim().split(/\s+/);

  if (parts.length === 0 || parts[0].toLowerCase() === "exit") {
    return { success: false, exit: true, message: "Exiting calculator..." };
  }

  if (parts[0].toLowerCase() === "help") {
    return { success: true, help: true };
  }

  const operation = parts[0].toLowerCase();
  const num1 = parseFloat(parts[1]);
  const num2 = parseFloat(parts[2]);

  // Single operand operations
  if (["square", "sqrt", "squareroot"].includes(operation)) {
    if (parts.length !== 2) {
      return {
        success: false,
        message: `Operation '${operation}' requires exactly 1 number`,
      };
    }
    if (isNaN(num1)) {
      return { success: false, message: "Invalid number provided" };
    }

    try {
      let result;
      if (operation === "square") {
        result = calculator.square(num1);
      } else if (["sqrt", "squareroot"].includes(operation)) {
        result = calculator.squareRoot(num1);
      }
      return {
        success: true,
        result,
        operation: operation === "sqrt" ? "squareroot" : operation,
        operands: [num1],
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Two operand operations
  const binaryOps = [
    "add",
    "+",
    "subtract",
    "-",
    "multiply",
    "*",
    "divide",
    "/",
    "power",
    "^",
  ];
  if (!binaryOps.includes(operation)) {
    return { success: false, message: `Unknown operation: '${operation}'` };
  }

  if (parts.length !== 3) {
    return {
      success: false,
      message: `Operation '${operation}' requires exactly 2 numbers`,
    };
  }

  if (isNaN(num1) || isNaN(num2)) {
    return { success: false, message: "Invalid numbers provided" };
  }

  try {
    let result;
    let op = operation;

    switch (operation) {
      case "+":
      case "add":
        result = calculator.add(num1, num2);
        op = "add";
        break;
      case "-":
      case "subtract":
        result = calculator.subtract(num1, num2);
        op = "subtract";
        break;
      case "*":
      case "multiply":
        result = calculator.multiply(num1, num2);
        op = "multiply";
        break;
      case "/":
      case "divide":
        result = calculator.divide(num1, num2);
        op = "divide";
        break;
      case "^":
      case "power":
        result = calculator.power(num1, num2);
        op = "power";
        break;
      default:
        return { success: false, message: `Unknown operation: '${operation}'` };
    }

    return { success: true, result, operation: op, operands: [num1, num2] };
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
║           Welcome to Calculator v1.0                    ║
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
