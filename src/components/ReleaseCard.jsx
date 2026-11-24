import { FaSpotify, FaPlay } from "react-icons/fa";

// Tarjeta de lanzamiento (Home y /musica). Usa los mismos campos de /api/musica.
export default function ReleaseCard({ track, showTipo = true }) {
  const spotifyHref =
    track.urlSpotify ||
    (track.spotifyId ? `https://open.spotify.com/track/${track.spotifyId}` : null);

  return (
    <article className="surface-card group flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:border-bestia/40 hover:shadow-glow">
      {/* Portada */}
      <div className="relative aspect-square overflow-hidden bg-night-900">
        {track.imagenUrl ? (
          <img
            src={track.imagenUrl}
            alt={`Portada de ${track.titulo}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <img src="/images/logo.png" alt="" className="w-1/4 opacity-20" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0" />

        {showTipo && track.tipo && (
          <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-bestia backdrop-blur">
            {track.tipo}
          </span>
        )}

        {spotifyHref && (
          <a
            href={spotifyHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Escuchar ${track.titulo} en Spotify`}
            className="absolute bottom-4 right-4 grid h-12 w-12 translate-y-2 place-items-center rounded-full bg-bestia text-black opacity-0 shadow-lg transition-all duration-300 hover:scale-110 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100"
          >
            <FaPlay className="ml-0.5" size={14} />
          </a>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-4 font-display text-[1.7rem] leading-none tracking-wide text-white">
          {track.titulo}
        </h3>

        {track.spotifyId && (
          <iframe
            src={`https://open.spotify.com/embed/track/${track.spotifyId}?theme=0`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="mb-4 rounded-xl"
            title={track.titulo}
          ></iframe>
        )}

        {track.urlSpotify && (
          <a
            href={track.urlSpotify}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60 transition-colors hover:text-[#1DB954]"
          >
            <FaSpotify size={16} className="text-[#1DB954]" />
            Escuchar en Spotify
          </a>
        )}
      </div>
    </article>
  );
}
