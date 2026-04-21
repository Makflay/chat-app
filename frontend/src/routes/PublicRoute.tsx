import { Navigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useAuthStore } from "../store/auth-store";

const PublicRoute = ({ children }: PropsWithChildren) => {
  const token = useAuthStore((store) => store.token);
  const user = useAuthStore((store) => store.user);

  if (token && user) {
    return <Navigate to="/chat" replace />;
  }

  return children;
};

export default PublicRoute;
