/**
 * Calculator module with basic arithmetic operations
 * Uses operation registry pattern for maintainability and extensibility
 */

const registry = require("./operationRegistry");

/**
 * Add two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
const add = (a, b) => registry.execute("add", a, b);

/**
 * Subtract two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Difference of a and b
 */
const subtract = (a, b) => registry.execute("subtract", a, b);

/**
 * Multiply two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product of a and b
 */
const multiply = (a, b) => registry.execute("multiply", a, b);

/**
 * Divide two numbers
 * @param {number} a - Dividend
 * @param {number} b - Divisor
 * @returns {number} Quotient of a and b
 */
const divide = (a, b) => registry.execute("divide", a, b);

/**
 * Raise a number to a power
 * @param {number} a - Base number
 * @param {number} b - Exponent
 * @returns {number} a raised to the power of b
 */
const power = (a, b) => registry.execute("power", a, b);

/**
 * Square a number
 * @param {number} a - Input number
 * @returns {number} Square of a
 */
const square = (a) => registry.execute("square", a);

/**
 * Calculate square root
 * @param {number} a - Input number
 * @returns {number} Square root of a
 */
const squareRoot = (a) => registry.execute("squareRoot", a);

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  power,
  square,
  squareRoot,
};
