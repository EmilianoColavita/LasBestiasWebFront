import { Outlet, Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function AdminLayout() {
  // 🚫 Si no hay token o ya venció, redirige al login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Sesión vigente, renderiza las páginas hijas de /admin
  return (
    <div className="bg-black min-h-screen text-white">
      <Outlet />
    </div>
  );
}
