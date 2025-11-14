# Coding Standards

This document outlines the coding standards and best practices to be followed in this project.

## General Principles

- **Clarity and Readability:** Write code that is easy to understand and maintain.
- **Consistency:** Adhere to the established coding style and patterns used throughout the project.
- **Simplicity:** Prefer simple, straightforward solutions over complex and clever ones.

## JavaScript

- **ES6+:** Use modern JavaScript (ES6+) features such as `let`, `const`, arrow functions, and classes.
- **Modules:** Use ES6 modules (`import`/`export`) for organizing code.
- **Strict Mode:** All modules are in strict mode by default.
- **Variable Declarations:**
  - Use `const` by default for all variable declarations.
  - Use `let` only for variables that need to be reassigned.
  - Avoid using `var`.
- **Naming Conventions:**
  - **Variables and Functions:** Use `camelCase`.
  - **Classes:** Use `PascalCase`.
  - **Constants:** Use `UPPER_CASE_SNAKE_CASE` for constants that are hard-coded and reused.
- **Functions:**
  - Prefer arrow functions for anonymous functions and for maintaining the `this` context.
  - Keep functions small and focused on a single task.
- **Comments:**
  - Use comments to explain *why* something is done, not *what* is being done.
  - Use `//` for single-line comments and `/** ... */` for multi-line comments and JSDoc blocks.
- **Error Handling:**
  - Use `try...catch` blocks for handling exceptions in synchronous code.
  - Use `.catch()` for handling errors in Promises.
  - Use `async/await` with `try...catch` for handling errors in asynchronous functions.

## HTML

- Use semantic HTML5 tags where appropriate.
- All attributes should be double-quoted.

## CSS

- **Tailwind CSS:** This project uses Tailwind CSS. Adhere to the utility-first methodology.
- **Custom CSS:** If custom CSS is required, it should be placed in the `src/styles/` directory.

## File and Directory Naming

- **Files:** Use `kebab-case` for file names (e.g., `recipe-list.js`).
- **Directories:** Use `kebab-case` for directory names (e.g., `recipe-list`).

## Linting and Formatting

- While not explicitly configured in `package.json`, it is recommended to use a linter like ESLint and a formatter like Prettier to enforce these standards automatically.
