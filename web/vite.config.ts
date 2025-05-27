import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ngrok } from 'vite-plugin-ngrok';
// import { ngrokConfig } from './ngrok.config';

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: 'kolenka-inc',
      project: 'inventory',
      authToken: process.env.SENTRY_AUTH_TOKEN
    }),
    // ngrok({
    //   authtoken: ngrokConfig.authtoken,
    // }),
  ],

  build: {
    sourcemap: true
  },
});
