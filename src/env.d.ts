/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// WKWebView message handlers (iOS native bridge)
interface Window {
  webkit?: {
    messageHandlers?: {
      support?: { postMessage: (msg: string) => void };
    };
  };
}
