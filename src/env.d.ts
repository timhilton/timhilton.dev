/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly VITE_CONTENTFUL_SPACE_ID: string;
    readonly VITE_CONTENTFUL_DELIVERY_TOKEN: string;
    readonly VITE_CONTENTFUL_PREVIEW_TOKEN: string;
    readonly PUBLIC_GOOGLE_ANALYTICS: string;
}
interface ImportMeta {
    readonly env: ImportMetaEnv;
}