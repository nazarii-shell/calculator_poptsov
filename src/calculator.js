/**
 * Calculator module with basic arithmetic operations
 */

const add = (a, b) => {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("Both arguments must be numbers");
  }
  return a + b;
};

const subtract = (a, b) => {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("Both arguments must be numbers");
  }
  return a - b;
};

const multiply = (a, b) => {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("Both arguments must be numbers");
  }
  return a * b;
};

const divide = (a, b) => {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("Both arguments must be numbers");
  }
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return a / b;
};

const power = (a, b) => {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("Both arguments must be numbers");
  }
  return Math.pow(a, b);
};

const square = (a) => {
  if (typeof a !== "number") {
    throw new Error("Argument must be a number");
  }
  return a * a;
};

const squareRoot = (a) => {
  if (typeof a !== "number") {
    throw new Error("Argument must be a number");
  }
  if (a < 0) {
    throw new Error("Square root of negative numbers is not allowed");
  }
  return Math.sqrt(a);
};

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  power,
  square,
  squareRoot,
};
