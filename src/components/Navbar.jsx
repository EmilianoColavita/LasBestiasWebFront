import { FaBars, FaTimes } from "react-icons/fa";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { isAuthenticated, clearSession } from "../utils/auth";
import { SOCIAL_LINKS } from "../constants/social";

// type "route" navega a una ruta; type "section" hace scroll a una sección del Home
const NAV_ITEMS = [
  { label: "Inicio", type: "route", to: "/" },
  { label: "Noticias", type: "route", to: "/noticias" },
  { label: "Música", type: "route", to: "/musica" },
  { label: "Videos", type: "section", to: "videos" },
  { label: "Shows", type: "route", to: "/shows" },
  { label: "Contacto", type: "route", to: "/contacto" },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();
  const isHome = location.pathname === "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  // Cerrar menú automáticamente cuando cambia la ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Estado de scroll para cambiar el fondo de la barra
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquear el scroll del body con el menú mobile abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = () => {
    clearSession();
    window.location.href = "/";
  };

  const handleSectionClick = (sectionId) => {
    setMenuOpen(false);
    if (isHome) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleRouteClick = (to) => {
    setMenuOpen(false);
    if (to === "/" && isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const solid = scrolled || menuOpen || !isHome;

  const linkBase =
    "relative py-2 text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-bestia after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100";

  const renderDesktopItem = (item) => {
    if (item.type === "section") {
      return (
        <button
          key={item.label}
          onClick={() => handleSectionClick(item.to)}
          className={`${linkBase} text-white/70`}
        >
          {item.label}
        </button>
      );
    }
    return (
      <NavLink
        key={item.label}
        to={item.to}
        end={item.to === "/"}
        onClick={() => handleRouteClick(item.to)}
        className={({ isActive }) =>
          `${linkBase} ${isActive ? "text-white after:scale-x-100" : "text-white/70"}`
        }
      >
        {item.label}
      </NavLink>
    );
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid
            ? "border-b border-white/[0.06] bg-black/80 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-black/70 to-transparent"
        }`}
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 transition-all duration-500 sm:px-8 ${
            scrolled ? "h-16" : "h-[72px] md:h-20"
          }`}
        >
          {/* LOGO */}
          <Link
            to="/"
            onClick={() => handleRouteClick("/")}
            className="group flex shrink-0 items-center gap-3"
            aria-label="Las Bestias - Inicio"
          >
            <img
              src="/images/logo.png"
              alt="Las Bestias"
              className={`w-auto object-contain transition-all duration-500 group-hover:scale-105 ${
                scrolled ? "h-9" : "h-11 md:h-12"
              }`}
            />
            <span className="hidden font-display text-2xl tracking-[0.12em] text-white sm:block">
              Las Bestias
            </span>
          </Link>

          {/* LINKS DESKTOP */}
          <div className="hidden items-center gap-7 lg:flex xl:gap-9">
            {NAV_ITEMS.map(renderDesktopItem)}
            {isLoggedIn && (
              <NavLink
                to="/admin/dashboard"
                className={`${linkBase} text-bestia hover:text-bestia-light`}
              >
                Dashboard
              </NavLink>
            )}
          </div>

          {/* DERECHA */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden items-center sm:flex">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-bestia"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>

            {isLoggedIn && (
              <div className="ml-3 hidden items-center gap-3 border-l border-white/10 pl-4 lg:flex">
                <span className="text-[11px] uppercase tracking-widest text-white/50">Admin</span>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-red-500/50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-400 transition hover:bg-red-600 hover:text-white"
                >
                  Cerrar sesión
                </button>
              </div>
            )}

            {/* Botón hamburguesa */}
            <button
              className="ml-1 grid h-10 w-10 place-items-center rounded-full border border-white/15 text-lg text-white transition hover:border-bestia hover:text-bestia lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </nav>
      </header>

      {/* MENÚ MOBILE / TABLET */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="grain fixed inset-0 z-40 flex flex-col overflow-y-auto bg-gradient-to-b from-night-950 via-black to-black px-6 pb-10 pt-24 lg:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="relative z-10 flex flex-col">
              {NAV_ITEMS.map((item, i) => {
                const active = item.type === "route" && location.pathname === item.to;
                const cls = `flex w-full items-baseline gap-4 border-b border-white/[0.06] py-4 text-left font-display text-5xl tracking-wide transition-colors ${
                  active ? "text-bestia" : "text-white hover:text-bestia"
                }`;
                const content = (
                  <>
                    <span className="font-sans text-xs font-semibold text-white/30">
                      0{i + 1}
                    </span>
                    {item.label}
                  </>
                );
                return (
                  <motion.li
                    key={item.label}
                    initial={reduce ? false : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.1, duration: 0.4 }}
                  >
                    {item.type === "section" ? (
                      <button onClick={() => handleSectionClick(item.to)} className={cls}>
                        {content}
                      </button>
                    ) : (
                      <Link to={item.to} onClick={() => handleRouteClick(item.to)} className={cls}>
                        {content}
                      </Link>
                    )}
                  </motion.li>
                );
              })}

              {isLoggedIn && (
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block border-b border-white/[0.06] py-4 font-display text-4xl tracking-wide text-bestia"
                  >
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>

            <div className="relative z-10 mt-auto pt-10">
              {isLoggedIn && (
                <div className="mb-8 flex items-center justify-between gap-4">
                  <span className="text-xs uppercase tracking-widest text-white/50">
                    Admin conectado
                  </span>
                  <button
                    onClick={handleLogout}
                    className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-red-700"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-bestia hover:text-bestia"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Espaciador: en páginas internas la barra fija no tapa el contenido */}
      {!isHome && <div className="h-[72px] md:h-20" aria-hidden="true" />}
    </>
  );
}

export default Navbar;
