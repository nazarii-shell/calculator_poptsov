/**
 * Operations registry - centralized management of calculator operations
 */

const validator = require("./validator");

/**
 * Ensure arguments are numbers
 * @param {number[]} args - Arguments to validate
 * @param {number} expectedCount - Expected number of arguments
 * @throws {Error} If arguments are not numbers or count is wrong
 */
const validateArgs = (args, expectedCount) => {
  if (args.length !== expectedCount) {
    throw new Error(
      `Expected ${expectedCount} argument(s), got ${args.length}`,
    );
  }
  args.forEach((arg, index) => {
    if (typeof arg !== "number" || !isFinite(arg)) {
      throw new Error(`Argument ${index + 1} must be a valid number`);
    }
  });
};

/**
 * Operation definitions
 */
const operations = {
  // Binary operations
  add: {
    name: "add",
    aliases: ["+"],
    arity: 2,
    description: "Addition",
    execute: (a, b) => {
      validateArgs([a, b], 2);
      return a + b;
    },
  },
  subtract: {
    name: "subtract",
    aliases: ["-"],
    arity: 2,
    description: "Subtraction",
    execute: (a, b) => {
      validateArgs([a, b], 2);
      return a - b;
    },
  },
  multiply: {
    name: "multiply",
    aliases: ["*"],
    arity: 2,
    description: "Multiplication",
    execute: (a, b) => {
      validateArgs([a, b], 2);
      return a * b;
    },
  },
  divide: {
    name: "divide",
    aliases: ["/"],
    arity: 2,
    description: "Division",
    execute: (a, b) => {
      validateArgs([a, b], 2);
      if (b === 0) {
        throw new Error("Division by zero is not allowed");
      }
      return a / b;
    },
  },
  power: {
    name: "power",
    aliases: ["^"],
    arity: 2,
    description: "Exponentiation",
    execute: (a, b) => {
      validateArgs([a, b], 2);
      return Math.pow(a, b);
    },
  },

  // Unary operations
  square: {
    name: "square",
    aliases: [],
    arity: 1,
    description: "Square a number",
    execute: (a) => {
      validateArgs([a], 1);
      return a * a;
    },
  },
  squareRoot: {
    name: "squareRoot",
    aliases: ["sqrt", "squareroot"],
    arity: 1,
    description: "Square root",
    execute: (a) => {
      validateArgs([a], 1);
      if (a < 0) {
        throw new Error("Square root of negative numbers is not allowed");
      }
      return Math.sqrt(a);
    },
  },
};

/**
 * Create a lookup map for operations (name -> operation)
 */
const createOperationMap = () => {
  const map = {};

  Object.values(operations).forEach((op) => {
    // Add by primary name
    map[op.name] = op;

    // Add all aliases
    op.aliases.forEach((alias) => {
      map[alias] = op;
    });
  });

  return map;
};

const operationMap = createOperationMap();

/**
 * Get operation by name or alias
 * @param {string} name - Operation name or alias
 * @returns {object|null} Operation object or null if not found
 */
const getOperation = (name) => {
  const normalizedName = String(name).toLowerCase();
  return operationMap[normalizedName] || null;
};

/**
 * Get all available operations
 * @returns {object} All operations indexed by name
 */
const getAllOperations = () => {
  return operations;
};

/**
 * Get list of operation names and aliases
 * @returns {string[]} All operation names and aliases
 */
const getOperationNames = () => {
  return Object.keys(operationMap);
};

/**
 * Execute an operation
 * @param {string} operationName - Name or alias of operation
 * @param {number[]} args - Arguments for the operation
 * @returns {number} Result of operation
 * @throws {Error} If operation not found or execution fails
 */
const execute = (operationName, ...args) => {
  const operation = getOperation(operationName);

  if (!operation) {
    throw new Error(`Unknown operation: '${operationName}'`);
  }

  if (args.length !== operation.arity) {
    throw new Error(
      `Operation '${operation.name}' requires ${operation.arity} argument(s), got ${args.length}`,
    );
  }

  return operation.execute(...args);
};

module.exports = {
  operations,
  operationMap,
  getOperation,
  getAllOperations,
  getOperationNames,
  execute,
  validateArgs,
};
