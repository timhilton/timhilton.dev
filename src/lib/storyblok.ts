import { apiPlugin, storyblokInit } from "@storyblok/js";

storyblokInit({
    accessToken: import.meta.env.PROD
        ? import.meta.env.STORYBLOK_PUBLIC_TOKEN
        : import.meta.env.STORYBLOK_PREVIEW_TOKEN,
    use: [apiPlugin],
    bridge: true
});