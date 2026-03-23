/**
 * Calculator module with basic arithmetic operations
 *
 * This module provides a clean, simple API for performing mathematical operations.
 * All operations delegate to the operation registry for centralized validation,
 * error handling, and consistent behavior.
 *
 * @module calculator
 * @requires ./operationRegistry
 *
 * Architecture:
 * - Each function is a thin wrapper that delegates to the registry
 * - The registry handles validation, error checking, and execution
 * - All errors thrown by operations include descriptive messages
 *
 * Performance:
 * - Minimal overhead - just delegates to registry.execute()
 * - No repeated validation logic across functions
 *
 * Error Handling:
 * - Non-numeric inputs throw errors with validation details
 * - Division by zero throws descriptive error
 * - Square root of negative numbers throws error
 * - All errors propagate from the registry for consistency
 *
 * @example
 * const calc = require('./calculator');
 * const result = calc.add(5, 3);      // 8
 * const squared = calc.square(4);      // 16
 * const root = calc.squareRoot(25);   // 5
 */

const registry = require("./operationRegistry");

/**
 * Add two numbers together
 *
 * Performs basic addition: a + b
 *
 * @param {number} a - First operand
 * @param {number} b - Second operand
 * @returns {number} The sum of a and b
 * @throws {Error} If either argument is not a valid finite number
 *
 * @example
 * add(5, 3)        // 8
 * add(-5, 2)       // -3
 * add(0.5, 0.5)    // 1
 */
const add = (a, b) => registry.execute("add", a, b);

/**
 * Subtract one number from another
 *
 * Performs basic subtraction: a - b
 *
 * @param {number} a - Minuend (number being subtracted from)
 * @param {number} b - Subtrahend (number being subtracted)
 * @returns {number} The difference of a and b
 * @throws {Error} If either argument is not a valid finite number
 *
 * @example
 * subtract(10, 3)      // 7
 * subtract(5, 10)      // -5
 * subtract(-5, -3)     // -2
 */
const subtract = (a, b) => registry.execute("subtract", a, b);

/**
 * Multiply two numbers
 *
 * Performs basic multiplication: a * b
 *
 * @param {number} a - First factor
 * @param {number} b - Second factor
 * @returns {number} The product of a and b
 * @throws {Error} If either argument is not a valid finite number
 *
 * @example
 * multiply(4, 5)       // 20
 * multiply(-3, 2)      // -6
 * multiply(2.5, 4)     // 10
 */
const multiply = (a, b) => registry.execute("multiply", a, b);

/**
 * Divide one number by another
 *
 * Performs basic division: a / b
 *
 * Note: Division by zero is not allowed and will throw an error
 *
 * @param {number} a - Dividend (numerator)
 * @param {number} b - Divisor (denominator)
 * @returns {number} The quotient of a and b
 * @throws {Error} If either argument is not a valid finite number
 * @throws {Error} If b (divisor) is zero
 *
 * @example
 * divide(20, 4)        // 5
 * divide(10, 3)        // 3.3333...
 * divide(7, 2)         // 3.5
 * divide(10, 0)        // Throws error
 */
const divide = (a, b) => registry.execute("divide", a, b);

/**
 * Raise a number to a power
 *
 * Performs exponentiation: a^b using Math.pow()
 *
 * Supports both positive and negative exponents.
 * Exponents must be between -100 and 100 to prevent overflow/underflow.
 *
 * @param {number} a - Base number
 * @param {number} b - Exponent (power)
 * @returns {number} a raised to the power of b
 * @throws {Error} If either argument is not a valid finite number
 * @throws {Error} If exponent is outside the range [-100, 100]
 *
 * @example
 * power(2, 3)          // 8
 * power(5, 0)          // 1
 * power(2, -2)         // 0.25
 * power(10, 2)         // 100
 */
const power = (a, b) => registry.execute("power", a, b);

/**
 * Square a number (raise to power of 2)
 *
 * Calculates: a * a (or a^2)
 *
 * Equivalent to power(a, 2) but optimized for the common case.
 * Always returns a positive or zero result.
 *
 * @param {number} a - Input number
 * @returns {number} The square of a (always >= 0)
 * @throws {Error} If argument is not a valid finite number
 *
 * @example
 * square(5)            // 25
 * square(-5)           // 25
 * square(0)            // 0
 * square(2.5)          // 6.25
 */
const square = (a) => registry.execute("square", a);

/**
 * Calculate the square root of a number
 *
 * Returns the principal (positive) square root of a non-negative number.
 * Uses Math.sqrt() for calculation.
 *
 * Note: Square root of negative numbers is not allowed and will throw an error
 *
 * @param {number} a - Input number (must be >= 0)
 * @returns {number} The square root of a (always >= 0)
 * @throws {Error} If argument is not a valid finite number
 * @throws {Error} If argument is negative
 *
 * @example
 * squareRoot(25)       // 5
 * squareRoot(2)        // 1.414213...
 * squareRoot(0)        // 0
 * squareRoot(100)      // 10
 * squareRoot(-9)       // Throws error
 */
const squareRoot = (a) => registry.execute("squareRoot", a);

/**
 * Public API
 * @type {Object}
 * @property {Function} add - Add two numbers
 * @property {Function} subtract - Subtract two numbers
 * @property {Function} multiply - Multiply two numbers
 * @property {Function} divide - Divide two numbers
 * @property {Function} power - Raise to a power
 * @property {Function} square - Square a number
 * @property {Function} squareRoot - Calculate square root
 */
module.exports = {
  add,
  subtract,
  multiply,
  divide,
  power,
  square,
  squareRoot,
};
