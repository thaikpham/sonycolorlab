
import dotenv from 'dotenv';
import { createServer } from 'vite';

console.log('Starting dev server...');
dotenv.config();
console.log('dotenv configured.');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'loaded' : 'not loaded');


async function startServer() {
  console.log('Inside startServer...');
  const server = await createServer({
    server: { port: 5173, strictPort: true } // Use a specific port
  });
  console.log('Vite server created.');

  await server.listen();
  console.log('Server is listening.');


  server.printUrls();
  console.log('URLs printed.');
}

startServer();
