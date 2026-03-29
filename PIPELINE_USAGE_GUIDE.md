# Pipeline Usage Guide

## Understanding Test Separation

The tests are separated into two categories:

- **Unit Tests** (`npm test`) - Fast tests for code logic
  - Runs without artifacts
  - Executes in ~0.4 seconds
  - 154 tests total
  - **Use this during development**

- **Smoke Tests** (`npm run test:smoke`) - Post-deployment verification
  - Requires the build artifact to exist
  - Only runs AFTER `npm run build`
  - 6 tests for deployment validation
  - **Used in pipeline after build stage**

## Local Testing

Run the complete pipeline locally to test before pushing to GitHub:

```bash
# 1. Run unit tests (no artifact needed)
npm test

# 2. Create build artifact
npm run build

# 3. Deploy to staging (locally simulated)
npm run deploy:staging

# 4. Run smoke tests/verification (requires artifact from step 2)
npm run test:smoke

# 5. Deploy to production (locally simulated)
npm run deploy:production
```

**Important:** Smoke tests MUST be run AFTER the build step, since they verify the artifact's existence and contents.

## GitHub Actions Workflow

The pipeline triggers automatically on push to `main` branch:

```
Push to main
    ↓
Stage 1: Unit Tests (automatic)
    └─ npm test (excludes smoke tests)
    ↓
Stage 2: Build (automatic, requires Stage 1 pass)
    └─ npm run build (creates artifact)
    ↓
Stage 3: Deploy Staging (automatic, requires Stage 2 pass)
    └─ npm run deploy:staging
    ↓
Stage 4: Verify Staging (automatic, requires Stage 3 pass)
    └─ npm run test:smoke (requires artifact from Stage 2)
    ↓
Stage 5: Deploy Production (REQUIRES MANUAL APPROVAL)
    └─ npm run deploy:production
```

## Approving Production Deployment

1. Go to GitHub repository → Actions tab
2. Find the "CD Pipeline" workflow run
3. Wait for Stage 4 to complete (green checkmark)
4. Click "Review deployments" button
5. Click "Approve and deploy" for production environment
6. Deployment proceeds automatically

## Workflow Files

- **`.github/workflows/cd-pipeline.yml`** - Main pipeline definition
  - Defines all 5 stages
  - Sets up dependencies between stages
  - Configures manual approval for production

## Build and Deploy Scripts

- **`scripts/build.js`** - Creates `dist/build-artifact.txt`
  - Generates metadata (timestamp, version, project info)
  - List of included components
  - Simulates packaged deliverable

- **`scripts/deploy.js`** - Simulates deployment
  - Takes environment name as argument
  - Displays artifact contents
  - Records deployment details
  - Usage: `node scripts/deploy.js [staging|production]`

## Smoke Tests

- **`tests/smoke.test.js`** - 6 verification tests
  - Artifact existence and accessibility
  - Artifact metadata validation
  - Module import verification
  - Basic calculator operations
  - Atomic assertion (1 == 1)
  - Application health status

Run locally:

```bash
npm run test:smoke
```

## Important Constraints

1. **Unit Tests must pass** - Pipeline stops if tests fail
2. **Artifact promotion** - Same artifact for staging and production
3. **Smoke tests block production** - If Stage 4 fails, Stage 5 cannot run
4. **Manual approval required** - Production deployment needs explicit approval
5. **Main branch only** - Production deployment only from main branch

## Troubleshooting

### Tests Fail

```bash
npm test -- --verbose
# Check specific test file:
npm test -- tests/calculator.test.js
```

### Build Fails

```bash
npm run build
# Check dist/ directory exists and is writable
# Verify Node.js version (requires 18+)
```

### Smoke Tests Fail

```bash
# This is expected! Smoke tests need the artifact first.
# Always run in this order:
npm run build                 # Step 1: Create artifact
npm run test:smoke           # Step 2: Run smoke tests

# If smoke tests still fail, check:
ls -la dist/build-artifact.txt    # Verify artifact exists
npm test                          # Make sure unit tests pass first
node -e "const calc = require('./src/calculator'); console.log(calc.add(2,3))"
```

**Key Point:** Smoke tests REQUIRE the build artifact to exist. They are meant to run AFTER the build stage in the pipeline.

## Best Practices

1. **Test locally first** - Run `npm test` before pushing
2. **Check build locally** - Run `npm run build` to verify artifact creation
3. **Verify smoke tests** - Run `npm run test:smoke` before production approval
4. **Wait for all stages** - Don't approve production until all stages pass
5. **Review artifact** - Check `dist/build-artifact.txt` contents before deployment
6. **Timed deployments** - Coordinate with team before approving production

## Additional Commands

```bash
# View all npm scripts
npm run
# or
cat package.json | grep -A 15 '"scripts"'

# Run ALL tests (unit tests + smoke tests together)
npm run test:all

# Run tests with coverage report
npm run test:coverage

# Watch mode - re-runs unit tests on file changes
npm run test:watch

# Run linting (code style check)
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Start the calculator application
npm start
```

## Test Commands Summary

| Command | Tests | Artifact Required | Use Case |
|---------|-------|-------------------|----------|
| `npm test` | Unit tests only (154) | No | Development, CI unit test stage |
| `npm run test:all` | All tests (160) | Need to build first | Complete validation |
| `npm run test:smoke` | Smoke tests only (6) | **Yes** | After build, deployment verification |
| `npm run test:coverage` | Unit tests + coverage | No | Code coverage analysis |
| `npm run test:watch` | Unit tests + watch | No | Development with auto-rerun |
