// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
    server: {
        allowedHosts: [
            "localhost",
            "127.0.0.1",
            "devserver-staging--timhiltondev.netlify.app", // your staging site
            "*.netlify.app", // allow all Netlify previews
        ],
    },
});