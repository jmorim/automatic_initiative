import copy from 'rollup-plugin-copy';
import { defineConfig } from 'vite';
import { execSync } from 'child_process';

execSync(`bun run updateManifestVersion.js ${process.env.REPO}`);

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