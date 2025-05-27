import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ngrok } from 'vite-plugin-ngrok'
import * as fs from 'node:fs';
import * as path from 'node:path';
import YAML from 'yaml'

const ngrokConfig = YAML.parse(fs.readFileSync(path.resolve('/home/d.romashov/snap/ngrok/265/.config/ngrok/ngrok.yml'), 'utf-8'));

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: 'kolenka-inc',
      project: 'inventory',
      authToken: process.env.SENTRY_AUTH_TOKEN
    }),
    ngrok({
      authtoken: ngrokConfig.authtoken,
    }),
  ],

  build: {
    sourcemap: true
  },
});
