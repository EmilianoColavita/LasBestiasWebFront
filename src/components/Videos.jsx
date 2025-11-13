import { useEffect, useState } from "react";

function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/videos/recientes`);
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error al obtener los videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [BASE_URL]);

  if (loading) {
    return (
      <section className="py-20 bg-black text-center text-gray-400">
        Cargando videos...
      </section>
    );
  }

  if (!videos.length) {
    return (
      <section className="py-20 bg-black text-center text-red-500">
        No se pudieron cargar los videos.
      </section>
    );
  }

  // Primer video como principal
  const [principal, ...otros] = videos;

  return (
    <section
      id="videos"
      className="relative py-20 px-8 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/fondo2.png')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-yellow-400 mb-10">
          Último Video
        </h2>

        {/* Video principal */}
        <div className="flex justify-center mb-12">
          <div className="aspect-w-16 aspect-h-9 w-full md:w-3/4 lg:w-2/3">
            <iframe
              className="rounded-2xl shadow-2xl w-full h-[400px]"
              src={`https://www.youtube.com/embed/${principal.videoId}`}
              title={principal.titulo || "Último video"}
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <h3 className="text-2xl text-white font-semibold mb-10">
          {principal.titulo}
        </h3>

        {/* Otros 3 videos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {otros.slice(0, 3).map((video) => (
            <div key={video.videoId} className="bg-gray-900 bg-opacity-80 rounded-xl shadow-lg p-3">
              <iframe
                className="rounded-lg w-full h-48"
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title={video.titulo}
                allowFullScreen
              ></iframe>
              <h4 className="text-yellow-400 font-bold text-sm mt-3">{video.titulo}</h4>
            </div>
          ))}
        </div>

        <a
          href="https://www.youtube.com/@lasbestias7520"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
        >
          Ver más videos →
        </a>
      </div>
    </section>
  );
}

export default Videos;
