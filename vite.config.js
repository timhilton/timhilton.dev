import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        allowedHosts: [
            // Allow your Netlify preview server domain
            'devserver-staging--timhiltondev.netlify.app',
            // Allow all Netlify preview subdomains
            '.netlify.app',
        ],
    },
});