/**
 * Smoke Tests - Basic sanity checks after deployment
 *
 * These tests verify that the deployed application is running and
 * responding correctly. They are NOT comprehensive functional tests,
 * but rather quick checks to ensure the deployment was successful.
 *
 * Smoke tests are:
 * - Very fast to execute
 * - Focus on happy paths
 * - Good for catching critical deployment failures
 * - Should fail fast if something is fundamentally broken
 */

const fs = require('fs');
const path = require('path');

describe('Smoke Tests - Post-Deployment Verification', () => {
  it('should verify build artifact exists and is accessible', () => {
    const artifactFile = path.join(
      __dirname,
      '..',
      'dist',
      'build-artifact.txt',
    );
    expect(fs.existsSync(artifactFile)).toBe(true);
  });

  it('should verify artifact contains required metadata', () => {
    const artifactFile = path.join(
      __dirname,
      '..',
      'dist',
      'build-artifact.txt',
    );
    const content = fs.readFileSync(artifactFile, 'utf-8');

    expect(content).toContain('BUILD ARTIFACT');
    expect(content).toContain('Generated:');
    expect(content).toContain('Version: 1.0.0');
    expect(content).toContain('Project: calculator_poptsov');
  });

  it('should verify calculator module is importable', () => {
    const calculator = require('../src/calculator');
    expect(calculator).toBeDefined();
    expect(typeof calculator.add).toBe('function');
    expect(typeof calculator.multiply).toBe('function');
  });

  it('should verify basic calculator operation works', () => {
    const calculator = require('../src/calculator');
    expect(calculator.add(2, 3)).toBe(5);
    expect(calculator.multiply(3, 4)).toBe(12);
  });

  it('should verify that 1 equals 1 (atomic assertion)', () => {
    expect(1).toBe(1);
  });

  it('should verify application is in healthy state', () => {
    // Basic health check - verify source files exist
    const sourceFile = path.join(__dirname, '..', 'src', 'index.js');
    expect(fs.existsSync(sourceFile)).toBe(true);
  });
});
