import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isConnected } = useAuth();

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

