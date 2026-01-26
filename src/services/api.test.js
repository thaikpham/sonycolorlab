
import { describe, it, expect } from 'vitest';
import { callGeminiAPI } from './api';

describe('callGeminiAPI (Mock)', () => {
    it('should return mock data instead of calling fetch', async () => {
        const result = await callGeminiAPI('test prompt', null);

        expect(result).toBeDefined();
        expect(result.name).toBe("Mock AI Recipe");
        expect(result.tags).toContain("mock");
        expect(result.tags).toContain("offline");
    });
});
