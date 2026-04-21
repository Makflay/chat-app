import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";

const FallbackRoute = () => {
  const token = useAuthStore((store) => store.token);
  const user = useAuthStore((store) => store.user);

  return <Navigate to={token && user ? "/chat" : "/login"} replace />;
};

export default FallbackRoute;
