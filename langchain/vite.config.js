import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    plugins: [
      {
        name: 'handle-html',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/' || req.url === '/index.html') {
              req.url = '/layout.html';
            }
            next();
          });
        },
        transformIndexHtml(html, { filename }) {
          if (isDev && path.basename(filename) === 'index.html') {
            return fs.readFileSync('./layout.html', 'utf-8');
          }
          return html;
        },
      },
      {
        name: 'rename-html',
        apply: 'build',
        writeBundle() {
          const oldPath = path.resolve(__dirname, 'trade/layout.html');
          const newPath = path.resolve(__dirname, 'trade/index.html');

          if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
          }
        },
      },
    ],
  base:'./', 
  // '/planetModelEarth/langchain/', // adjust this to your actual deployment path if needed
    build: {
      outDir: 'trade',
      rollupOptions: {
        input: './layout.html',
        output: {
          assetFileNames: 'assets/[name].[ext]',
          chunkFileNames: 'assets/[name].js',
          entryFileNames: 'assets/[name].js',
          format: 'es'
        },
      },
    },
  };
});
