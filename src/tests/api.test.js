import { describe, it, expect, vi } from 'vitest';

// Mock the Firebase SDK modules that are imported via URL
vi.mock('https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js', () => ({
  initializeApp: vi.fn(() => ({})),
}));
vi.mock('https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js', () => ({
    getFirestore: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
}));

// Now that the mocks are set up, we can import the module to be tested
const { initializeFirebase } = await import('../services/api.js');

describe('initializeFirebase', () => {
  it('should return null if projectId is missing from the config', () => {
    // Set up the environment variable with a config that is missing the projectId
    const firebaseConfig = {
      apiKey: "test-key",
      authDomain: "test-domain",
      // projectId is intentionally missing
    };
    import.meta.env.VITE_FIREBASE_CONFIG = JSON.stringify(firebaseConfig);

    // The function should return null because the projectId is missing
    expect(initializeFirebase()).toBeNull();
  });
});
