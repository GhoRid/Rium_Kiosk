export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const USER_ID_KEY = "userId";

export const saveTokens = (jwt: string, refreshToken?: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, jwt);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const saveUserId = (userId: number) => {
  localStorage.setItem(USER_ID_KEY, String(userId));
};

const clearUserId = () => {
  localStorage.removeItem(USER_ID_KEY);
};

export const getUserId = () => {
  const userId = localStorage.getItem(USER_ID_KEY);
  return userId ? Number(userId) : null;
};
