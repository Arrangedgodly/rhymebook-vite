/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Local-only: "true" points the app at the Firebase emulator suite instead of the real project. */
  readonly VITE_USE_FIREBASE_EMULATOR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
