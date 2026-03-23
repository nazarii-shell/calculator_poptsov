const readline = require("readline");
const validator = require("./validator");
const registry = require("./operationRegistry");

/**
 * Normalize operation name to primary operation name
 * @param {string} operationName - Operation name or alias
 * @returns {string|null} Primary operation name or null
 */
const normalizeOperationName = (operationName) => {
  const operation = registry.getOperation(operationName);
  return operation ? operation.name : null;
};

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

  const operationInput = parts[0].toLowerCase();

  // Validate operation exists
  const opValidation = validator.validateOperation(operationInput);
  if (!opValidation.valid) {
    return { success: false, message: opValidation.error };
  }

  // Parse operands
  const operands = parts.slice(1).map((p) => parseFloat(p));

  // Validate operand count
  const countValidation = validator.validateOperandCount(
    operationInput,
    operands.length,
  );
  if (!countValidation.valid) {
    return { success: false, message: countValidation.error };
  }

  // Validate operands
  const operandValidation = validator.validateOperands(
    operationInput,
    operands,
  );
  if (!operandValidation.valid) {
    return { success: false, message: operandValidation.error };
  }

  try {
    // Execute operation using registry
    const result = registry.execute(operationInput, ...operands);

    // Validate result
    const resultValidation = validator.validateResult(result);
    if (!resultValidation.valid) {
      return { success: false, message: resultValidation.error };
    }

    // Get primary operation name for consistent output
    const operationName = normalizeOperationName(operationInput);

    return { success: true, result, operation: operationName, operands };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Display help message with dynamically generated operation list
 */
const showHelp = () => {
  const ops = registry.getAllOperations();

  // Separate unary and binary operations
  const unaryOps = Object.values(ops).filter((op) => op.arity === 1);
  const binaryOps = Object.values(ops).filter((op) => op.arity === 2);

  // Format operation display with aliases
  const formatOp = (op) => {
    const aliases = op.aliases.length > 0 ? `, ${op.aliases.join(", ")}` : "";
    return `  ${op.name}${aliases}`.padEnd(20) + `: ${op.description}`;
  };

  console.log(`
╔════════════════════════════════════════════════════════╗
║               CALCULATOR OPERATIONS                     ║
╚════════════════════════════════════════════════════════╝

BINARY OPERATIONS (2 numbers):`);

  binaryOps.forEach((op) => console.log(formatOp(op)));

  console.log(`
UNARY OPERATIONS (1 number):`);

  unaryOps.forEach((op) => console.log(formatOp(op)));

  console.log(`
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
  normalizeOperationName,
};
