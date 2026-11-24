import { Link } from "react-router-dom";
import { formatFecha, extracto, getCategoria } from "../utils/noticias";
import ArrowIcon from "./ui/ArrowIcon";

// Tarjeta de noticia reutilizada en Home y en /noticias
export default function NoticiaCard({ noticia }) {
  const categoria = getCategoria(noticia);

  return (
    <article className="surface-card group relative flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:border-bestia/40 hover:shadow-glow">
      <Link
        to={`/noticia/${noticia.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-night-900"
        tabIndex={-1}
        aria-hidden="true"
      >
        {noticia.imagenUrl && (
          <img
            src={noticia.imagenUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {categoria && (
          <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-bestia backdrop-blur">
            {categoria}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <time
          dateTime={noticia.fechaPublicacion}
          className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-white/50"
        >
          {formatFecha(noticia.fechaPublicacion)}
        </time>

        <h3 className="mb-3 font-display text-[1.7rem] leading-[1.05] tracking-wide text-white transition-colors group-hover:text-bestia">
          <Link to={`/noticia/${noticia.id}`} className="after:absolute after:inset-0">
            {noticia.titulo}
          </Link>
        </h3>

        <p className="mb-6 text-sm leading-relaxed text-white/60">
          {extracto(noticia.descripcion, 120)}
        </p>

        <span className="link-arrow mt-auto">
          Leer más <ArrowIcon />
        </span>
      </div>
    </article>
  );
}

export function NoticiaCardSkeleton() {
  return (
    <div className="surface-card overflow-hidden">
      <div className="skeleton aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-6">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-6 w-full" />
        <div className="skeleton h-6 w-2/3" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-5/6" />
      </div>
    </div>
  );
}
