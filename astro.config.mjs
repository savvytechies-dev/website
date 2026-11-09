import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'static',
  // Retired pages: keep old URLs (and any stale objects in the bucket) from 404ing.
  redirects: {
    '/trial': '/early-access',
    '/analyzer': '/',
    '/playground': '/',
    '/status': '/',
  },
});
