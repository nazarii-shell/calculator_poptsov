const { parseInput } = require('../src/inputHandler');

describe('Input Handler - Input Parsing', () => {
  describe('parseInput - Binary Operations', () => {
    test('should parse add operation', () => {
      const result = parseInput('add 5 3');
      expect(result.success).toBe(true);
      expect(result.result).toBe(8);
      expect(result.operation).toBe('add');
    });

    test('should parse + shorthand', () => {
      const result = parseInput('+ 10 5');
      expect(result.success).toBe(true);
      expect(result.result).toBe(15);
      expect(result.operation).toBe('add');
    });

    test('should parse subtract operation', () => {
      const result = parseInput('subtract 10 3');
      expect(result.success).toBe(true);
      expect(result.result).toBe(7);
      expect(result.operation).toBe('subtract');
    });

    test('should parse - shorthand', () => {
      const result = parseInput('- 10 3');
      expect(result.success).toBe(true);
      expect(result.result).toBe(7);
      expect(result.operation).toBe('subtract');
    });

    test('should parse multiply operation', () => {
      const result = parseInput('multiply 4 5');
      expect(result.success).toBe(true);
      expect(result.result).toBe(20);
      expect(result.operation).toBe('multiply');
    });

    test('should parse * shorthand', () => {
      const result = parseInput('* 4 5');
      expect(result.success).toBe(true);
      expect(result.result).toBe(20);
      expect(result.operation).toBe('multiply');
    });

    test('should parse divide operation', () => {
      const result = parseInput('divide 20 4');
      expect(result.success).toBe(true);
      expect(result.result).toBe(5);
      expect(result.operation).toBe('divide');
    });

    test('should parse / shorthand', () => {
      const result = parseInput('/ 20 4');
      expect(result.success).toBe(true);
      expect(result.result).toBe(5);
      expect(result.operation).toBe('divide');
    });

    test('should parse power operation', () => {
      const result = parseInput('power 2 3');
      expect(result.success).toBe(true);
      expect(result.result).toBe(8);
      expect(result.operation).toBe('power');
    });

    test('should parse ^ shorthand', () => {
      const result = parseInput('^ 2 3');
      expect(result.success).toBe(true);
      expect(result.result).toBe(8);
      expect(result.operation).toBe('power');
    });
  });

  describe('parseInput - Unary Operations', () => {
    test('should parse square operation', () => {
      const result = parseInput('square 5');
      expect(result.success).toBe(true);
      expect(result.result).toBe(25);
      expect(result.operation).toBe('square');
    });

    test('should parse sqrt operation', () => {
      const result = parseInput('sqrt 16');
      expect(result.success).toBe(true);
      expect(result.result).toBe(4);
      expect(result.operation).toBe('squareRoot');
    });

    test('should parse squareroot operation', () => {
      const result = parseInput('squareroot 25');
      expect(result.success).toBe(true);
      expect(result.result).toBe(5);
      expect(result.operation).toBe('squareRoot');
    });
  });

  describe('parseInput - Error Handling', () => {
    test('should handle unknown operation', () => {
      const result = parseInput('unknown 5 3');
      expect(result.success).toBe(false);
      expect(result.message).toContain('not recognized');
    });

    test('should handle missing operands for binary operation', () => {
      const result = parseInput('add 5');
      expect(result.success).toBe(false);
      expect(result.message).toContain('requires exactly 2 operands');
    });

    test('should handle missing operand for unary operation', () => {
      const result = parseInput('square');
      expect(result.success).toBe(false);
      expect(result.message).toContain('requires exactly 1 operand');
    });

    test('should handle non-numeric input', () => {
      const result = parseInput('add abc def');
      expect(result.success).toBe(false);
      expect(result.message).toContain('valid number');
    });

    test('should handle division by zero error', () => {
      const result = parseInput('divide 10 0');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Division by zero');
    });

    test('should handle square root of negative', () => {
      const result = parseInput('sqrt -9');
      expect(result.success).toBe(false);
      expect(result.message).toContain('negative');
    });
  });

  describe('parseInput - Special Commands', () => {
    test('should recognize exit command', () => {
      const result = parseInput('exit');
      expect(result.exit).toBe(true);
      expect(result.success).toBe(false);
    });

    test('should recognize help command', () => {
      const result = parseInput('help');
      expect(result.help).toBe(true);
      expect(result.success).toBe(true);
    });

    test('should handle case insensitivity', () => {
      const result1 = parseInput('EXIT');
      const result2 = parseInput('HELP');
      expect(result1.exit).toBe(true);
      expect(result2.help).toBe(true);
    });
  });

  describe('parseInput - Whitespace Handling', () => {
    test('should handle extra whitespace', () => {
      const result = parseInput('  add   5   3  ');
      expect(result.success).toBe(true);
      expect(result.result).toBe(8);
    });

    test('should handle decimal numbers', () => {
      const result = parseInput('add 2.5 3.5');
      expect(result.success).toBe(true);
      expect(result.result).toBe(6);
    });

    test('should handle negative numbers', () => {
      const result = parseInput('add -5 3');
      expect(result.success).toBe(true);
      expect(result.result).toBe(-2);
    });
  });
});
