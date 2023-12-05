import { sync}  from 'glob';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export default {
    publicDir: '../static/',
    base: './',
    server:
    {
        host: true, // Open to local network and display URL
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
    },
    root: 'src/',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
          // Add an index.html and a folder for each folder containing a .html file
            input: Object.fromEntries(
              sync('src/**/*.html').map(file => [
                  path.relative(
                    'src',
                    file.slice(0, file.length - path.extname(file).length)
                  ),
                  fileURLToPath(new URL(file, import.meta.url))
                ])
            )
          }
  },
}