import restart from 'vite-plugin-restart'
// import after instaling "npm install vite-plugin-glsl" also adjust the "vite.congig file" 
import glsl from 'vite-plugin-glsl' 

export default {
    root: 'src/', // Sources files (typically where index.html is)
    publicDir: '../static/', // Path from "root" to static assets (files that are served as they are)
    server:
    {
        host: true, // Open to local network and display URL
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
    },
    build:
    {
        outDir: '../dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: true // Add sourcemap
    },
    plugins:
    [
        restart({ restart: [ '../static/**', ] }),  // Restart server on static file change
        glsl() // Hanle shader files. Add this line after installing "vite-plugin-glsl"
    ],
}