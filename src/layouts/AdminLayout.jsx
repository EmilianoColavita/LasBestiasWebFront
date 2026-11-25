import { useEffect, useState } from "react";
import { Outlet, Navigate, NavLink, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  Ticket,
  Globe,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { isAuthenticated, clearSession } from "../utils/auth";

const SECTIONS = [
  { name: "Resumen", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Noticias", path: "/admin/noticias", icon: Newspaper },
  { name: "Eventos", path: "/admin/eventos", icon: CalendarDays },
  { name: "Entradas", path: "/admin/entradas", icon: Ticket },
];

function SidebarContent({ onNavigate }) {
  const handleLogout = () => {
    clearSession();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-full flex-col">
      <Link
        to="/admin/dashboard"
        onClick={onNavigate}
        className="flex items-center gap-3 px-6 py-6"
      >
        <img src="/images/logo.png" alt="Las Bestias" className="h-11 w-auto" />
        <span>
          <span className="block font-display text-2xl leading-none tracking-[0.12em] text-white">
            Las Bestias
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest2 text-bestia">
            Admin
          </span>
        </span>
      </Link>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {SECTIONS.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-bestia text-black shadow-[0_10px_30px_-12px_rgba(250,204,21,0.6)]"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {name}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <Globe size={18} />
          Ver sitio
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // 🚫 Si no hay token o ya venció, redirige al login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const actual = SECTIONS.find((s) => location.pathname.startsWith(s.path))?.name || "Panel";

  // ✅ Sesión vigente, renderiza las páginas hijas de /admin dentro del panel
  return (
    <div className="grain relative min-h-screen bg-black text-white">
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-[28rem] bg-gradient-to-b from-night-800/50 to-transparent"
        aria-hidden="true"
      />

      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.06] bg-night-950/90 backdrop-blur-xl lg:block">
        <SidebarContent />
      </aside>

      {/* Barra superior mobile/tablet */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.06] bg-black/80 px-4 backdrop-blur-xl sm:px-6 lg:hidden">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <img src="/images/logo.png" alt="Las Bestias" className="h-9 w-auto" />
          <span className="font-display text-xl tracking-[0.12em] text-white">{actual}</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="icon-btn h-10 w-10"
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <Menu size={18} />
        </button>
      </header>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-white/10 bg-night-950 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="icon-btn absolute right-4 top-6"
              aria-label="Cerrar menú"
            >
              <X size={18} />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Contenido */}
      <main className="relative z-10 lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
