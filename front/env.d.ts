/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  /** URL complète du profil X/Twitter (ex. https://x.com/pseudo) */
  readonly VITE_TWITTER_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
