import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/functions';
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
  },
});


