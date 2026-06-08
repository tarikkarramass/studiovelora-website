import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:                    resolve(__dirname, 'index.html'),
        offerte:                 resolve(__dirname, 'offerte.html'),
        portfolio:               resolve(__dirname, 'portfolio.html'),
        diensten:                resolve(__dirname, 'diensten.html'),
        websiteLatenMaken:       resolve(__dirname, 'website-laten-maken.html'),
        seo:                     resolve(__dirname, 'seo.html'),
        seoQuickscan:            resolve(__dirname, 'seo-quickscan.html'),
        sea:                     resolve(__dirname, 'sea.html'),
        socialMediaAdvertising:  resolve(__dirname, 'social-media-advertising.html'),
        conversieOptimalisatie:  resolve(__dirname, 'conversie-optimalisatie.html'),
        blog:                    resolve(__dirname, 'blog.html'),
        voorwaarden:             resolve(__dirname, 'voorwaarden.html'),
        privacy:                 resolve(__dirname, 'privacy.html'),
        cookies:                 resolve(__dirname, 'cookies.html'),
        disclaimer:              resolve(__dirname, 'disclaimer.html'),
        mogelijkheden:           resolve(__dirname, 'mogelijkheden.html'),
      },
    },
  },
});
