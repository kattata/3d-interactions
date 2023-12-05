import { resolve } from 'path'

export default {
    publicDir: '../static/',
    base: './',
    server:
    {
        host: true, // Open to local network and display URL
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
    },
    // build:
    // {
    //     outDir: '../dist', // Output in the dist/ folder
    //     emptyOutDir: true, // Empty the folder first
    //     sourcemap: true // Add sourcemap
    // },
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