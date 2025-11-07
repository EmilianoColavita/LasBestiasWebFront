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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const sections = [
    { name: "Noticias", path: "/admin/noticias", icon: <Newspaper /> },
    { name: "Eventos", path: "/admin/eventos", icon: <CalendarDays /> },
  ];

  return (
    <div className="flex min-h-screen bg-black text-gray-200">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300`}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
          <h2
            className={`text-xl font-bold text-yellow-400 transition-all ${
              sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            Admin Panel
          </h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-yellow-400"
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2">
          {sections.map((section) => {
            const active = location.pathname === section.path;
            return (
              <Link
                key={section.name}
                to={section.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? "bg-yellow-500 text-black font-semibold"
                    : "hover:bg-gray-800 hover:text-yellow-400"
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                {sidebarOpen && <span>{section.name}</span>}
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
            {sidebarOpen && <span>Volver al sitio</span>}
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Imagen de fondo con overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: `url('/images/fondo6.jpg')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>

        {/* Header */}
        <header className="relative z-10 bg-gray-900 bg-opacity-90 border-b border-gray-800 p-5 flex justify-between items-center shadow">
          <h1 className="text-2xl font-bold text-yellow-400">
            {(() => {
              const current = sections.find(
                (s) => s.path === location.pathname
              );
              return current ? current.name : "Panel de Administración ⚙️";
            })()}
          </h1>
          <p className="text-gray-400 text-sm">Bienvenido, Administrador 👋</p>
        </header>

        {/* Contenido dinámico */}
        <div className="relative z-10 flex-1 p-8 overflow-y-auto">
          <Outlet /> {/* Aquí se cargan las subrutas (Noticias, Música, etc.) */}
        </div>
      </main>
    </div>
  );
}
