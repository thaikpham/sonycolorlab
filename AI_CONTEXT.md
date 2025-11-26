# AI Context & Coding Rules

This document outlines the strict protocol for AI-driven development in the Sony Color Lab project. All generated or modified code must adhere to these rules to ensure stability, testability, and maintainability.

## Core Principles

1.  **State is Sacred:** The central application state, managed in `src/services/state.js`, is the single source of truth. It must only be modified through explicit, predictable service functions.
2.  **UI is a Function of State:** All UI components must be pure functions that render HTML based on the current state. They should not contain their own logic for fetching or modifying data.
3.  **Events Drive State Changes:** UI components must never modify the state directly. Instead, they must dispatch events that are handled by dedicated service modules (e.g., `recipe-service.js`, `auth-service.js`).

## Mandatory Rules for AI Code Generation

1.  **Always Read `src/services/state.js` First:** Before generating or modifying any UI or business logic, the AI must read the latest version of `src/services/state.js` to understand the application's data structure.
2.  **UI Components Must Not Modify State Directly:** UI components must be stateless. They receive data (or the entire state) as arguments and return an HTML string. Any user interaction that needs to alter the application's state must be handled by dispatching a custom event, which is then picked up by an event listener in a service file.
3.  **All New Features Must Include a Corresponding `.test.js` File:** Every new feature, service, or significant piece of logic must be accompanied by a `vitest` test file. The tests must validate the logic, especially for pure functions that transform state.

This protocol is non-negotiable and is the foundation of the BMAD-METHOD's "Automated Validation" pillar. Adherence is critical for rapid, yet stable, development.
