import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // Jeśli nie ma tokena, przekieruj do logowania
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // Jeśli jest token, pozwól wyświetlić dzieci (podstrony)
  return <Outlet />;
};
