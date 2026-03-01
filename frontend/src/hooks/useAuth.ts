// Combines Auth0 authentication with local user state
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore.ts";
import { useApiClient } from "../api/client.ts";
import type { User } from "../types/index.ts";

export function useAuth() {
  const { isAuthenticated, isLoading, loginWithRedirect, logout: auth0Logout } = useAuth0();
  const { user, isProfileLoaded, setUser, clearUser } = useAuthStore();
  const api = useApiClient();

  useEffect(() => {
    if (isAuthenticated && !isProfileLoaded) {
      api.get<User>("/users/me").then(setUser).catch(console.error);
    }
  }, [isAuthenticated, isProfileLoaded, api, setUser]);

  const login = () => loginWithRedirect();
  const register = () =>
    loginWithRedirect({ authorizationParams: { screen_hint: "signup" } });
  const logout = () => {
    clearUser();
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return { user, isAuthenticated, isLoading, login, logout, register };
}
