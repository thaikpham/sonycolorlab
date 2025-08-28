# Workflow and Testing Recommendations

This document provides recommendations for improving the development workflow and integrating automated testing into the Sony Color Lab project.

## 1. Branching Strategy

A consistent branching strategy is essential for managing new features, bug fixes, and releases in a structured way. I recommend a simplified Gitflow model:

*   **`main` branch:** This branch should always represent the stable, production-ready version of the application. No direct commits should be made to `main`.
*   **`develop` branch:** This is the primary development branch. All new features and fixes are merged into `develop`. It represents the "next release" of the application.
*   **Feature branches:** When starting a new feature (e.g., `feature/new-color-profile`), create a branch from `develop`. Once the feature is complete, it is merged back into `develop`.
*   **Release branches (Optional):** For managing releases, you can create `release/v1.1.0` branches from `develop`. After final testing and bug fixes, the release branch is merged into `main` and tagged.

**Example Workflow:**
1.  `git checkout develop`
2.  `git pull`
3.  `git checkout -b feature/add-new-filter`
4.  ...work on the new filter...
5.  `git checkout develop`
6.  `git pull`
7.  `git checkout feature/add-new-filter`
8.  `git merge develop` (to get the latest changes)
9.  ...resolve any conflicts and test...
10. `git checkout develop`
11. `git merge --no-ff feature/add-new-filter`
12. `git push`

## 2. Testing with Vitest

Automated testing is crucial for ensuring code quality and preventing regressions. Since the project now uses Vite, the best testing framework to use is **Vitest**. It's fast, easy to set up, and has a Jest-compatible API.

### Installation

```bash
npm install --save-dev vitest
```

### Configuration

Create a `vite.config.js` file in the root of your project with the following content:

```javascript
/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    // ...
  },
});
```

### Example Test

Let's write a simple test for the `formatRecipeName` function in `src/services/ui.js`.

First, export the function from `ui.js` if it's not already.

Create a new directory `src/tests` and a file `ui.test.js` inside it:

**`src/tests/ui.test.js`**
```javascript
import { describe, it, expect } from 'vitest';
import { formatRecipeName } from '../services/ui.js';

describe('formatRecipeName', () => {
  it('should remove leading zeros from the recipe name', () => {
    expect(formatRecipeName('SCL-00123')).toBe('SCL-123');
  });

  it('should handle PROCOLOR names', () => {
    expect(formatRecipeName('PROCOLOR-045')).toBe('PROCOLOR-45');
  });

  it('should return the original string if no leading zeros are present', () => {
    expect(formatRecipeName('SCL-1')).toBe('SCL-1');
  });

  it('should return an empty string if the input is empty or null', () => {
    expect(formatRecipeName('')).toBe('');
    expect(formatRecipeName(null)).toBe('');
  });
});
```

### Running Tests

Add a `test` script to your `package.json`:

```json
"scripts": {
  ...
  "test": "vitest"
}
```

Now you can run your tests with:

```bash
npm test
```

## 3. Continuous Integration (CI)

To automate the testing process, I recommend setting up a simple CI pipeline using **GitHub Actions**. You can create a workflow file (e.g., `.github/workflows/ci.yml`) that automatically runs your tests every time you push a new commit or open a pull request.

This will help ensure that new changes don't break existing functionality.

These recommendations provide a solid foundation for a more robust and scalable development process.
