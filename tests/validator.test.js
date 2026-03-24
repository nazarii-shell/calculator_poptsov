const validator = require('../src/validator');

describe('Validator Module - Input Format Validation', () => {
  test('should validate correct input format', () => {
    const result = validator.validateInputFormat('add 5 3');
    expect(result.valid).toBe(true);
  });

  test('should reject empty input', () => {
    const result = validator.validateInputFormat('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('should reject null input', () => {
    const result = validator.validateInputFormat(null);
    expect(result.valid).toBe(false);
  });

  test('should reject non-string input', () => {
    const result = validator.validateInputFormat(123);
    expect(result.valid).toBe(false);
  });

  test('should reject input exceeding max length', () => {
    const longInput = 'a'.repeat(101);
    const result = validator.validateInputFormat(longInput);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds maximum length');
  });

  test('should accept input at max length', () => {
    const input = 'a'.repeat(100);
    const result = validator.validateInputFormat(input);
    expect(result.valid).toBe(true);
  });
});

describe('Validator Module - Number Validation', () => {
  test('should validate positive number', () => {
    const result = validator.validateNumber(5, 'test');
    expect(result.valid).toBe(true);
  });

  test('should validate negative number', () => {
    const result = validator.validateNumber(-5, 'test');
    expect(result.valid).toBe(true);
  });

  test('should validate zero', () => {
    const result = validator.validateNumber(0, 'test');
    expect(result.valid).toBe(true);
  });

  test('should validate decimal number', () => {
    const result = validator.validateNumber(3.14, 'test');
    expect(result.valid).toBe(true);
  });

  test('should reject NaN', () => {
    const result = validator.validateNumber(NaN, 'test');
    expect(result.valid).toBe(false);
  });

  test('should reject Infinity', () => {
    const result = validator.validateNumber(Infinity, 'test');
    expect(result.valid).toBe(false);
  });

  test('should reject -Infinity', () => {
    const result = validator.validateNumber(-Infinity, 'test');
    expect(result.valid).toBe(false);
  });

  test('should reject number exceeding max', () => {
    const result = validator.validateNumber(1e16, 'test');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds maximum');
  });

  test('should reject number below min', () => {
    const result = validator.validateNumber(-1e16, 'test');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds minimum');
  });

  test('should reject non-number type', () => {
    const result = validator.validateNumber('5', 'test');
    expect(result.valid).toBe(false);
  });
});

describe('Validator Module - Operation Validation', () => {
  test('should validate add operation', () => {
    const result = validator.validateOperation('add');
    expect(result.valid).toBe(true);
  });

  test('should validate shorthand operations', () => {
    const ops = ['+', '-', '*', '/', '^'];
    ops.forEach((op) => {
      const result = validator.validateOperation(op);
      expect(result.valid).toBe(true);
    });
  });

  test('should validate unary operations', () => {
    const ops = ['square', 'sqrt', 'squareroot'];
    ops.forEach((op) => {
      const result = validator.validateOperation(op);
      expect(result.valid).toBe(true);
    });
  });

  test('should validate case insensitive', () => {
    const result = validator.validateOperation('ADD');
    expect(result.valid).toBe(true);
  });

  test('should reject unknown operation', () => {
    const result = validator.validateOperation('unknown');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('not recognized');
  });

  test('should reject empty operation', () => {
    const result = validator.validateOperation('');
    expect(result.valid).toBe(false);
  });
});

describe('Validator Module - Operand Count Validation', () => {
  test('should validate correct count for unary operations', () => {
    const result = validator.validateOperandCount('square', 1);
    expect(result.valid).toBe(true);
  });

  test('should reject wrong count for unary operations', () => {
    const result = validator.validateOperandCount('square', 2);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('requires exactly 1 operand');
  });

  test('should validate correct count for binary operations', () => {
    const result = validator.validateOperandCount('add', 2);
    expect(result.valid).toBe(true);
  });

  test('should reject wrong count for binary operations', () => {
    const result = validator.validateOperandCount('add', 1);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('requires exactly 2 operands');
  });

  test('should handle all unary operations', () => {
    ['square', 'sqrt', 'squareroot'].forEach((op) => {
      const result = validator.validateOperandCount(op, 1);
      expect(result.valid).toBe(true);
    });
  });

  test('should handle all binary operations', () => {
    ['add', '+', 'divide', '/'].forEach((op) => {
      const result = validator.validateOperandCount(op, 2);
      expect(result.valid).toBe(true);
    });
  });
});

describe('Validator Module - Operands Validation', () => {
  test('should validate valid operands for addition', () => {
    const result = validator.validateOperands('add', [5, 3]);
    expect(result.valid).toBe(true);
  });

  test('should reject division by zero', () => {
    const result = validator.validateOperands('divide', [10, 0]);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Division by zero');
  });

  test('should reject square root of negative', () => {
    const result = validator.validateOperands('sqrt', [-5]);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('negative');
  });

  test('should reject exponent out of range', () => {
    const result = validator.validateOperands('power', [2, 101]);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Exponent');
  });

  test('should reject negative exponent out of range', () => {
    const result = validator.validateOperands('power', [2, -101]);
    expect(result.valid).toBe(false);
  });

  test('should accept valid exponent', () => {
    const result = validator.validateOperands('power', [2, 10]);
    expect(result.valid).toBe(true);
  });

  test('should reject NaN operand', () => {
    const result = validator.validateOperands('add', [NaN, 5]);
    expect(result.valid).toBe(false);
  });

  test('should reject Infinity operand', () => {
    const result = validator.validateOperands('add', [Infinity, 5]);
    expect(result.valid).toBe(false);
  });

  test('should allow negative numbers for valid operations', () => {
    const result = validator.validateOperands('add', [-5, -3]);
    expect(result.valid).toBe(true);
  });
});

describe('Validator Module - Result Validation', () => {
  test('should validate finite result', () => {
    const result = validator.validateResult(42);
    expect(result.valid).toBe(true);
  });

  test('should validate zero result', () => {
    const result = validator.validateResult(0);
    expect(result.valid).toBe(true);
  });

  test('should reject Infinity result', () => {
    const result = validator.validateResult(Infinity);
    expect(result.valid).toBe(false);
  });

  test('should reject NaN result', () => {
    const result = validator.validateResult(NaN);
    expect(result.valid).toBe(false);
  });

  test('should validate decimal result', () => {
    const result = validator.validateResult(3.14159);
    expect(result.valid).toBe(true);
  });
});

describe('Validator Module - Comprehensive Validation', () => {
  test('should validate correct calculation', () => {
    const result = validator.validateCalculation('add', [5, 3]);
    expect(result.valid).toBe(true);
  });

  test('should catch invalid operation', () => {
    const result = validator.validateCalculation('unknown', [5, 3]);
    expect(result.valid).toBe(false);
  });

  test('should catch wrong operand count', () => {
    const result = validator.validateCalculation('add', [5]);
    expect(result.valid).toBe(false);
  });

  test('should catch invalid operands', () => {
    const result = validator.validateCalculation('divide', [10, 0]);
    expect(result.valid).toBe(false);
  });

  test('should validate square root', () => {
    const result = validator.validateCalculation('sqrt', [16]);
    expect(result.valid).toBe(true);
  });

  test('should reject negative square root', () => {
    const result = validator.validateCalculation('sqrt', [-9]);
    expect(result.valid).toBe(false);
  });
});

describe('Validator Module - Constraints', () => {
  test('should have defined constraints', () => {
    expect(validator.CONSTRAINTS).toBeDefined();
    expect(validator.CONSTRAINTS.MAX_NUMBER).toBeDefined();
    expect(validator.CONSTRAINTS.MIN_NUMBER).toBeDefined();
    expect(validator.CONSTRAINTS.MAX_INPUT_LENGTH).toBeDefined();
    expect(validator.CONSTRAINTS.MAX_EXPONENT).toBeDefined();
    expect(validator.CONSTRAINTS.MIN_EXPONENT).toBeDefined();
  });

  test('should have reasonable constraint values', () => {
    expect(validator.CONSTRAINTS.MAX_NUMBER).toBeGreaterThan(0);
    expect(validator.CONSTRAINTS.MIN_NUMBER).toBeLessThan(0);
    expect(validator.CONSTRAINTS.MAX_INPUT_LENGTH).toBeGreaterThan(0);
    expect(validator.CONSTRAINTS.MAX_EXPONENT).toBeGreaterThan(0);
    expect(validator.CONSTRAINTS.MIN_EXPONENT).toBeLessThan(0);
  });
});
