// Application root with Auth0 and routing
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { env } from "./config/env.ts";
import { Layout } from "./components/layout/Layout.tsx";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.tsx";
import { Home } from "./pages/Home.tsx";
import { Login } from "./pages/Login.tsx";
import { Register } from "./pages/Register.tsx";
import { Profile } from "./pages/Profile.tsx";
import { About } from "./pages/About.tsx";
import { NotFound } from "./pages/NotFound.tsx";

export default function App() {
  return (
    <Auth0Provider
      domain={env.AUTH0_DOMAIN}
      clientId={env.AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: env.AUTH0_AUDIENCE,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Auth0Provider>
  );
}
