// Registration redirect page
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export function Register() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({ authorizationParams: { screen_hint: "signup" } });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-gray-400 text-lg">Redirecting...</p>
    </div>
  );
}
