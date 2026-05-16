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
    <nav className="flex flex-col gap-2 md:flex-row md:items-center">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            clsx(
              "rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-neutral-100",
              isActive ? "bg-black text-white hover:bg-black" : "text-neutral-700"
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
      {user ? (
        <>
          <Link to={dashboardPathFor(user)} onClick={() => setOpen(false)}>
            <Button variant="secondary" className="w-full md:w-auto">Dashboard</Button>
          </Link>
          <Button variant="ghost" onClick={logout}>Logout</Button>
        </>
      ) : (
        <>
          <Link to="/login" onClick={() => setOpen(false)}>
            <Button variant="secondary" className="w-full md:w-auto">Login</Button>
          </Link>
          <Link to="/register" onClick={() => setOpen(false)}>
            <Button className="w-full md:w-auto">Register</Button>
          </Link>
        </>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen text-black">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/85 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <span className="shine grid h-10 w-10 place-items-center rounded-lg bg-black text-sm font-black text-white shadow-lg shadow-black/20">SP</span>
            <span className="text-lg font-black tracking-tight">Smart Panchayat</span>
          </Link>
          <div className="hidden md:block">{nav}</div>
          <Button
            variant="ghost"
            className="h-10 w-10 px-0 md:hidden"
            icon={open ? X : Menu}
            aria-label="Toggle navigation"
            onClick={() => setOpen((value) => !value)}
          />
        </div>
        {open ? <div className="border-t border-neutral-200 bg-white p-4 md:hidden">{nav}</div> : null}
      </header>
      <Outlet />
    </div>
  );
};
