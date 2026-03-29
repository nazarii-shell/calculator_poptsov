#!/usr/bin/env node

/**
 * Build script - creates a build artifact
 * This simulates the build process by creating a distributable artifact
 */

const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "..", "dist");
const artifactFile = path.join(buildDir, "build-artifact.txt");

try {
  // Create dist directory if it doesn't exist
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }

  // Create build artifact with metadata
  const timestamp = new Date().toISOString();
  const artifactContent = `
BUILD ARTIFACT
==============
Generated: ${timestamp}
Version: 1.0.0
Project: calculator_poptsov

CONTENTS:
  - src/calculator.js
  - src/operationRegistry.js
  - src/inputHandler.js
  - src/validator.js
  - src/index.js
  - bin/calculator

This is a simulated build artifact. In production, this would be:
- A compiled binary
- A packaged JAR/ZIP file
- Docker image
- Or other distributable format

STATUS: BUILD SUCCESSFUL
`;

  fs.writeFileSync(artifactFile, artifactContent.trim());

  console.log(`✓ Build artifact created: ${artifactFile}`);
  console.log("Build completed successfully");
  process.exit(0);
} catch (error) {
  console.error("Build failed:", error.message);
  process.exit(1);
}
