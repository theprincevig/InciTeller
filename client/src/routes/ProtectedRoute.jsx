import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";

export default function ProtectedRoute() {
  const { authUser, sessionLoading } = useAuthStore();
  const location = useLocation();

  if (sessionLoading) {
    return (
      <p aria-busy="true">
        <LoaderCircle size={30} className='animate-spin' />
      </p>
    );
  }

  if (!authUser) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}