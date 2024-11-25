import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [preact(), react()],
  prefetch: true
});
