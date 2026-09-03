import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the Student Management System frontend.
// The React plugin enables Fast Refresh and JSX support out of the box.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
