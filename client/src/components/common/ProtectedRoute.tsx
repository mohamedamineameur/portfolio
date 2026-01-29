import { ReactNode, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Loader } from "../ui/Loader";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading, checkAuth } = useAuth();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (user) return;
    if (hasChecked.current) return;
    hasChecked.current = true;
    void checkAuth();
  }, [user, checkAuth]);

  if (user) {
    if (requireAdmin && user.role !== "admin") {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  }

  if (isLoading) {
    return <Loader />;
  }

  return <Navigate to="/login" replace />;
}
