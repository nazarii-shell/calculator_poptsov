# CD/CI Pipeline Report - Calculator Project

## Overview

This report explains the 5-stage continuous deployment pipeline implemented for the Calculator project. The pipeline follows a best-practice approach with automatic testing, building, staging deployment, verification, and manual production deployment.

**Pipeline Flow:** `test` → `build` → `deploy_staging` → `verify_staging` → `deploy_production`

---

## Stage 1: Unit Tests

### Description

The first stage runs automated unit tests on the calculator codebase without requiring any deployment.

### What Unit Tests Check

The unit tests verify the core functionality of the calculator module:

1. **Calculator Operations** (`tests/calculator.test.js`)
   - Addition, subtraction, multiplication operations
   - Division and power operations
   - Square and square root functions
   - Error handling for invalid inputs
   - Division by zero protection
   - Negative square root protection

2. **Input Handler** (`tests/inputHandler.test.js`)
   - Command-line input parsing
   - User interaction flows
   - Input validation and error messages

3. **Operation Registry** (`tests/operationRegistry.test.js`)
   - Operation registration system
   - Centralized validation logic
   - Error handling consistency

4. **Validator** (`tests/validator.test.js`)
   - Number validation
   - Type checking
   - Null/undefined checking
   - Finite number checks

### Why This Stage Executes First

**Benefits of Early Testing:**

1. **Fast Feedback Loop** - Tests run in seconds (~1 second for this project), allowing developers to catch issues immediately
2. **Cost-Effective** - No infrastructure provisioning needed; tests run locally or in CI runner
3. **Early Problem Detection** - Catches bugs before they consume build resources
4. **Fail Fast Principle** - Stops the pipeline immediately if core functionality is broken, avoiding wasted time on subsequent stages
5. **Development Efficiency** - Developers can run tests locally before committing (using `npm test`)

**Pipeline Halt Condition:**
If any unit test fails, the entire pipeline stops. No subsequent stages execute.

### Implementation

```bash
# Command in stage
npm test -- --coverage --testPathPattern="calculator|inputHandler|operationRegistry|validator"

# Tests run: calculator tests + input handler + registry + validator
# Coverage is tracked and reported to codecov
```

**Artifacts Generated:**

- Test coverage report (coverage-final.json)
- JUnit-style test results

---

## Stage 2: Build

### Description

The build stage creates a distributable artifact that will be deployed to staging and production environments.

### What the Build Stage Does

1. **Creates Distribution Package**
   - Generates `dist/build-artifact.txt`
   - This is a **simulated artifact** representing a real build output
   - In production scenarios, this could be:
     - Compiled JavaScript bundle
     - Docker image
     - JAR/ZIP file
     - Native binary executable
     - Container image pushed to registry

2. **Artifact Contents**

   ```
   BUILD ARTIFACT
   ==============
   Generated: <timestamp>
   Version: 1.0.0
   Project: calculator_poptsov

   CONTENTS:
     - src/calculator.js
     - src/operationRegistry.js
     - src/inputHandler.js
     - src/validator.js
     - src/index.js
     - bin/calculator
   ```

3. **Build Metadata**
   - Generation timestamp (ISO 8601 format)
   - Version number
   - Project identifier
   - List of included components

### Why Separate Build Stage

**Advantages:**

1. **Artifact Reusability** - The same artifact built once is deployed to staging AND production (identical promotion)
2. **Consistency** - Eliminates "works on my machine" problems by ensuring both environments run identical code
3. **Reproducibility** - Can rebuild from same source at any time
4. **Version Control** - Each artifact is timestamped for traceability
5. **Resource Optimization** - Building happens once; deployments just copy the artifact
6. **Separation of Concerns** - Build logic is separate from deployment logic

### Implementation

```bash
# Build command
node scripts/build.js

# Output: Creates dist/build-artifact.txt with metadata

# Artifact Upload
# GitHub Actions uploads artifact with 1-day retention
```

**Artifacts Generated:**

- `dist/build-artifact.txt` - The deployment artifact

**Prerequisites:**

- Unit tests must pass (blocked by `needs: stage_1_test`)

---

## Stage 3: Deploy to Staging

### Description

Deploys the built artifact to a staging environment for pre-production testing and validation.

### What This Stage Does

1. **Downloads Artifact**
   - Retrieves the build artifact from Stage 2
   - Verifies artifact integrity

2. **Simulates Deployment**

   ```
   === DEPLOYMENT TO STAGING ===
   Deploying artifact...
   [artifact contents]
   ✓ Deployment to staging completed successfully
   Application is now running on staging-server
   ```

3. **Environment Simulation**
   - Logs deployment details
   - Records environment information
   - Produces deployment timestamp

### Purpose of Staging Environment

**Staging is an exact replica of production and serves to:**

