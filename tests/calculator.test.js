const {
  add,
  subtract,
  multiply,
  divide,
  power,
  square,
  squareRoot,
} = require('../src/calculator');

describe('Calculator - Basic Operations', () => {
  describe('add', () => {
    test('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('should add positive and negative numbers', () => {
      expect(add(10, -5)).toBe(5);
    });

    test('should add two negative numbers', () => {
      expect(add(-5, -3)).toBe(-8);
    });

    test('should add zero', () => {
      expect(add(5, 0)).toBe(5);
    });

    test('should throw error for non-numeric input', () => {
      expect(() => add('a', 5)).toThrow('valid number');
    });
  });

  describe('subtract', () => {
    test('should subtract two positive numbers', () => {
      expect(subtract(10, 3)).toBe(7);
    });

    test('should subtract negative from positive', () => {
      expect(subtract(10, -5)).toBe(15);
    });

    test('should result in negative when subtracting larger from smaller', () => {
      expect(subtract(3, 10)).toBe(-7);
    });

    test('should throw error for non-numeric input', () => {
      expect(() => subtract(10, 'b')).toThrow('valid number');
    });
  });

  describe('multiply', () => {
    test('should multiply two positive numbers', () => {
      expect(multiply(4, 5)).toBe(20);
    });

    test('should multiply positive by negative', () => {
      expect(multiply(4, -5)).toBe(-20);
    });

    test('should multiply by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });

    test('should multiply decimals', () => {
      expect(multiply(2.5, 4)).toBe(10);
    });

    test('should throw error for non-numeric input', () => {
      expect(() => multiply(5, null)).toThrow('valid number');
    });
  });

  describe('divide', () => {
    test('should divide two positive numbers', () => {
      expect(divide(20, 4)).toBe(5);
    });

    test('should divide positive by negative', () => {
      expect(divide(20, -4)).toBe(-5);
    });

    test('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero is not allowed');
    });

    test('should return decimal result', () => {
      expect(divide(10, 3)).toBeCloseTo(3.333, 2);
    });

    test('should throw error for non-numeric input', () => {
      expect(() => divide(10, 'zero')).toThrow('valid number');
    });
  });

  describe('power', () => {
    test('should raise number to power', () => {
      expect(power(2, 3)).toBe(8);
    });

    test('should handle power of zero', () => {
      expect(power(5, 0)).toBe(1);
    });

    test('should handle negative exponents', () => {
      expect(power(2, -2)).toBe(0.25);
    });

    test('should throw error for non-numeric input', () => {
      expect(() => divide(10, 'zero')).toThrow('valid number');
    });
  });

  describe('square', () => {
    test('should square a positive number', () => {
      expect(square(5)).toBe(25);
    });

    test('should square a negative number', () => {
      expect(square(-5)).toBe(25);
    });

    test('should square zero', () => {
      expect(square(0)).toBe(0);
    });

    test('should throw error for non-numeric input', () => {
      expect(() => square('num')).toThrow('valid number');
    });
  });

  describe('squareRoot', () => {
    test('should return square root of positive number', () => {
      expect(squareRoot(25)).toBe(5);
    });

    test('should return square root of zero', () => {
      expect(squareRoot(0)).toBe(0);
    });

    test('should return decimal square root', () => {
      expect(squareRoot(2)).toBeCloseTo(1.414, 2);
    });

    test('should throw error for negative number', () => {
      expect(() => squareRoot(-5)).toThrow(
        'Square root of negative numbers is not allowed',
      );
    });

    test('should throw error for non-numeric input', () => {
      expect(() => squareRoot('25')).toThrow('valid number');
    });
  });
});
