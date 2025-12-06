
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { callGeminiAPI } from './api';
import * as stateModule from './state';

// Mock the state module
vi.mock('./state', () => ({
    API_KEY: 'test-api-key',
    isAIEnabled: true
}));

describe('callGeminiAPI', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should use the correct model in the API URL', async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({
                candidates: [{
                    content: {
                        parts: [{
                            text: JSON.stringify({ id: 'test-recipe' })
                        }]
                    }
                }]
            })
        };
        global.fetch.mockResolvedValue(mockResponse);

        await callGeminiAPI('test prompt', null);

        const expectedUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=test-api-key';

        expect(global.fetch).toHaveBeenCalledTimes(1);
        const urlCalled = global.fetch.mock.calls[0][0];

        // We assert that the URL contains the correct model name
        expect(urlCalled).toContain('gemini-2.5-flash');
    });

    it('should throw an error with parsed message if API response is not ok', async () => {
        const errorBody = {
            error: {
                message: "Requests from referer are blocked."
            }
        };
        const mockResponse = {
            ok: false,
            status: 403,
            text: async () => JSON.stringify(errorBody)
        };
        global.fetch.mockResolvedValue(mockResponse);

        await expect(callGeminiAPI('test prompt', null)).rejects.toThrow("Requests from referer are blocked.");
    });

    it('should fall back to status text if error response is not valid JSON', async () => {
        const mockResponse = {
            ok: false,
            status: 500,
            text: async () => "Internal Server Error"
        };
        global.fetch.mockResolvedValue(mockResponse);

        await expect(callGeminiAPI('test prompt', null)).rejects.toThrow("API Error: 500 Internal Server Error");
    });
});