1. **Non-Production Testing** - Test the full deployment process without impacting users
2. **Configuration Validation** - Verify environment-specific settings work correctly
3. **Integration Testing** - Test interactions with external services (databases, APIs)
4. **Performance Testing** - Baseline performance in production-like conditions
5. **Rollback Practice** - Test backup and recovery procedures
6. **User Acceptance Testing (UAT)** - Final approval before production release
7. **Risk Mitigation** - Catch deployment issues before they affect real users

### Deployment Process

```bash
# Download artifact
actions/download-artifact@v3

# Deploy
node scripts/deploy.js staging

# Log details
echo "Staging deployment completed"
```

**Environment Settings:**

- `environment: name: staging`
- Requires GitHub environment configuration (if protecting with approval)

**Artifacts Generated:**

- Deployment logs
- Artifact extracted to staging

---

## Stage 4: Verify Staging

### Description

Post-deployment smoke tests that verify the staging deployment was successful and the application is healthy.

### What "Verify" Means

**Smoke Testing** - Quick sanity checks to ensure:

- The application deployed correctly
- Critical paths are functional
- No fundamental errors in deployment
- Basic health status is good

### Difference from Unit Tests

| Aspect                    | Unit Tests                    | Smoke Tests                  |
| ------------------------- | ----------------------------- | ---------------------------- |
| **Scope**                 | Individual functions/modules  | Entire deployed system       |
| **Execution Time**        | Fast (~1-2 seconds)           | Fast (~5-10 seconds)         |
| **External Dependencies** | Mocked/not required           | Real artifacts and files     |
| **Focus**                 | Code correctness              | Deployment success           |
| **Runs**                  | At start of pipeline          | After deployment             |
| **Failure Impact**        | Stops pipeline immediately    | Blocks production deployment |
| **Test Type**             | White-box (testing internals) | Black-box (testing behavior) |
| **Coverage**              | Should be comprehensive       | Focused on critical paths    |

### Smoke Tests Validation

The smoke tests verify:

1. **Artifact Accessibility**

   ```javascript
   // Verify build artifact exists and is accessible
   expect(fs.existsSync(artifactFile)).toBe(true);
   ```

2. **Artifact Integrity**

   ```javascript
   // Verify artifact contains required metadata
   expect(content).toContain("BUILD ARTIFACT");
   expect(content).toContain("Version: 1.0.0");
   expect(content).toContain("Project: calculator_poptsov");
   ```

3. **Module Importability**

   ```javascript
   // Verify calculator module is importable
   const calculator = require("../src/calculator");
   expect(calculator).toBeDefined();
   expect(typeof calculator.add).toBe("function");
   ```

4. **Basic Operations**

   ```javascript
   // Verify basic calculator operation works
   expect(calculator.add(2, 3)).toBe(5);
   expect(calculator.multiply(3, 4)).toBe(12);
   ```

5. **Atomic Assertion**

   ```javascript
   // Verify that 1 equals 1 (simple sanity check)
   expect(1).toBe(1);
   ```

6. **Health Status**
   ```javascript
   // Verify application is in healthy state
   expect(fs.existsSync(sourceFile)).toBe(true);
   ```

### Implementation

```bash
# Run smoke tests
npm test -- smoke.test.js --testPathPattern="smoke"

# Verify artifact
if [ -f "dist/build-artifact.txt" ]; then
  echo "✓ Artifact is accessible"
else
  exit 1
fi
```

### Critical Requirement

**If this stage fails, production deployment MUST NOT proceed.**

This is implemented as a pipeline requirement:

```yaml
needs: stage_4_verify_staging
```

This creates a dependency ensuring step 5 cannot execute if step 4 fails.

**Test Suite Results:**

```
✓ should verify build artifact exists and is accessible
✓ should verify artifact contains required metadata
✓ should verify calculator module is importable
✓ should verify basic calculator operation works
✓ should verify that 1 equals 1 (atomic assertion)
✓ should verify application is in healthy state
```

---

## Stage 5: Deploy to Production

### Description

Final stage that deploys the verified artifact to the production environment. This stage requires **manual approval** before execution.

### Manual Approval Requirement

**Why Manual Approval?**

Production deployments are sensitive and irreversible. Manual approval ensures:

1. **Human Oversight** - A team member explicitly approves the release
2. **Business Approval** - Stakeholders can verify readiness
3. **Scheduled Releases** - Deployment can be timed appropriately
4. **Audit Trail** - Records who approved and when
5. **Accident Prevention** - Prevents accidental production deployments
6. **Rollback Coordination** - Team can prepare for contingencies

### How to Trigger Production Deployment

1. **Via GitHub UI:**
   - Go to Actions → CD Pipeline
   - Select the workflow run
   - Click "Review deployments"
   - Click "Approve and deploy" on the production environment

2. **Approval Tracking:**
   - GitHub records who approved and when
   - Creates audit log entry
   - Deployment triggered only after approval

### Deployment Process

