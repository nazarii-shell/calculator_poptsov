/**
 * Operations Registry Module
 *
 * Provides centralized management and execution of all calculator operations.
 * Uses the Registry pattern to maintain a single source of truth for operation
 * definitions, validation rules, and execution logic.
 *
 * Key Features:
 * - Single definition point for all operations
 * - Automatic alias support (e.g., '+' for 'add')
 * - Consistent validation across all operations
 * - Extensible design for adding new operations
 * - Metadata support (name, description, arity)
 *
 * Architecture:
 * - Operations are defined as objects with metadata and execute function
 * - operationMap provides O(1) lookup by name or alias
 * - All validation happens within each operation's execute function
 * - Arity (argument count) is declared and enforced
 *
 * Adding New Operations:
 * 1. Add entry to the 'operations' object
 * 2. Define: name, aliases[], arity, description, execute function
 * 3. No changes needed to other files - registry auto-discovers it
 *
 * @module operationRegistry
 * @requires ./validator
 *
 * @example
 * const registry = require('./operationRegistry');
 *
 * // Execute an operation
 * const result = registry.execute('add', 5, 3);  // 8
 *
 * // Get operation info
 * const op = registry.getOperation('+');
 * console.log(op.description);  // "Addition"
 *
 * // List all operations
 * const names = registry.getOperationNames();
 */

/**
 * Validate argument count and types for an operation
 *
 * Ensures that:
 * - The correct number of arguments are provided
 * - All arguments are valid, finite numbers
 *
 * This is called by each operation's execute function to guarantee
 * consistent validation across all operations.
 *
 * @param {number[]} args - Arguments to validate
 * @param {number} expectedCount - Expected number of arguments
 * @throws {Error} If argument count is wrong
 * @throws {Error} If any argument is not a valid finite number
 *
 * @private
 * @example
 * validateArgs([5, 3], 2);           // OK
 * validateArgs([5], 2);              // Throws: Expected 2 argument(s), got 1
 * validateArgs(['5', 3], 2);         // Throws: Argument 1 must be a valid number
 * validateArgs([Infinity, 3], 2);    // Throws: not finite
 */
const validateArgs = (args, expectedCount) => {
  if (args.length !== expectedCount) {
    throw new Error(
      `Expected ${expectedCount} argument(s), got ${args.length}`,
    );
  }
  args.forEach((arg, index) => {
    if (typeof arg !== 'number' || !isFinite(arg)) {
      throw new Error(`Argument ${index + 1} must be a valid number`);
    }
  });
};

/**
 * Operation Definitions
 *
 * Central registry of all available operations. Each operation object contains:
 * - name: Primary identifier (must be unique)
 * - aliases: Alternative names (e.g., '+' for 'add')
 * - arity: Number of operands (1 for unary, 2 for binary)
 * - description: Human-readable description for help
 * - execute: Function that performs the operation
 *
 * Binary operations: require exactly 2 arguments
 * Unary operations: require exactly 1 argument
 *
 * @type {Object}
 * @property {Object} add - Addition operation (a + b)
 * @property {Object} subtract - Subtraction operation (a - b)
 * @property {Object} multiply - Multiplication operation (a * b)
 * @property {Object} divide - Division operation (a / b), throws on b=0
 * @property {Object} power - Exponentiation operation (a ^ b)
 * @property {Object} square - Square operation (a * a)
 * @property {Object} squareRoot - Square root operation (sqrt(a))
 */
const operations = {
  // Binary operations
  add: {
    name: 'add',
    aliases: ['+'],
    arity: 2,
    description: 'Addition',
    execute: (a, b) => {
      validateArgs([a, b], 2);
      return a + b;
    },
  },
  subtract: {
    name: 'subtract',
    aliases: ['-'],
    arity: 2,
    description: 'Subtraction',
    execute: (a, b) => {
      validateArgs([a, b], 2);
      return a - b;
    },
  },
  multiply: {
    name: 'multiply',
    aliases: ['*'],
    arity: 2,
    description: 'Multiplication',
    execute: (a, b) => {
      validateArgs([a, b], 2);
      return a * b;
    },
  },
  divide: {
    name: 'divide',
    aliases: ['/'],
    arity: 2,
    description: 'Division',
    execute: (a, b) => {
      validateArgs([a, b], 2);
      if (b === 0) {
        throw new Error('Division by zero is not allowed');
      }
      return a / b;
    },
  },
  power: {
    name: 'power',
    aliases: ['^'],
    arity: 2,
    description: 'Exponentiation',
    execute: (a, b) => {
      validateArgs([a, b], 2);
      return Math.pow(a, b);
    },
  },

  // Unary operations
  square: {
    name: 'square',
    aliases: [],
    arity: 1,
    description: 'Square a number',
    execute: (a) => {
      validateArgs([a], 1);
      return a * a;
    },
  },
  squareRoot: {
    name: 'squareRoot',
    aliases: ['sqrt', 'squareroot'],
    arity: 1,
    description: 'Square root',
    execute: (a) => {
      validateArgs([a], 1);
      if (a < 0) {
        throw new Error('Square root of negative numbers is not allowed');
      }
      return Math.sqrt(a);
    },
  },
};

