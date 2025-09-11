// functions/api/config.js
export async function onRequest(context) {
  const { env } = context;

  const config = {
    apiKey: env.VITE_GEMINI_API_KEY || '',
    firebaseConfig: env.VITE_FIREBASE_CONFIG || '{}',
    appId: env.VITE_APP_ID || 'default-app-id'
  };

  return new Response(JSON.stringify(config), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    }
  });
}
