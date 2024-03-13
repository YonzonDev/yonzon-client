import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Get authentication status from Redux

  return isAuthenticated ? <Outlet /> : <Navigate to="/yonzon" />;
};

export default PrivateRoute;
