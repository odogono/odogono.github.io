// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), react(), sitemap()],

  markdown: {
    shikiConfig: {
      themes: {
        dark: 'github-dark',
        light: 'github-light'
      },
      wrap: true
    }
  },

  site: 'https://dev.odgn.net',

  vite: {
    plugins: [tailwindcss()]
  }
});
