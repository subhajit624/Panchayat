import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "./Loader";
import { dashboardPathFor, useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ roles, requireWorkerApproval = false, children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return <Loader label="Restoring session" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to={dashboardPathFor(user)} replace />;
  }

  if (requireWorkerApproval && user.role === "worker" && user.workerApprovalStatus !== "approved") {
    return <Navigate to="/worker/pending" replace />;
  }

  return children || <Outlet />;
};
