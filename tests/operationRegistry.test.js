const registry = require("../src/operationRegistry");

describe("Operation Registry", () => {
  describe("Registry Structure", () => {
    test("should have operations defined", () => {
      expect(registry.operations).toBeDefined();
      expect(Object.keys(registry.operations).length).toBeGreaterThan(0);
    });

    test("should have operation map", () => {
      expect(registry.operationMap).toBeDefined();
    });

    test("should have all required operations", () => {
      const requiredOps = [
        "add",
        "subtract",
        "multiply",
        "divide",
        "power",
        "square",
        "squareRoot",
      ];
      requiredOps.forEach((op) => {
        expect(registry.operations[op]).toBeDefined();
      });
    });
  });

  describe("Operation Properties", () => {
    test("add operation should have correct properties", () => {
      const op = registry.operations.add;
      expect(op.name).toBe("add");
      expect(op.arity).toBe(2);
      expect(op.aliases).toContain("+");
      expect(op.description).toBeDefined();
      expect(op.execute).toBeDefined();
    });

    test("square operation should have correct properties", () => {
      const op = registry.operations.square;
      expect(op.name).toBe("square");
      expect(op.arity).toBe(1);
      expect(op.description).toBeDefined();
      expect(op.execute).toBeDefined();
    });

    test("all operations should have name, arity, aliases, description, and execute", () => {
      Object.values(registry.operations).forEach((op) => {
        expect(op.name).toBeDefined();
        expect(typeof op.name).toBe("string");
        expect(op.arity).toBeDefined();
        expect(typeof op.arity).toBe("number");
        expect(op.aliases).toBeDefined();
        expect(Array.isArray(op.aliases)).toBe(true);
        expect(op.description).toBeDefined();
        expect(typeof op.description).toBe("string");
        expect(op.execute).toBeDefined();
        expect(typeof op.execute).toBe("function");
      });
    });
  });

  describe("getOperation", () => {
    test("should get operation by primary name", () => {
      const op = registry.getOperation("add");
      expect(op).toBeDefined();
      expect(op.name).toBe("add");
    });

    test("should get operation by alias", () => {
      const op = registry.getOperation("+");
      expect(op).toBeDefined();
      expect(op.name).toBe("add");
    });

    test("should be case insensitive", () => {
      const op1 = registry.getOperation("ADD");
      const op2 = registry.getOperation("Add");
      expect(op1).toBeDefined();
      expect(op2).toBeDefined();
      expect(op1.name).toBe("add");
      expect(op2.name).toBe("add");
    });

    test("should return null for unknown operation", () => {
      const op = registry.getOperation("unknown");
      expect(op).toBeNull();
    });

    test("should handle all binary operation aliases", () => {
      const aliases = ["+", "-", "*", "/", "^"];
      aliases.forEach((alias) => {
        const op = registry.getOperation(alias);
        expect(op).toBeDefined();
      });
    });

    test("should handle all unary operation aliases", () => {
      const aliases = ["sqrt", "squareroot"];
      aliases.forEach((alias) => {
        const op = registry.getOperation(alias);
        expect(op).toBeDefined();
      });
    });
  });

  describe("getAllOperations", () => {
    test("should return all operations", () => {
      const ops = registry.getAllOperations();
      expect(Object.keys(ops).length).toBeGreaterThan(0);
    });

    test("should return operations with execute functions", () => {
      const ops = registry.getAllOperations();
      Object.values(ops).forEach((op) => {
        expect(typeof op.execute).toBe("function");
      });
    });
  });

  describe("getOperationNames", () => {
    test("should return array of operation names and aliases", () => {
      const names = registry.getOperationNames();
      expect(Array.isArray(names)).toBe(true);
      expect(names.length).toBeGreaterThan(0);
    });

    test("should include primary names and aliases", () => {
      const names = registry.getOperationNames();
      expect(names).toContain("add");
      expect(names).toContain("+");
      expect(names).toContain("divide");
      expect(names).toContain("/");
    });
  });

  describe("execute", () => {
    test("should execute add operation", () => {
      const result = registry.execute("add", 5, 3);
      expect(result).toBe(8);
    });

    test("should execute add with alias", () => {
      const result = registry.execute("+", 10, 5);
      expect(result).toBe(15);
    });

    test("should execute subtract operation", () => {
      const result = registry.execute("subtract", 10, 3);
      expect(result).toBe(7);
    });

    test("should execute multiply operation", () => {
      const result = registry.execute("multiply", 4, 5);
      expect(result).toBe(20);
    });

    test("should execute divide operation", () => {
      const result = registry.execute("divide", 20, 4);
      expect(result).toBe(5);
    });

    test("should execute power operation", () => {
      const result = registry.execute("power", 2, 3);
      expect(result).toBe(8);
    });

    test("should execute square operation", () => {
      const result = registry.execute("square", 5);
      expect(result).toBe(25);
    });

    test("should execute squareRoot operation", () => {
      const result = registry.execute("squareRoot", 16);
      expect(result).toBe(4);
    });

    test("should execute sqrt alias", () => {
      const result = registry.execute("sqrt", 25);
      expect(result).toBe(5);
    });

    test("should be case insensitive", () => {
      const result = registry.execute("DIVIDE", 20, 4);
      expect(result).toBe(5);
    });

    test("should throw error for unknown operation", () => {
      expect(() => registry.execute("unknown", 5, 3)).toThrow(
        "Unknown operation",
      );
    });

    test("should throw error for wrong number of arguments", () => {
      expect(() => registry.execute("add", 5)).toThrow(
        "requires 2 argument(s)",
      );
    });

    test("should throw error for division by zero", () => {
      expect(() => registry.execute("divide", 10, 0)).toThrow(
        "Division by zero",
      );
    });

    test("should throw error for square root of negative", () => {
      expect(() => registry.execute("squareRoot", -5)).toThrow("negative");
    });

    test("should throw error for non-number arguments", () => {
      expect(() => registry.execute("add", "a", 5)).toThrow("valid number");
    });

    test("should throw error for Infinity argument", () => {
      expect(() => registry.execute("add", Infinity, 5)).toThrow();
    });

    test("should throw error for NaN argument", () => {
      expect(() => registry.execute("add", NaN, 5)).toThrow();
    });
  });

  describe("validateArgs", () => {
    test("should validate correct arguments", () => {
      expect(() => registry.validateArgs([5, 3], 2)).not.toThrow();
    });

    test("should throw for wrong count", () => {
      expect(() => registry.validateArgs([5], 2)).toThrow("Expected 2");
    });

    test("should throw for non-number", () => {
      expect(() => registry.validateArgs(["5", 3], 2)).toThrow("valid number");
    });

    test("should throw for Infinity", () => {
      expect(() => registry.validateArgs([Infinity, 3], 2)).toThrow();
    });

    test("should throw for NaN", () => {
      expect(() => registry.validateArgs([NaN, 3], 2)).toThrow();
    });
  });

  describe("Operation Aliases", () => {
    test("add should have + alias", () => {
      const op = registry.getOperation("+");
      expect(op.name).toBe("add");
    });

    test("subtract should have - alias", () => {
      const op = registry.getOperation("-");
      expect(op.name).toBe("subtract");
    });

    test("multiply should have * alias", () => {
      const op = registry.getOperation("*");
      expect(op.name).toBe("multiply");
    });

    test("divide should have / alias", () => {
      const op = registry.getOperation("/");
      expect(op.name).toBe("divide");
    });

    test("power should have ^ alias", () => {
      const op = registry.getOperation("^");
      expect(op.name).toBe("power");
    });

    test("squareRoot should have sqrt alias", () => {
      const op = registry.getOperation("sqrt");
      expect(op.name).toBe("squareRoot");
    });

    test("squareRoot should have squareroot alias", () => {
      const op = registry.getOperation("squareroot");
      expect(op.name).toBe("squareRoot");
    });
  });

  describe("Arity", () => {
    test("binary operations should have arity 2", () => {
      const binaryOps = ["add", "subtract", "multiply", "divide", "power"];
      binaryOps.forEach((op) => {
        expect(registry.operations[op].arity).toBe(2);
      });
    });

    test("unary operations should have arity 1", () => {
      const unaryOps = ["square", "squareRoot"];
      unaryOps.forEach((op) => {
        expect(registry.operations[op].arity).toBe(1);
      });
    });
  });
});
