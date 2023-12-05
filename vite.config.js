import { resolve } from 'path'
import {sync} from 'glob';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dist = {
  main: resolve(__dirname, 'src/index.html'),
  projects: []
}

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
            input: Object.fromEntries(
              sync('src/**/*.html').map(file => [
                  path.relative(
                    'src',
                    file.slice(0, file.length - path.extname(file).length)
                  ),
                  fileURLToPath(new URL(file, import.meta.url))
                ])
            )
            // input: {
            //   main: resolve(__dirname, 'src/index.html'),
            //   projects: resolve(__dirname, 'src/projects/1.html')
            // },
          }
  },
}