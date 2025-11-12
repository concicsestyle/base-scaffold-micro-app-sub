declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const Component: DefineComponent<{}, {}, any>;
  export default Component;
}

// 环境变量
interface ImportMetaEnv {
  VITE_APP_TITLE: string;
  VITE_APP_ENV: string;
  VITE_APP_PORT: number;
  VITE_APP_CONTEXT_PATH: string;
  VITE_APP_SHORT_APP_NAME: string;
  VITE_APP_PROXY: string;
  VITE_APP_PROXY_PREFIX: string;
  VITE_APP_SERVER_BASEURL: string;
  VITE_APP_APP_BASEURL: string;
  VITE_APP_SSE: string;
  VITE_APP_SSE_URL: string;
  VITE_APP_WEBSOCKET: string;
  VITE_APP_WEBSOCKET_URL: string;
  VITE_APP_CLIENT_ID: string;
  VITE_APP_RSA_PUBLIC_KEY: string;
  VITE_APP_RSA_PRIVATE_KEY: string;
  VITE_APP_SIMULATE_TOKEN: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
  // readonly glob: any;
}
