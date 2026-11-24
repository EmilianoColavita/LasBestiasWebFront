import { Link, useLocation } from "react-router-dom";
import { SOCIAL_LINKS } from "../constants/social";

const LINKS = [
  { label: "Inicio", to: "/" },
  { label: "Noticias", to: "/noticias" },
  { label: "Música", to: "/musica" },
  { label: "Videos", to: "/#videos" },
  { label: "Shows", to: "/shows" },
  { label: "Contacto", to: "/contacto" },
];

// Borde de papel rasgado: puntos pseudoaleatorios con semilla fija (siempre igual)
function buildTear() {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const N = 90;
  const top = [];
  const bottom = [];
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * 100;
    const base = 20 - x * 0.1; // leve subida de izquierda a derecha
    const y = base + (rand() - 0.5) * 3.2 + Math.sin(i / 6) * 1.4;
    const grosor = 1.4 + rand() * 2.4;
    top.push([x, y]);
    bottom.push([x, y + grosor]);
  }
  const fmt = (pts) => pts.map(([x, y]) => x.toFixed(2) + ',' + y.toFixed(2)).join(' ');
  return {
    dark: '0,0 100,0 ' + fmt([...top].reverse()),
    paper: fmt(top) + ' ' + fmt([...bottom].reverse()),
  };
}
const TEAR = buildTear();

function TornEdge() {
  return (
    <svg
      className="absolute inset-x-0 top-0 z-10 h-14 w-full md:h-20"
      viewBox="0 0 100 26"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polygon points={TEAR.paper} fill="#e4e1da" />
      <polygon points={TEAR.dark} fill="#000" />
    </svg>
  );
}

// Rutas donde no se muestra el pie (Contacto ya tiene las redes y el email)
const SIN_FOOTER = ["/contacto"];

function Footer() {
  const { pathname } = useLocation();
  if (SIN_FOOTER.includes(pathname)) return null;

  return (
    <footer className="relative overflow-hidden bg-black">
      {/* Fotografía original de la banda en blanco y negro */}
      <div
        className="absolute inset-0 bg-cover bg-[position:70%_35%] brightness-110 contrast-125 grayscale"
        style={{ backgroundImage: "url('/images/fondo3.jpg')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-black/5"
        aria-hidden="true"
      />

      <TornEdge />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-14 pt-28 sm:px-8 md:pb-20 md:pt-40">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">
          <div>
            <span className="mb-4 block h-1 w-12 bg-bestia" aria-hidden="true" />
            <h2 className="font-display text-4xl leading-none tracking-wide text-white md:text-5xl">
              Seguí a Las Bestias
            </h2>
          </div>

          <span className="hidden h-16 w-0.5 bg-bestia sm:block" aria-hidden="true" />

          <div className="flex gap-3">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-12 w-12 place-items-center rounded-full text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-bestia"
              >
                <Icon size={26} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="relative z-10 border-t border-white/10 bg-black/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 py-5 sm:px-8 md:flex-row md:justify-between">
          <p className="text-[11px] uppercase tracking-widest text-white/40">
            © 2026 Las Bestias — Todos los derechos reservados
          </p>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="text-[11px] font-semibold uppercase tracking-widest text-white/50 transition-colors hover:text-bestia"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
