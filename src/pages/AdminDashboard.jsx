import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LogOut,
  Newspaper,
  Home,
  Menu,
  X,
  CalendarDays,
} from "lucide-react";

export default function AdminDashboard() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const sections = [
    { name: "Noticias", path: "/admin/noticias", icon: <Newspaper /> },
    { name: "Eventos", path: "/admin/eventos", icon: <CalendarDays /> },
    { name: "Entradas", path: "/admin/entradas", icon: <Newspaper /> },
  ];

  return (
    <div className="flex min-h-screen bg-black text-gray-200 relative">

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:relative z-50
          h-full
          w-64
          bg-gray-900 border-r border-gray-800
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
          <h2 className="text-xl font-bold text-yellow-400">
            Admin Panel
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400"
          >
            <X />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2">
          {sections.map((section) => {
            const active = location.pathname === section.path;
            return (
              <Link
                key={section.name}
                to={section.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? "bg-yellow-500 text-black font-semibold"
                    : "hover:bg-gray-800 hover:text-yellow-400"
                }`}
              >
                {section.icon}
                <span>{section.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 flex flex-col gap-3">
          <Link
            to="/"
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Home className="w-5 h-5" />
            Volver
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 flex flex-col w-full">

        {/* HEADER */}
        <header className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-400"
            >
              <Menu />
            </button>

            <h1 className="text-lg md:text-2xl font-bold text-yellow-400">
              {sections.find((s) => s.path === location.pathname)?.name ||
                "Panel ⚙️"}
            </h1>
          </div>

          <p className="text-xs md:text-sm text-gray-400">
            Admin 👋
          </p>
        </header>

        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}