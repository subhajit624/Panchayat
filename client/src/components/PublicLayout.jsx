import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Button } from "./Button";
import { dashboardPathFor, useAuth } from "../context/AuthContext";
import clsx from "../utils/clsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/notices", label: "Notices" },
  { to: "/workers", label: "Workers" },
];

export const PublicLayout = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-3 md:flex-row md:items-center">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            clsx(
              "rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-300",
              isActive
                ? "border border-indigo-400/30 bg-indigo-500/15 text-white shadow-[0_8px_24px_rgba(99,102,241,.18)]"
                : "text-neutral-300 hover:bg-white/8 hover:text-white"
            )
          }
        >
          {link.label}
        </NavLink>
      ))}

      {user ? (
        <>
          <Link to={dashboardPathFor(user)} onClick={() => setOpen(false)}>
            <Button variant="secondary" className="w-full md:w-auto">
              Dashboard
            </Button>
          </Link>

          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link to="/login" onClick={() => setOpen(false)}>
            <Button variant="secondary" className="w-full md:w-auto">
              Login
            </Button>
          </Link>

          <Link to="/register" onClick={() => setOpen(false)}>
            <Button className="w-full md:w-auto">
              Register
            </Button>
          </Link>
        </>
      )}
    </nav>
  );

  return (
    <>
      <style>{`
        @keyframes pl-float {
          0%,100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-12px) scale(1.03);
          }
        }

        @keyframes pl-shimmer {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes pl-slide {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pl-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
          animation: pl-float 10s ease-in-out infinite;
        }

        .pl-logo-text {
          background: linear-gradient(120deg,#ffffff 0%,#a5b4fc 50%,#34d399 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: pl-shimmer 5s linear infinite;
        }

        .pl-mobile-nav {
          animation: pl-slide .28s ease forwards;
        }

        .pl-main-bg {
          background:
            radial-gradient(circle at top right, rgba(99,102,241,.08), transparent 30%),
            radial-gradient(circle at bottom left, rgba(52,211,153,.05), transparent 30%);
        }
      `}</style>

      <div className="pl-main-bg min-h-screen bg-[#0d0d14] text-white">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#09090f]/85 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
          <div className="relative overflow-hidden">
            {/* glow blobs */}
            <div
              className="pl-blob"
              style={{
                top: "-50px",
                right: "-30px",
                width: "180px",
                height: "180px",
                background: "rgba(99,102,241,.10)",
              }}
            />

            <div
              className="pl-blob"
              style={{
                left: "-40px",
                bottom: "-50px",
                width: "160px",
                height: "160px",
                background: "rgba(52,211,153,.06)",
                animationDelay: "5s",
              }}
            />

            <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-4">
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl font-black text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(99,102,241,.9), rgba(79,70,229,.65))",
                    boxShadow: "0 0 20px rgba(99,102,241,.25)",
                  }}
                >
                  SP
                </span>

                <span className="pl-logo-text text-xl font-black tracking-tight">
                  Smart Panchayat
                </span>
              </Link>

              {/* Desktop nav */}
              <div className="hidden md:block">
                {nav}
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                className="h-11 w-11 px-0 md:hidden"
                icon={open ? X : Menu}
                aria-label="Toggle navigation"
                onClick={() => setOpen((value) => !value)}
              />
            </div>
          </div>

          {/* Mobile nav */}
          {open ? (
            <div className="pl-mobile-nav border-t border-white/10 bg-[#09090f] p-4 md:hidden">
              {nav}
            </div>
          ) : null}
        </header>

        {/* Content */}
        <Outlet />
      </div>
    </>
  );
};