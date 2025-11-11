/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_WORDPRESS_API_URL: string;
  readonly VITE_WORDPRESS_REST_API_URL: string;
  readonly VITE_WORDPRESS_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
