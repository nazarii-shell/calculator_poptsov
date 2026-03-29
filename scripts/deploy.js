#!/usr/bin/env node

/**
 * Deploy script - simulates deployment to an environment
 * Reads the artifact and simulates deploying it to an environment
 */

const fs = require("fs");
const path = require("path");

const environment = process.argv[2] || "staging";
const artifactFile = path.join(__dirname, "..", "dist", "build-artifact.txt");

try {
  // Check if artifact exists
  if (!fs.existsSync(artifactFile)) {
    throw new Error("Build artifact not found. Run build step first.");
  }

  // Read artifact
  const artifactContent = fs.readFileSync(artifactFile, "utf-8");

  // Simulate deployment
  console.log(`\n=== DEPLOYMENT TO ${environment.toUpperCase()} ===\n`);
  console.log(`Deploying artifact...`);
  console.log(artifactContent);
  console.log(`\n✓ Deployment to ${environment} completed successfully`);
  console.log(`Application is now running on ${environment}-server\n`);

  process.exit(0);
} catch (error) {
  console.error(`✗ Deployment to ${environment} failed:`, error.message);
  process.exit(1);
}
