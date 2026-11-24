import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { motion, useReducedMotion } from "framer-motion";
import { formatFecha, getCategoria } from "../utils/noticias";

function NoticiaDetalle() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const reduce = useReducedMotion();

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/api/noticias/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setNoticia(data))
      .catch((err) => console.error("Error cargando noticia:", err))
      .finally(() => setLoading(false));
  }, [id, BASE_URL]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-5 px-5 py-16">
        <div className="skeleton h-3 w-32" />
        <div className="skeleton h-14 w-full" />
        <div className="skeleton aspect-[4/3] w-full rounded-3xl" />
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-5 text-center">
        <p className="text-white/60">No se encontró la noticia.</p>
        <Link to="/noticias" className="btn-outline">
          Ver todas las noticias
        </Link>
      </div>
    );
  }

  const categoria = getCategoria(noticia);

  return (
    <article className="grain relative min-h-screen overflow-hidden bg-black pb-20">
      <div
        className="absolute inset-x-0 top-0 h-[32rem] bg-gradient-to-b from-night-800/60 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-5 pt-12 sm:px-8 md:pt-16">
        <motion.header
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="eyebrow">Noticia</span>
            {categoria && (
              <span className="rounded-full border border-bestia/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-bestia">
                {categoria}
              </span>
            )}
          </div>
          <h1 className="font-display text-5xl leading-[0.92] tracking-wide text-white md:text-7xl">
            {noticia.titulo}
          </h1>
          <time
            dateTime={noticia.fechaPublicacion}
            className="mt-5 block text-xs font-semibold uppercase tracking-widest text-white/50"
          >
            Publicado el {formatFecha(noticia.fechaPublicacion)}
          </time>
        </motion.header>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative mb-12 overflow-hidden rounded-3xl border border-white/10 bg-night-900"
        >
          <img
            src={noticia.imagenUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
          />
          <img
            src={noticia.imagenUrl}
            alt={noticia.titulo}
            className="relative mx-auto h-auto max-h-[80vh] w-full object-contain"
          />
        </motion.div>

        <div className="prose prose-invert prose-lg mb-14 max-w-none text-white/75 prose-headings:font-display prose-headings:tracking-wide prose-a:text-bestia prose-strong:text-white">
          <ReactMarkdown>{noticia.descripcion}</ReactMarkdown>
        </div>

        <div className="flex flex-wrap gap-4 border-t border-white/10 pt-8">
          <Link to="/" className="btn-outline">
            ← Volver
          </Link>
          <Link to="/noticias" className="btn-primary">
            Más noticias
          </Link>
        </div>
      </div>
    </article>
  );
}

export default NoticiaDetalle;
