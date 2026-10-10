import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore.js";

// For /login and /register: logged-in users are sent away from them.
export default function PublicOnlyRoute() {
  const { authUser, sessionLoading } = useAuthStore();
  const location = useLocation();

  if (sessionLoading) {
    return (
      <p aria-busy="true">
        <LoaderCircle size={30} className='animate-spin' />
      </p>
    );
  }

  if (authUser) {
    // Go where ProtectedRoute was sending them, or home.
    const target = location.state?.from?.pathname || "/";
    return <Navigate to={target} replace />;
  }
  return <Outlet />;
}