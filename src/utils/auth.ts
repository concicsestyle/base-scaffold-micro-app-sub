const appWebShortName = import.meta.env.VITE_APP_WEB_SHORT_APP_NAME
  ? import.meta.env.VITE_APP_WEB_SHORT_APP_NAME
  : import.meta.env.VITE_APP_SHORT_APP_NAME;
const simulateToken = import.meta.env.VITE_APP_SIMULATE_TOKEN;
const appEnv = import.meta.env.VITE_APP_ENV;
const TokenKey = 'WEB-TOKEN-' + appWebShortName;

const tokenStorage = useStorage<null | string>(TokenKey, null);

export const getToken = () => {
  if (simulateToken && appEnv !== 'prod') {
    return simulateToken;
  }
  return tokenStorage.value;
};

export const setToken = (access_token: string) => (tokenStorage.value = access_token);

export const removeToken = () => (tokenStorage.value = null);
