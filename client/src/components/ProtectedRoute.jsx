import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "./Loader";
import { dashboardPathFor, useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({
  roles,
  requireWorkerApproval = false,
  children,
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="min-h-screen relative overflow-hidden bg-[#0d0d14]"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(99,102,241,.08), transparent 30%), radial-gradient(circle at bottom left, rgba(52,211,153,.05), transparent 30%)",
        }}
      >
        <style>{`
          @keyframes pr-float {
            0%,100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-14px) scale(1.04);
            }
          }

          .pr-blob {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            filter: blur(70px);
            animation: pr-float 10s ease-in-out infinite;
          }
        `}</style>

        {/* background glow */}
        <div
          className="pr-blob"
          style={{
            top: "-80px",
            right: "-40px",
            width: "260px",
            height: "260px",
            background: "rgba(99,102,241,.14)",
          }}
        />

        <div
          className="pr-blob"
          style={{
            bottom: "-80px",
            left: "-40px",
            width: "220px",
            height: "220px",
            background: "rgba(52,211,153,.08)",
            animationDelay: "5s",
          }}
        />

        <div className="relative z-10">
          <Loader label="Restoring session" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to={dashboardPathFor(user)} replace />;
  }

  if (
    requireWorkerApproval &&
    user.role === "worker" &&
    user.workerApprovalStatus !== "approved"
  ) {
    return <Navigate to="/worker/pending" replace />;
  }

  return children || <Outlet />;
};