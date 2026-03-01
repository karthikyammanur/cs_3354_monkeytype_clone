// Frontend environment configuration
const required = (key: string): string => {
  const value = import.meta.env[key] as string | undefined;
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
};

export const env = {
  AUTH0_DOMAIN: required("VITE_AUTH0_DOMAIN"),
  AUTH0_CLIENT_ID: required("VITE_AUTH0_CLIENT_ID"),
  AUTH0_AUDIENCE: required("VITE_AUTH0_AUDIENCE"),
  API_URL: (import.meta.env.VITE_API_URL as string) || "/api",
};
