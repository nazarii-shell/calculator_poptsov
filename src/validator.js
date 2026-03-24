/**
 * Input and value validation module
 */

const CONSTRAINTS = {
  MAX_NUMBER: 1e15,
  MIN_NUMBER: -1e15,
  MAX_DECIMAL_PLACES: 10,
  MAX_INPUT_LENGTH: 100,
  MAX_EXPONENT: 100,
  MIN_EXPONENT: -100,
};

/**
 * Validate if input string meets basic requirements
 * @param {string} input - User input string
 * @returns {object} Validation result
 */
const validateInputFormat = (input) => {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Input must be a non-empty string' };
  }

  if (input.length > CONSTRAINTS.MAX_INPUT_LENGTH) {
    return {
      valid: false,
      error: `Input exceeds maximum length of ${CONSTRAINTS.MAX_INPUT_LENGTH} characters`,
    };
  }

  return { valid: true };
};

/**
 * Validate if a number is within acceptable ranges
 * @param {number} num - Number to validate
 * @param {string} context - Description of the number (e.g., "operand 1")
 * @returns {object} Validation result
 */
const validateNumber = (num, context = 'number') => {
  if (typeof num !== 'number' || isNaN(num)) {
    return { valid: false, error: `${context} must be a valid number` };
  }

  if (!isFinite(num)) {
    return {
      valid: false,
      error: `${context} must be finite (not Infinity or NaN)`,
    };
  }

  if (num > CONSTRAINTS.MAX_NUMBER) {
    return {
      valid: false,
      error: `${context} exceeds maximum value of ${CONSTRAINTS.MAX_NUMBER}`,
    };
  }

  if (num < CONSTRAINTS.MIN_NUMBER) {
    return {
      valid: false,
      error: `${context} exceeds minimum value of ${CONSTRAINTS.MIN_NUMBER}`,
    };
  }

  return { valid: true };
};

/**
 * Validate operation name
 * @param {string} operation - Operation to validate
 * @returns {object} Validation result
 */
const validateOperation = (operation) => {
  const validOps = [
    'add',
    '+',
    'subtract',
    '-',
    'multiply',
    '*',
    'divide',
    '/',
    'power',
    '^',
    'square',
    'sqrt',
    'squareroot',
  ];

  if (!validOps.includes(operation.toLowerCase())) {
    return {
      valid: false,
      error: `Operation '${operation}' is not recognized`,
    };
  }

  return { valid: true };
};

/**
 * Validate operand count for operation
 * @param {string} operation - Operation name
 * @param {number} operandCount - Number of operands provided
 * @returns {object} Validation result
 */
const validateOperandCount = (operation, operandCount) => {
  const unaryOps = ['square', 'sqrt', 'squareroot'];
  const binaryOps = [
    'add',
    '+',
    'subtract',
    '-',
    'multiply',
    '*',
    'divide',
    '/',
    'power',
    '^',
  ];

  if (unaryOps.includes(operation.toLowerCase()) && operandCount !== 1) {
    return {
      valid: false,
      error: `Operation '${operation}' requires exactly 1 operand, got ${operandCount}`,
    };
  }

  if (binaryOps.includes(operation.toLowerCase()) && operandCount !== 2) {
    return {
      valid: false,
      error: `Operation '${operation}' requires exactly 2 operands, got ${operandCount}`,
    };
  }

  return { valid: true };
};

/**
 * Validate operands for specific operations
 * @param {string} operation - Operation name
 * @param {number[]} operands - Array of operands to validate
 * @returns {object} Validation result
 */
const validateOperands = (operation, operands) => {
  const op = operation.toLowerCase();

  // Validate all operands are numbers
  for (let i = 0; i < operands.length; i++) {
    const validation = validateNumber(operands[i], `Operand ${i + 1}`);
    if (!validation.valid) {
      return validation;
    }
  }

  // Operation-specific validation
  if (['divide', '/'].includes(op) && operands[1] === 0) {
    return { valid: false, error: 'Division by zero is not allowed' };
  }

  if (['sqrt', 'squareroot'].includes(op) && operands[0] < 0) {
    return {
      valid: false,
      error: 'Square root of negative numbers is not allowed',
    };
  }

  if (['^', 'power'].includes(op)) {
    if (
      operands[1] < CONSTRAINTS.MIN_EXPONENT ||
      operands[1] > CONSTRAINTS.MAX_EXPONENT
    ) {
      return {
        valid: false,
        error: `Exponent must be between ${CONSTRAINTS.MIN_EXPONENT} and ${CONSTRAINTS.MAX_EXPONENT}`,
      };
    }
  }

  return { valid: true };
};

/**
 * Validate the result of a calculation
 * @param {number} result - Result to validate
 * @returns {object} Validation result
 */
const validateResult = (result) => {
  if (!isFinite(result)) {
    return {
      valid: false,
      error: 'Calculation resulted in an invalid number (Infinity or NaN)',
    };
  }

  const numValidation = validateNumber(result, 'Result');
  return numValidation;
};

/**
 * Comprehensive validation of entire calculation input
 * @param {string} operation - Operation name
 * @param {number[]} operands - Array of operands
 * @returns {object} Comprehensive validation result
 */
const validateCalculation = (operation, operands) => {
  // Validate operation
  const opValidation = validateOperation(operation);
  if (!opValidation.valid) return opValidation;

  // Validate operand count
  const countValidation = validateOperandCount(operation, operands.length);
  if (!countValidation.valid) return countValidation;

  // Validate operands
  const operandValidation = validateOperands(operation, operands);
  if (!operandValidation.valid) return operandValidation;

  return { valid: true };
};

module.exports = {
  CONSTRAINTS,
  validateInputFormat,
  validateNumber,
  validateOperation,
  validateOperandCount,
  validateOperands,
  validateResult,
  validateCalculation,
};
