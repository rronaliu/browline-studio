import {defineConfig} from 'vite';
// Relative build assets work at a Pages repository subpath and on localhost.
export default defineConfig({base:'./',build:{sourcemap:false}});