/**
 * Create a lookup map for fast operation discovery
 *
 * Builds a map from operation names and aliases to operation objects.
 * Enables O(1) lookup regardless of whether user provides a primary name
 * or an alias.
 *
 * Example map structure after building:
 * {
 *   'add': { name: 'add', ... },
 *   '+': { name: 'add', ... },
 *   'subtract': { name: 'subtract', ... },
 *   '-': { name: 'subtract', ... },
 *   ...
 * }
 *
 * @returns {Object} Map from operation identifier (name/alias) to operation
 * @private
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

/**
 * Operation lookup map (name/alias -> operation)
 * Populated once at module load time for fast access
 * @private
 * @type {Object}
 */
const operationMap = createOperationMap();

/**
 * Get operation by name or alias
 *
 * Lookup is case-insensitive to improve usability.
 * Returns null if operation not found (allows graceful handling).
 *
 * @param {string} name - Operation name or alias to look up
 * @returns {Object|null} Operation object if found, null otherwise
 *
 * @example
 * getOperation('add')      // Returns add operation
 * getOperation('+')        // Returns add operation (same object)
 * getOperation('ADD')      // Returns add operation (case-insensitive)
 * getOperation('unknown')  // Returns null
 */
const getOperation = (name) => {
  const normalizedName = String(name).toLowerCase();
  return operationMap[normalizedName] || null;
};

/**
 * Get all available operations
 *
 * Returns the complete operations registry for introspection.
 * Useful for:
 * - Generating help documentation
 * - Validating operation names
 * - Building operation lists
 *
 * @returns {Object} All operations indexed by primary name
 *
 * @example
 * const ops = getAllOperations();
 * Object.values(ops).forEach(op => console.log(op.description));
 */
const getAllOperations = () => {
  return operations;
};

/**
 * Get list of all operation names and aliases
 *
 * Returns all identifiers that can be used to invoke operations.
 * Useful for:
 * - Auto-completion
 * - Validation
 * - Help documentation
 *
 * @returns {string[]} Array of all operation names and aliases
 *
 * @example
 * getOperationNames()  // ['add', '+', 'subtract', '-', ..., 'sqrt', 'squareroot']
 */
const getOperationNames = () => {
  return Object.keys(operationMap);
};

/**
 * Execute an operation
 *
 * This is the main entry point for executing operations. It:
 * 1. Looks up the operation by name/alias (case-insensitive)
 * 2. Validates the argument count matches the operation's arity
 * 3. Calls the operation's execute function
 * 4. Returns the result or throws an error
 *
 * All validation errors provide descriptive messages including:
 * - Operation name (primary name, not alias)
 * - Expected vs actual argument count
 * - Validation errors from the operation
 *
 * @param {string} operationName - Primary name or alias of operation
 * @param {...number} args - Arguments to pass to the operation
 * @returns {number} Result of the operation
 * @throws {Error} If operation not found
 * @throws {Error} If argument count doesn't match arity
 * @throws {Error} If operation validation fails
 *
 * @example
 * execute('add', 5, 3)         // 8
 * execute('+', 10, 5)          // 15
 * execute('square', 4)         // 16
 * execute('sqrt', 25)          // 5
 * execute('unknown', 5, 3)     // Throws: Unknown operation
 * execute('add', 5)            // Throws: requires 2 argument(s)
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

/**
 * Public API
 *
 * @type {Object}
 * @property {Object} operations - Operation definitions (for introspection)
 * @property {Object} operationMap - Name/alias to operation lookup map
 * @property {Function} getOperation - Get operation by name or alias
 * @property {Function} getAllOperations - Get all operations
 * @property {Function} getOperationNames - Get all operation names/aliases
 * @property {Function} execute - Execute an operation
 * @property {Function} validateArgs - Validate operation arguments (internal)
 */
module.exports = {
  operations,
  operationMap,
  getOperation,
  getAllOperations,
  getOperationNames,
  execute,
  validateArgs,
};
