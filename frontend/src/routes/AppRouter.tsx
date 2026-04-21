import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import FallbackRoute from "./FallbackRoute";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ChatPage from "../pages/chat/ChatPage";

const AppRouter = () => {
  console.log("AppRouter");
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<FallbackRoute />} />
    </Routes>
  );
};

export default AppRouter;
