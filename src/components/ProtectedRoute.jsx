import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

function ProtectedRoute({ children }) {
  // 🚫 Si no hay token o ya venció, redirige al login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Sesión vigente, renderiza el contenido
  return children;
}

export default ProtectedRoute;
