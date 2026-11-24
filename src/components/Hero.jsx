import { useEffect, useState } from "react";
import { getNoticias } from "../services/noticias";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ordenarPorFecha, formatFecha, extracto, getCategoria } from "../utils/noticias";
import ArrowIcon from "./ui/ArrowIcon";

const ease = [0.22, 1, 0.36, 1];

/*
  Fondo original (fondo1.png) con el logo de la banda a la derecha.
  El logo es protagonista: la composición deja libre el tercio derecho
  en desktop para que siempre se vea.
*/
function HeroShell({ children, scrollCue = false }) {
  return (
    <section className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-black pb-20 pt-28 md:pt-32">
      {/*
        En desktop la capa se desplaza a la derecha (left/right +7%) para separar
        el logo del flyer; el borde izquierdo se funde con una máscara.
      */}
      <div
        className="absolute inset-0 bg-cover bg-[position:76%_center] lg:left-[7%] lg:right-[-7%] lg:bg-center lg:[mask-image:linear-gradient(to_right,transparent,black_18%)]"
        style={{ backgroundImage: "url('/images/fondo1.png')" }}
        aria-hidden="true"
      />
      {/* Oscurece solo el lado del texto; el logo queda a la vista */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"
        aria-hidden="true"
      />
      {/* En mobile el logo queda detrás del texto: se atenúa más */}
      <div className="absolute inset-0 bg-black/55 lg:hidden" aria-hidden="true" />
      {/* Toque azul noche */}
      <div
        className="absolute -left-40 top-1/3 h-[32rem] w-[32rem] rounded-full bg-night-600/25 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">{children}</div>

      {scrollCue && (
        <a
          href="#noticias"
          aria-label="Ir a noticias"
          className="absolute bottom-6 left-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 place-items-center rounded-full border border-white/30 text-white/70 transition-colors hover:border-bestia hover:text-bestia lg:grid"
        >
          <svg
            className="h-4 w-4 animate-scroll-cue"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      )}
    </section>
  );
}

function HeroSkeleton() {
  return (
    <HeroShell>
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-5">
          <div className="skeleton h-3 w-40" />
          <div className="skeleton h-16 w-full" />
          <div className="skeleton h-16 w-4/5" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-12 w-40 rounded-full" />
        </div>
        <div className="lg:col-span-3">
          <div className="skeleton mx-auto aspect-[3/4] w-full max-w-[260px] rotate-2" />
        </div>
      </div>
    </HeroShell>
  );
}

function Hero() {
  const [ultimaNoticia, setUltimaNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    getNoticias().then((data) => {
      if (data && data.length > 0) {
        setUltimaNoticia(ordenarPorFecha(data)[0]);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <HeroSkeleton />;

  if (!ultimaNoticia) {
    return (
      <HeroShell>
        <p className="text-white/60">No hay noticias disponibles.</p>
      </HeroShell>
    );
  }

  const categoria = getCategoria(ultimaNoticia);
  const link = `/noticia/${ultimaNoticia.id}`;

  return (
    <HeroShell scrollCue>
      {/*
        Grilla 12 columnas:
        - Desktop: texto (1-5) | flyer (6-8) | logo del fondo libre (9-12)
        - Mobile: encabezado -> flyer -> cuerpo
      */}
      <div className="grid grid-cols-1 items-center gap-x-10 gap-y-8 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
        {/* Encabezado */}
        <motion.header
          className="lg:col-span-5 lg:self-end"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="eyebrow">Última noticia</span>
            {categoria && (
              <span className="rounded-full border border-bestia/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-bestia">
                {categoria}
              </span>
            )}
          </div>

          <h1 className="font-display text-[3.25rem] leading-[0.9] tracking-wide text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] sm:text-7xl xl:text-[5.5rem]">
            <Link to={link} className="transition-colors hover:text-bestia">
              {ultimaNoticia.titulo}
            </Link>
          </h1>

          <time
            dateTime={ultimaNoticia.fechaPublicacion}
            className="mt-5 block font-display text-2xl tracking-wider text-bestia md:text-3xl"
          >
            {formatFecha(ultimaNoticia.fechaPublicacion)}
          </time>
        </motion.header>

        {/* Flyer de la misma noticia: más chico, tipo afiche pegado */}
        <motion.div
          className="flex justify-center lg:col-span-3 lg:col-start-6 lg:row-span-2 lg:row-start-1"
          initial={reduce ? false : { opacity: 0, y: 30, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, ease, delay: 0.15 }}
        >
          <Link
            to={link}
            aria-label={`Leer: ${ultimaNoticia.titulo}`}
            className="group block w-full max-w-[240px] rotate-2 bg-[#efece6] p-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.95)] transition-transform duration-500 ease-out hover:-translate-y-1 hover:rotate-0 sm:max-w-[280px] lg:max-w-none"
          >
            <img
              src={ultimaNoticia.imagenUrl}
              alt={ultimaNoticia.titulo}
              className="block max-h-[62vh] w-full object-contain"
            />
          </Link>
        </motion.div>

        {/* Cuerpo: extracto + CTA */}
        <motion.div
          className="lg:col-span-5 lg:self-start"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.25 }}
        >
          <p className="max-w-md text-base leading-relaxed text-white/75 md:text-lg">
            {extracto(ultimaNoticia.descripcion, 200)}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to={link}
              className="btn group border-2 border-bestia text-white hover:bg-bestia hover:text-black"
            >
              Leer más
              <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link to="/noticias" className="btn-outline">
              Todas las noticias
            </Link>
          </div>
        </motion.div>
      </div>
    </HeroShell>
  );
}

export default Hero;
