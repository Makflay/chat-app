import { Navigate } from "react-router";
import type { PropsWithChildren } from "react";
import { useAuthStore } from "../store/auth-store";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { isAuth } = useAuthStore();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
