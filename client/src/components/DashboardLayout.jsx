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
    <div className="min-h-screen text-black lg:grid lg:grid-cols-[292px_1fr]">
      <aside className="animated-grid border-b border-neutral-800 bg-black text-white shadow-2xl lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-5">
          <div className="flex items-center gap-3">
            <span className="shine grid h-11 w-11 place-items-center rounded-lg bg-white text-sm font-black text-black">SP</span>
            <div>
              <p className="font-black leading-tight">Smart Panchayat</p>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">{user.role}</p>
            </div>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto p-3 app-scrollbar lg:block lg:space-y-1 lg:overflow-visible">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    "flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition duration-200 lg:min-w-0",
                    isActive ? "bg-white text-black shadow-lg shadow-white/10" : "text-neutral-300 hover:bg-white/10 hover:text-white"
                  )
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="hidden border-t border-white/10 p-4 lg:block">
          <div className="mb-4 rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-sm font-black">{user.name}</p>
            <p className="mt-1 text-xs text-neutral-400">{user.phoneNumber}</p>
          </div>
          <Button variant="secondary" icon={LogOut} className="w-full border-white bg-white text-black hover:bg-neutral-200" onClick={logout}>
            Logout
          </Button>
        </div>
      </aside>
      <main className="min-w-0">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
