import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/functions';
import preact from "@astrojs/preact";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [preact(), react()],
  prefetch: true
});
