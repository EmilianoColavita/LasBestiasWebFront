import { Outlet, Navigate } from "react-router-dom";

export default function AdminLayout() {
  const token = localStorage.getItem("token");

  // 🚫 Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Si hay token, renderiza las páginas hijas de /admin
  return (
    <div className="bg-black min-h-screen text-white">
      <Outlet />
    </div>
  );
}
