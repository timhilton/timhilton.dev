import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from "@astrojs/react";
import { storyblok } from '@storyblok/astro';

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [
    react(),
    storyblok({
      accessToken: process.env.STORYBLOK_API_TOKEN,
      apiOptions: {
        region: 'us', // or 'eu' if your space is in Europe
      },
    }),
  ],
  prefetch: true,
  vite: {
    define: {
      'import.meta.env.STORYBLOK_API_TOKEN': JSON.stringify(process.env.STORYBLOK_API_TOKEN),
    },
    // 👇 only matters for local preview (not static build)
    server: {
      host: true, // listen on 0.0.0.0 so you can test on LAN
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        '.netlify.app', // allow all Netlify preview/staging subdomains
      ],
    },
  },
});