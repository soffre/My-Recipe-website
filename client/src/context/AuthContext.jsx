import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

import { apolloClient } from '../api/client';

const TOKEN_STORAGE_KEY = 'tafach_token';
const HASURA_CLAIMS_NAMESPACE = 'https://hasura.io/jwt/claims';

const anonymousUser = {
  isAuthenticated: false,
  id: null,
  email: null,
  name: null,
  avatarUrl: null,
  role: 'anonymous',
};

const AuthContext = createContext({
  user: anonymousUser,
  token: null,
  login: () => {},
  logout: () => {},
  refreshUser: () => {},
});

function buildUserFromToken(token) {
  if (!token) {
    return anonymousUser;
  }

  try {
    const decodedToken = jwtDecode(token);

    if (decodedToken.exp && decodedToken.exp * 1000 <= Date.now()) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return anonymousUser;
    }

    const hasuraClaims = decodedToken[HASURA_CLAIMS_NAMESPACE] ?? {};
    const userId = hasuraClaims['x-hasura-user-id'] ?? null;
    const defaultRole = hasuraClaims['x-hasura-default-role'] ?? 'anonymous';

    return {
      isAuthenticated: Boolean(userId),
      id: userId,
      email: decodedToken.email ?? null,
      name: decodedToken.name ?? decodedToken['https://hasura.io/jwt/claims']?.name ?? null,
      avatarUrl: decodedToken.avatarUrl ?? decodedToken.avatar_url ?? null,
      role: defaultRole,
    };
  } catch {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return anonymousUser;
  }
}

function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => buildUserFromToken(getStoredToken()));

  const refreshUser = useCallback(() => {
    const storedToken = getStoredToken();

    setToken(storedToken);
    setUser(buildUserFromToken(storedToken));
  }, []);

  const login = useCallback((nextToken) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(buildUserFromToken(nextToken));
    void apolloClient.resetStore();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(anonymousUser);
    void apolloClient.clearStore();
  }, []);

  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key === TOKEN_STORAGE_KEY) {
        refreshUser();
      }
    }

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshUser]);

  const authContextValue = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      refreshUser,
    }),
    [login, logout, refreshUser, token, user],
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
