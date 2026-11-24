import { useEffect, useState } from "react";
import { FaYoutube } from "react-icons/fa";
import SectionHeader from "./ui/SectionHeader";
import Reveal from "./ui/Reveal";

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
      <section id="videos" className="bg-black py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="skeleton mx-auto aspect-video w-full max-w-4xl rounded-3xl" />
        </div>
      </section>
    );
  }

  if (!videos.length) {
    return (
      <section id="videos" className="bg-black py-20 text-center text-white/50">
        No se pudieron cargar los videos.
      </section>
    );
  }

  const [principal, ...otros] = videos;

  return (
    <section id="videos" className="grain relative overflow-hidden bg-black py-20 md:py-28">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url('/images/fondo2.png')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black via-night-950/85 to-black"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="Videos"
          title="Último video"
          action={
            <a
              href="https://www.youtube.com/@lasbestias7520"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline group"
            >
              <FaYoutube size={16} className="text-red-500" />
              Ver más videos
            </a>
          }
        />

        {/* VIDEO PRINCIPAL */}
        <Reveal className="mx-auto max-w-5xl">
          <div className="relative">
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-bestia/40 via-transparent to-night-600/40" aria-hidden="true" />
            <div className="relative aspect-video overflow-hidden rounded-3xl bg-night-900 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${principal.videoId}`}
                title={principal.titulo || "Último video"}
                allowFullScreen
              ></iframe>
            </div>
          </div>
          {principal.titulo && (
            <h3 className="mt-6 font-display text-3xl tracking-wide text-white md:text-4xl">
              {principal.titulo}
            </h3>
          )}
        </Reveal>

        {/* OTROS VIDEOS */}
        {otros.length > 0 && (
          <div className="no-scrollbar -mx-5 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
            {otros.slice(0, 6).map((video, i) => (
              <Reveal
                key={video.videoId}
                delay={(i % 3) * 0.08}
                className="min-w-[80%] snap-start sm:min-w-[45%] md:min-w-0"
              >
                <div className="surface-card h-full overflow-hidden hover:-translate-y-1 hover:border-bestia/40">
                  <div className="relative aspect-video bg-night-900">
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.titulo}
                      loading="lazy"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <h4 className="p-4 text-sm font-semibold leading-snug text-white/80">
                    {video.titulo}
                  </h4>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Videos;