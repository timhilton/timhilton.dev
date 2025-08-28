import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from "@astrojs/react";
import {storyblok} from '@storyblok/astro';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [
    react(),
    storyblok({
      accessToken: process.env.STORYBLOK_API_TOKEN,
      apiOptions: {
        region: 'us', // or 'eu' if applicable
      },
    })],
  prefetch: true,
  vite: {
    define: {
      'import.meta.env.STORYBLOK_API_TOKEN': JSON.stringify(process.env.STORYBLOK_API_TOKEN),
    },
    server: {
      host: true, // 👈 ensures Vite listens on 0.0.0.0 (not just localhost)
      allowedHosts: process.env.CONTEXT === 'deploy-preview'
        ? ['netlify.app', 'localhost']
        : [],
    },
  },
});


