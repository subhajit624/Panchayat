import {
  Clock,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { Button } from "../../components/Button";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";

export default function WorkerPending() {
  const { user, logout } = useAuth();

  return (
    <>
      <style>{`
        @keyframes wp-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes wp-float {
          0%,100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .wp-card {
          animation: wp-rise .7s cubic-bezier(.22,1,.36,1) both;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(18px);
          box-shadow: 0 24px 60px rgba(0,0,0,.28);
        }

        .wp-float {
          animation: wp-float 3s ease-in-out infinite;
        }
      `}</style>

      <main
        className="
          grid
          min-h-screen
          place-items-center
          px-4
        "
      >
        <section
          className="
            wp-card
            w-full
            max-w-2xl
            rounded-3xl
            p-10
            text-center
          "
        >
          {/* Icon */}
          <div
            className="
              wp-float
              mx-auto
              grid
              h-24
              w-24
              place-items-center
              rounded-3xl
              border
              border-amber-400/20
              bg-gradient-to-br
              from-amber-500/20
              to-orange-500/10
              text-amber-300
            "
          >
            <Clock size={40} />
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-4xl font-black text-white">
            Worker Approval Pending
          </h1>

          {/* Description */}
          <p className="mt-5 text-lg leading-8 text-neutral-300">
            Your worker profile is currently{" "}
            <StatusBadge
              value={user.workerApprovalStatus}
            />{" "}
            . You can access the worker dashboard
            after admin approval.
          </p>

          {/* Rejection reason */}
          {user.rejectionReason ? (
            <div
              className="
                mt-8
                rounded-3xl
                border
                border-red-400/15
                bg-red-500/10
                p-5
                text-left
              "
            >
              <div className="flex items-start gap-3">
                <ShieldAlert
                  size={20}
                  className="mt-1 text-red-300"
                />

                <div>
                  <p className="font-black text-white">
                    Rejection Reason
                  </p>

                  <p className="mt-2 text-sm leading-7 text-neutral-300">
                    {user.rejectionReason}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Logout */}
          <Button
            className="mt-8 px-8"
            variant="secondary"
            icon={LogOut}
            onClick={logout}
          >
            Logout
          </Button>
        </section>
      </main>
    </>
  );
}