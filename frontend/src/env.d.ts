/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_URL: string

  // Authentication
  readonly VITE_AUTH_TOKEN_KEY: string
  readonly VITE_AUTH_USER_KEY: string

  // Feature Flags
  readonly VITE_ENABLE_SOCIAL_AUTH: string
  readonly VITE_ENABLE_EMAIL_VERIFICATION: string

  // App Configuration
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 