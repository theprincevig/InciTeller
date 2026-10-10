import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore.js";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  const { session } = useAuthStore();

  // Restore the login from the session cookie, once on load
  useEffect(() => {
    session();
  }, [session]);

  return <AppRoutes />;
}