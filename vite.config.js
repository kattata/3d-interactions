import { resolve } from 'path'

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
        rollupOptions: {
            input: {
              main: resolve(__dirname, 'src/index.html'),
              projects: resolve(__dirname, 'src/projects/1.html'),
            },
          }
  },
}