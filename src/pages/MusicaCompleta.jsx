import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
        const grouped = data.reduce((acc, track) => {
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

  if (loading) {
    return (
      <section className="py-20 bg-black text-center text-gray-400">
        Cargando música...
      </section>
    );
  }

  return (
    <section
      className="relative py-24 px-8 bg-black bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('/images/fondo5.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay oscuro para mejorar la legibilidad */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* Contenido principal */}
      <div className="relative max-w-6xl mx-auto z-10">
        <h2 className="text-5xl font-extrabold text-green-400 mb-12 text-center">
          Discografía completa
        </h2>

        {Object.entries(albums).map(([albumName, tracks]) => (
          <div key={albumName} className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-green-500 pb-2">
              {albumName}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-green-500/20"
                >
                  {track.imagenUrl && (
                    <img
                      src={track.imagenUrl}
                      alt={track.titulo}
                      className="w-full h-56 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {track.titulo}
                    </h4>
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
                        className="text-sm text-green-400 hover:text-green-300"
                      >
                        Escuchar en Spotify →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-12">
          <Link
            to="/"
            className="px-6 py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}

export default MusicaCompleta;
