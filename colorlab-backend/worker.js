// colorlab-backend/worker.js

// Helper library to create and sign JWTs for Google Auth
// We will add this dependency later
import { sign }_from_ 'jose';

// The entry point for the Cloudflare Worker
export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight requests (for OPTIONS method)
        if (request.method === 'OPTIONS') {
            return handleOptions(request);
        }

        // Ensure the request is a POST request
        if (request.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 });
        }

        try {
            // Parse the incoming request body
            const { recipeName, tone, format } = await request.json();

            if (!recipeName || !tone || !format) {
                return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            }

            // Get Google Cloud credentials from the Worker's secret environment variables
            const credentials = JSON.parse(env.GOOGLE_CREDENTIALS);
            const accessToken = await getGoogleAuthToken(credentials);

            const prompt = `Create a creative description for a color grading recipe named "${recipeName}". The tone should be ${tone} and the format should be a ${format}.`;

            // Construct the request to Google's Vertex AI REST API
            const apiUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credentials.project_id}/locations/us-central1/publishers/google/models/gemini-1.0-pro:streamGenerateContent`;

            const aiRequestBody = {
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    'maxOutputTokens': 2048,
                    'temperature': 0.9,
                    'topP': 1,
                },
                safetySettings: [
                    { 'category': 'HARM_CATEGORY_HATE_SPEECH', 'threshold': 'BLOCK_MEDIUM_AND_ABOVE' },
                    { 'category': 'HARM_CATEGORY_DANGEROUS_CONTENT', 'threshold': 'BLOCK_MEDIUM_AND_ABOVE' },
                    { 'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'threshold': 'BLOCK_MEDIUM_AND_ABOVE' },
                    { 'category': 'HARM_CATEGORY_HARASSMENT', 'threshold': 'BLOCK_MEDIUM_AND_ABOVE' },
                ],
            };

            // Call the Vertex AI API
            const aiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(aiRequestBody),
            });

            if (!aiResponse.ok) {
                const errorText = await aiResponse.text();
                console.error('Google AI API Error:', errorText);
                return new Response(JSON.stringify({ error: 'Failed to get response from AI service.' }), {
                    status: aiResponse.status,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            }

            // The REST API for streaming returns a JSON array. We need to parse it.
            const aiData = await aiResponse.json();

            // Safely extract the generated text
            const text = aiData[0]?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                console.error('No text found in AI response:', JSON.stringify(aiData, null, 2));
                return new Response(JSON.stringify({ error: 'AI returned an empty or invalid response.' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            }

            // Send the successful response back to the frontend
            return new Response(JSON.stringify({ response: text }), {
                status: 200,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });

        } catch (error) {
            console.error('Worker Error:', error);
            return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
        }
    },
};

// --- Helper Functions ---

const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // In production, restrict this to your frontend's domain
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

function handleOptions(request) {
    if (
        request.headers.get('Origin') !== null &&
        request.headers.get('Access-Control-Request-Method') !== null &&
        request.headers.get('Access-Control-Request-Headers') !== null
    ) {
        // Handle CORS preflight requests.
        return new Response(null, { headers: corsHeaders });
    } else {
        // Handle standard OPTIONS requests.
        return new Response(null, {
            headers: { Allow: 'POST, OPTIONS' },
        });
    }
}

/**
 * Generates a Google Cloud authentication token from a service account.
 * @param {object} credentials - The parsed service account JSON file.
 * @returns {Promise<string>} A promise that resolves to the access token.
 */
async function getGoogleAuthToken(credentials) {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 3600; // Token expires in 1 hour

    const payload = {
        iss: credentials.client_email,
        sub: credentials.client_email,
        aud: 'https://oauth2.googleapis.com/token',
        iat: iat,
        exp: exp,
        scope: 'https://www.googleapis.com/auth/cloud-platform',
    };

    const privateKey = await crypto.subtle.importKey(
        'pkcs8',
        pemToBinary(credentials.private_key),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const jwt = await new sign(payload)
        .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
        .sign(privateKey);

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt,
        }),
    });

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
}

// Converts a PEM format private key to a binary format for the Web Crypto API
function pemToBinary(pem) {
    const base64 = pem
        .replace(/-----BEGIN PRIVATE KEY-----/g, '')
        .replace(/-----END PRIVATE KEY-----/g, '')
        .replace(/\s/g, '');
    const binary = atob(base64);
    const arr = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        arr[i] = binary.charCodeAt(i);
    }
    return arr.buffer;
}
