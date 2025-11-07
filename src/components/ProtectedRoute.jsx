import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // 🚫 Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Si hay token, renderiza el contenido
  return children;
}

export default ProtectedRoute;
