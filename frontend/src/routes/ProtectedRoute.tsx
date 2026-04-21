import { Navigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useAuthStore } from "../store/auth-store";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const token = useAuthStore((store) => store.token);
  const user = useAuthStore((store) => store.user);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
