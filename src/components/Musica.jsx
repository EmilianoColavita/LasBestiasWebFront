import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Musica() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/musica`);
        const data = await response.json();
        setTracks(data);
      } catch (error) {
        console.error("Error al obtener música:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [BASE_URL]);

  if (loading) {
    return (
      <section id="musica" className="py-20 bg-black text-center text-gray-400">
        Cargando música...
      </section>
    );
  }

  if (!tracks.length) {
    return (
      <section id="musica" className="py-20 bg-black text-center text-red-500">
        No hay canciones disponibles por el momento.
      </section>
    );
  }

  const limitedTracks = tracks.slice(0, 3); // 👈 SOLO 3 como antes

  return (
    <section
      id="musica"
      className="
        relative
        py-20
        px-6 md:px-8
        bg-black
        bg-no-repeat
        bg-cover
        bg-[center_top]
        md:bg-center
        min-h-screen
      "
      style={{
        backgroundImage: "url('/images/fondo-microfono.jpeg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-green-400 mb-10">
          Música
        </h2>

        {/* 🔥 Scroll horizontal SOLO en mobile */}
        <div className="flex md:grid md:grid-cols-3 gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4">
          {limitedTracks.map((track) => (
            <div
              key={track.id}
              className="min-w-[280px] md:min-w-0 bg-gray-900 rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-green-500/20 snap-start"
            >
              {track.imagenUrl && (
                <img
                  src={track.imagenUrl}
                  alt={track.titulo}
                  className="w-full h-56 object-cover"
                />
              )}

              <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {track.titulo}
                </h3>

                {track.spotifyId && (
                  <iframe
                    src={`https://open.spotify.com/embed/track/${track.spotifyId}`}
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-lg mb-3"
                    title={track.titulo}
                  ></iframe>
                )}

                {track.urlSpotify && (
                  <a
                    href={track.urlSpotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm text-green-400 hover:text-green-300"
                  >
                    Escuchar en Spotify →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            to="/musica"
            className="px-6 py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition"
          >
            Ver toda la música
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Musica;