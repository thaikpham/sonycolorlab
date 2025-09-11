import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  console.log('VITE env variables:', env);

  return defineConfig({});
};
