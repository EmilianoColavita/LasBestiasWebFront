import { FaInstagram, FaYoutube, FaSpotify, FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleNavClick = (sectionId) => {
    setMenuOpen(false); // cierra menú al navegar
    if (location.pathname === "/") {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 md:px-10 py-5 bg-black text-white shadow-md relative">
      {/* IZQUIERDA: enlaces + botón hamburguesa */}
      <div className="flex items-center gap-4">
        {/* Botón hamburguesa solo visible en móvil */}
        <button
          className="md:hidden text-2xl text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Menú principal */}
        <div
          className={`${
            menuOpen
              ? "flex flex-col absolute top-full left-0 w-full bg-black px-6 py-4 z-50 border-t border-gray-700"
              : "hidden"
          } md:flex md:static md:flex-row md:gap-6 text-lg font-extrabold tracking-wide`}
        >
          <button
            onClick={() => handleNavClick("/")}
            className="hover:text-red-500 transition duration-300 drop-shadow-sm text-left md:text-center py-1"
          >
            INICIO
          </button>

          <button
            onClick={() => handleNavClick("noticias")}
            className="hover:text-red-500 transition duration-300 drop-shadow-sm text-left md:text-center py-1"
          >
            NOTICIAS
          </button>

          <button
            onClick={() => handleNavClick("musica")}
            className="hover:text-red-500 transition duration-300 drop-shadow-sm text-left md:text-center py-1"
          >
            MÚSICA
          </button>

          <button
            onClick={() => handleNavClick("videos")}
            className="hover:text-red-500 transition duration-300 drop-shadow-sm text-left md:text-center py-1"
          >
            VIDEOS
          </button>

          <button
            onClick={() => navigate("/shows")}
            className="hover:text-red-500 transition duration-300 drop-shadow-sm text-left md:text-center py-1"
          >
            SHOWS
          </button>

          <button
            onClick={() => navigate("/contacto")}
            className="hover:text-red-500 transition duration-300 drop-shadow-sm text-left md:text-center py-1"
          >
            CONTACTO
          </button>

          {/* DASHBOARD visible solo si está logueado */}
          {isLoggedIn && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMenuOpen(false)}
              className="text-yellow-500 hover:text-yellow-400 transition duration-300 drop-shadow-sm text-left md:text-center py-1"
            >
              DASHBOARD
            </Link>
          )}

          {/* ADMIN CONECTADO — visible en mobile dentro del menú */}
          {isLoggedIn && (
            <div className="flex flex-col gap-2 mt-4 md:hidden border-t border-gray-700 pt-3">
              <span className="text-sm text-gray-300 italic">ADMIN CONECTADO</span>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition duration-300 w-fit"
              >
                CERRAR SESIÓN
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DERECHA: redes sociales + admin (solo en escritorio) */}
      <div className="flex gap-4 items-center">
        <a
          href="https://www.instagram.com/lasbestiasok/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-500 transition duration-300"
          aria-label="Instagram"
        >
          <FaInstagram size={24} />
        </a>

        <a
          href="https://www.youtube.com/@lasbestias7520"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-500 transition duration-300"
          aria-label="YouTube"
        >
          <FaYoutube size={24} />
        </a>

        <a
          href="https://open.spotify.com/intl-es/artist/5zNZD3CVAzkt15PqCavTZZ"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-500 transition duration-300"
          aria-label="Spotify"
        >
          <FaSpotify size={24} />
        </a>

        {/* En escritorio, mantener admin info visible */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center gap-3 ml-4">
            <span className="text-sm text-gray-300 italic">ADMIN CONECTADO</span>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition duration-300"
            >
              CERRAR SESIÓN
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
