// Redirects unauthenticated users to Auth0 login
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, type ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