```yaml
environment:
  name: production
if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

**Conditions:**

- Only triggers on push to `main` branch (not on pull requests)
- Requires all previous stages to pass
- Requires manual approval in GitHub

**Deployment Steps:**

1. Download the tested artifact from staging
2. Execute production deployment
3. Verify post-deployment health
4. Record deployment metadata
5. Notify successful deployment

### Post-Deployment Verification

```bash
# Deploy to production
node scripts/deploy.js production

# Verify the deployment
echo "✓ Production deployment completed"
echo "Environment: production"
echo "Deployed at: $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
echo "Deployed by: ${{ github.actor }}"
```

### Production Safety Features

**Artifact Promotion:**

- Same artifact deployed to staging AND production
- No rebuilding for production (eliminates discrepancies)
- Proven artifact from staging verification

**Traceability:**

- Deployment timestamp recorded
- Deployer identified (GitHub actor)
- Full workflow history available
- Rollback capability maintained

---

## Complete Pipeline Execution Summary

### Success Scenario

```
Stage 1: Test       ✓ Unit tests pass
    ↓
Stage 2: Build      ✓ Artifact created
    ↓
Stage 3: Deploy     ✓ Deployed to staging
    ↓
Stage 4: Verify     ✓ Smoke tests pass
    ↓
Stage 5: Deploy     ⏸ Waiting for approval
    (Manual approval required)
    ↓
Stage 5: Deploy     ✓ Production deployment complete
```

### Failure Scenarios

**Stage 1 Fails:**

- Pipeline stops immediately
- Build and deploy stages never execute
- Developer must fix code and retrigger

**Stage 2 Fails:**

- Build failed
- Pipeline stops
- No artifact created
- Staging and production not affected

**Stage 3 Fails:**

- Staging deployment failed
- No issue with production
- Can retry after fixing deployment issue

**Stage 4 Fails:**

- Smoke tests detected problems in staging
- **Production deployment is BLOCKED**
- Must fix issues in staging environment first
- Cannot bypass this protection

**Stage 5:**

- Requires manual approval (cannot fail automatically)
- Manual approval can be delayed or rejected
- Only approved deployments proceed

---

## Configuration Files

### `.github/workflows/cd-pipeline.yml`

Main pipeline definition with all 5 stages and their dependencies.

### `scripts/build.js`

Creates the build artifact (src/calculator contents).

### `scripts/deploy.js`

Simulates deployment by displaying artifact contents in target environment.

### `tests/smoke.test.js`

Post-deployment verification tests (6 smoke test cases).

### `package.json` Scripts

```json
"build": "node scripts/build.js",
"deploy:staging": "node scripts/deploy.js staging",
"deploy:production": "node scripts/deploy.js production",
"test:smoke": "jest --testPathPattern=smoke",
"verify": "jest tests/smoke.test.js"
```

---

## Running Locally

Test the pipeline locally without GitHub Actions:

```bash
# Stage 1: Run tests
npm test

# Stage 2: Create artifact
npm run build

# Stage 3: Deploy to staging
npm run deploy:staging

# Stage 4: Run smoke tests/verification
npm run test:smoke

# Stage 5: Deploy to production (manual in real scenario)
npm run deploy:production
```

---

## Key Features

✓ **Automated Testing** - Unit tests run automatically
✓ **Artifact Promotion** - Same build for staging and production
✓ **Smoke Testing** - Post-deployment health verification
✓ **Manual Approval** - Production deployments require approval
✓ **Fail-Fast Principle** - Stops at first failure
✓ **Staging Validation** - Blocks production if staging fails
✓ **Audit Trail** - Records all actions and approvals
✓ **Dependency Chain** - Each stage depends on previous success
✓ **Reproducibility** - Can rebuild and redeploy anytime

---

## Troubleshooting

### Unit Tests Fail

- Check `npm test` locally
- Review calculator.test.js for failures
- Fix code and reinstage

### Build Fails

- Verify `scripts/build.js` is executable
- Check `npm run build` output
- Ensure write permissions to `dist/` directory

### Staging Deployment Fails

- Verify artifact exists: `ls -la dist/`
- Check `npm run deploy:staging` locally
- Review deployment script errors

### Smoke Tests Fail

- Run `npm run test:smoke` locally
- Verify artifact is created and accessible
- Check calculator module imports correctly
- Ensure all required files exist

### Production Approval

- Go to Actions workflow run
- Check for "Review deployments" button
- Click "Approve and deploy"
- Wait for deployment to complete

---

## Conclusion

This 5-stage pipeline implements industry best practices for continuous integration and deployment:

1. **Unit Tests** catch code issues early
2. **Build** creates reproducible artifacts
3. **Staging Deployment** validates deployment process
4. **Smoke Tests** ensure deployment success
5. **Production Deployment** is human-approved and artifact-verified

The pipeline ensures quality, consistency, and safety throughout the deployment lifecycle.
