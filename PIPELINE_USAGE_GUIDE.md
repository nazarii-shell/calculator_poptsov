# Pipeline Usage Guide

## Local Testing

Run the complete pipeline locally to test before pushing to GitHub:

```bash
# 1. Run unit tests
npm test

# 2. Create build artifact
npm run build

# 3. Deploy to staging (locally simulated)
npm run deploy:staging

# 4. Run smoke tests/verification
npm run test:smoke

# 5. Deploy to production (locally simulated)
npm run deploy:production
```

## GitHub Actions Workflow

The pipeline triggers automatically on push to `main` branch:

```
Push to main
    ↓
Stage 1: Unit Tests (automatic)
    ↓
Stage 2: Build (automatic, requires Stage 1 pass)
    ↓
Stage 3: Deploy Staging (automatic, requires Stage 2 pass)
    ↓
Stage 4: Verify Staging (automatic, requires Stage 3 pass)
    ↓
Stage 5: Deploy Production (REQUIRES MANUAL APPROVAL)
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
npm run test:smoke -- --verbose
# Check build artifact exists:
ls -la dist/build-artifact.txt
# Verify calculator module imports:
node -e "const calc = require('./src/calculator'); console.log(calc.add(2,3))"
```

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

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Start the application
npm start
```
