import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReleaseCard from "./ReleaseCard";
import SectionHeader from "./ui/SectionHeader";
import Reveal from "./ui/Reveal";
import ArrowIcon from "./ui/ArrowIcon";

const CANTIDAD = 3;

function Musica() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/musica`);
        const data = await response.json();
        setTracks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al obtener música:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [BASE_URL]);

  const limitedTracks = tracks.slice(0, CANTIDAD);

  return (
    <section id="musica" className="grain relative overflow-hidden bg-night-950 py-20 md:py-28">
      {/* Fotografía original de fondo (micrófono), visible y con vida */}
      <div
        className="absolute inset-0 bg-cover bg-[position:35%_center] opacity-80 saturate-[1.1]"
        style={{ backgroundImage: "url('/images/fondo-microfono.jpeg')" }}
        aria-hidden="true"
      />
      {/* Bordes superior/inferior fundidos con las secciones vecinas */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black via-black/45 to-black"
        aria-hidden="true"
      />
      {/* Leve viñeta lateral + tinte azul noche para mantener la paleta */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-night-900/25 mix-blend-multiply" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="Lanzamientos"
          title="Música"
          action={
            <Link to="/musica" className="btn-outline group">
              Ver toda la música
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />

        {loading ? (
          <div className="-mx-5 flex gap-6 overflow-x-hidden px-5 md:mx-0 md:grid md:grid-cols-3 md:px-0">
            {Array.from({ length: CANTIDAD }).map((_, i) => (
              <div key={i} className="surface-card min-w-[78%] overflow-hidden sm:min-w-[45%] md:min-w-0">
                <div className="skeleton aspect-square rounded-none" />
                <div className="space-y-3 p-5">
                  <div className="skeleton h-6 w-2/3" />
                  <div className="skeleton h-20 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : !tracks.length ? (
          <p className="text-center text-white/50">No hay canciones disponibles por el momento.</p>
        ) : (
          /* Scroll horizontal con snap en mobile, grilla en desktop */
          <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
            {limitedTracks.map((track, i) => (
              <Reveal
                key={track.id}
                delay={i * 0.1}
                className="min-w-[78%] snap-start sm:min-w-[45%] md:min-w-0"
              >
                <ReleaseCard track={track} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Musica;
