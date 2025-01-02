import copy from 'rollup-plugin-copy';
import { defineConfig } from 'vite';
import { execSync } from 'child_process';
import { dirname } from 'path';

const __dirname = dirname(__filename);

execSync(`bun run updateManifest.js`);

export default defineConfig({
  server: {
    port: 30001,
    open: true,
    proxy: {
      '.': 'http://localhost:30000',
      '/socket.io': {
        target: 'ws://localhost:30000',
        ws: true,
      }
    }
  },
  build: {
    sourcemap: true,
    outDir: __dirname+'/dist',
    lib: {
      entry: './index.js',
      formats: ['es'],
      fileName: 'index',
    },
//    lib: {
//      name: 'automatic-initiative',
//      entry: 'index.js',
//      formats: ['es'],
//      fileName: 'automatic-initiative'
//    },
    rollupOptions: {
      input: 'scripts/module.js',
      output: {
        dir: 'dist/',
//        file: 'dist/scripts/module.js',
        format: 'es',
      }
    }
  },
  plugins: [
    copy({
      targets: [
        { src: 'module.json', dest: 'dist'},
        { src: 'styles/', dest: 'dist'},
        { src: 'languages/', dest: 'dist'}
      ],
      hook: 'writeBundle',
    }),
  ],
});