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

  site: 'https://opendoorgonorth.com',

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: id => {
            if (id.includes('three-') || id.includes('react-three')) {
              return 'rthree';
            }
            return null;
          }
          // manualChunks: {
          //   rthree: [
          //     '@react-three/drei',
          //     '@react-three/fiber',
          //     '@react-spring/three'
          //   ],
          //   state: ['jotai'],
          //   three: ['three'],
          //   vendor: ['react', 'react-dom']
          // }
        }
      }
    },
    plugins: [tailwindcss()]
  }
});
