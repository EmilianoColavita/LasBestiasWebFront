import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReleaseCard from "../components/ReleaseCard";
import SectionHeader from "../components/ui/SectionHeader";
import Reveal from "../components/ui/Reveal";

function MusicaCompleta() {
  const [albums, setAlbums] = useState({});
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/musica`);
        const data = await response.json();

        // Agrupar canciones por tipo o álbum
        const grouped = (Array.isArray(data) ? data : []).reduce((acc, track) => {
          if (!acc[track.tipo]) acc[track.tipo] = [];
          acc[track.tipo].push(track);
          return acc;
        }, {});

        setAlbums(grouped);
      } catch (error) {
        console.error("Error al obtener música:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [BASE_URL]);

  const grupos = Object.entries(albums);

  return (
    <section className="grain relative min-h-screen overflow-hidden bg-black py-16 md:py-24">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/images/fondo5.jpg')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-night-950/80 via-black/95 to-black"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader eyebrow="Música" title="Discografía completa" as="h1" />

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="surface-card overflow-hidden">
                <div className="skeleton aspect-square rounded-none" />
                <div className="space-y-3 p-5">
                  <div className="skeleton h-6 w-2/3" />
                  <div className="skeleton h-20 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && grupos.length === 0 && (
          <p className="text-center text-white/50">No hay canciones disponibles por el momento.</p>
        )}

        {grupos.map(([albumName, tracks]) => (
          <div key={albumName} className="mb-16 md:mb-20">
            <Reveal className="mb-8 flex items-center gap-5">
              <h2 className="font-display text-3xl tracking-wide text-white md:text-4xl">
                {albumName}
              </h2>
              <span className="h-px flex-1 bg-gradient-to-r from-bestia/60 to-transparent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
                {tracks.length} {tracks.length === 1 ? "tema" : "temas"}
              </span>
            </Reveal>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tracks.map((track, i) => (
                <Reveal key={track.id} delay={(i % 4) * 0.06} className="h-full">
                  <ReleaseCard track={track} showTipo={false} />
                </Reveal>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-4 text-center">
          <Link to="/" className="btn-outline">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}

export default MusicaCompleta;
