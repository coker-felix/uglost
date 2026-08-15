import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves from a repo subpath (coker-felix.github.io/uglost/),
  // so the deploy workflow sets VITE_BASE=/uglost/. Local dev and Docker
  // serve from the root, so the default is "/".
  base: process.env.VITE_BASE || '/',
  server: { port: 5173 },
});
