import {
  Bell,
  ClipboardList,
  FileCheck,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  User,
  UserCog,
  Users,
  Wrench,
  BarChart3,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Button } from "./Button";
import { useAuth } from "../context/AuthContext";
import clsx from "../utils/clsx";

const navItems = {
  citizen: [
    { to: "/citizen", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/citizen/complaints/new", label: "Create Complaint", icon: ClipboardList },
    { to: "/citizen/complaints", label: "My Complaints", icon: Search },
    { to: "/citizen/schemes", label: "Schemes", icon: Home },
    { to: "/citizen/certificates", label: "Certificates", icon: FileCheck },
    { to: "/citizen/chat", label: "Chat", icon: MessageSquare },
    { to: "/citizen/profile", label: "Profile", icon: User },
  ],
  worker: [
    { to: "/worker", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/worker/tasks", label: "Assigned Tasks", icon: ClipboardList },
    { to: "/worker/chat", label: "Chat", icon: MessageSquare },
    { to: "/worker/profile", label: "Profile", icon: User },
  ],
  admin: [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/admins", label: "Admin Accounts", icon: UserCog },
    { to: "/admin/users", label: "Manage Users", icon: Users },
    { to: "/admin/workers", label: "Worker Approval", icon: Wrench },
    { to: "/admin/complaints", label: "Complaints", icon: ClipboardList },
    { to: "/admin/schemes", label: "Schemes", icon: Home },
    { to: "/admin/certificates", label: "Certificates", icon: FileCheck },
    { to: "/admin/notices", label: "Notices", icon: Bell },
    { to: "/admin/chat", label: "Chat", icon: MessageSquare },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ],
};

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const items = navItems[user.role] || [];

  return (
    <>
      <style>{`
        @keyframes dl-float {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.03); }
        }

        @keyframes dl-shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .dl-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
          animation: dl-float 10s ease-in-out infinite;
        }

        .dl-logo-text {
          background: linear-gradient(120deg,#ffffff 0%,#a5b4fc 50%,#34d399 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: dl-shimmer 5s linear infinite;
        }

        .dl-nav-item {
          transition: all .28s ease;
        }

        .dl-nav-item:hover {
          transform: translateX(6px);
        }

        .dl-active {
          background: linear-gradient(135deg, rgba(99,102,241,.18), rgba(79,70,229,.08));
          border: 1px solid rgba(99,102,241,.28);
          color: white;
          box-shadow: 0 8px 24px rgba(99,102,241,.18);
        }

        .dl-user-card {
          background: linear-gradient(135deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
          border: 1px solid rgba(255,255,255,.08);
          backdrop-filter: blur(10px);
        }

        .dl-main-bg {
          background:
            radial-gradient(circle at top right, rgba(99,102,241,.08), transparent 30%),
            radial-gradient(circle at bottom left, rgba(52,211,153,.05), transparent 30%);
        }
      `}</style>

      <div className="min-h-screen text-white lg:grid lg:grid-cols-[310px_1fr]">
        <aside
          className="
            relative overflow-hidden border-b border-white/10 bg-[#09090f] shadow-2xl
            lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:flex lg:flex-col
          "
        >
          <div
            className="dl-blob"
            style={{
              top: "-50px",
              right: "-30px",
              width: "220px",
              height: "220px",
              background: "rgba(99,102,241,.12)",
            }}
          />

          <div
            className="dl-blob"
            style={{
              bottom: "-60px",
              left: "-40px",
              width: "200px",
              height: "200px",
              background: "rgba(52,211,153,.08)",
              animationDelay: "5s",
            }}
          />

          {/* Header */}
          <div className="relative z-10 border-b border-white/10 px-5 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="grid h-14 w-14 place-items-center rounded-2xl font-black text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(99,102,241,.85), rgba(79,70,229,.65))",
                    boxShadow: "0 0 20px rgba(99,102,241,.28)",
                  }}
                >
                  SP
                </div>

                <div>
                  <p className="text-lg font-black dl-logo-text">
                    Smart Panchayat
                  </p>

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
                    {user.role}
                  </p>
                </div>
              </div>

              {/* Mobile logout */}
              <Button
                variant="secondary"
                icon={LogOut}
                className="lg:hidden px-3"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>

          <nav
            className="
              relative z-10 flex gap-2 overflow-x-auto p-4 app-scrollbar
              lg:flex-1 lg:block lg:space-y-2 lg:overflow-y-auto
            "
          >
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    clsx(
                      "dl-nav-item flex min-w-max items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold lg:min-w-0",
                      isActive
                        ? "dl-active"
                        : "border border-transparent text-neutral-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
                    )
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop logout */}
          <div className="relative z-10 hidden border-t border-white/10 p-5 lg:block">
            <div className="dl-user-card mb-5 rounded-2xl p-4">
              <p className="text-sm font-black text-white">{user.name}</p>
              <p className="mt-1 text-xs text-neutral-400">{user.phoneNumber}</p>
            </div>

            <Button
              variant="secondary"
              icon={LogOut}
              className="w-full"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </aside>

        <main className="dl-main-bg min-w-0 bg-[#0d0d14]">
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};