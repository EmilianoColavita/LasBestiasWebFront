import { useEffect, useState } from "react";
import { getNoticias } from "../services/noticias";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Hero() {
  const [ultimaNoticia, setUltimaNoticia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNoticias().then((data) => {
      if (data && data.length > 0) {
        const ordenadas = [...data].sort(
          (a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
        );
        setUltimaNoticia(ordenadas[0]);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        Cargando...
      </section>
    );
  }

  if (!ultimaNoticia) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        No hay noticias disponibles.
      </section>
    );
  }

  return (
    <section
      className="min-h-screen bg-cover bg-center flex items-center justify-center md:justify-start md:pl-[10%] px-4 text-center md:text-left relative"
      style={{ backgroundImage: "url('/images/fondo1.png')" }}
    >
      {/* Logo animado - centrado correctamente en horizontal */}
      <motion.div
        className="absolute top-6 left-0 right-0 flex justify-center md:hidden z-20 pointer-events-none"
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <img
          src="/images/logo.png"
          alt="Logo de la banda"
          className="w-28 h-auto object-contain"
          style={{ imageRendering: "auto" }}
        />
      </motion.div>

      {/* Cuadro de noticia: desplazamos un poco hacia abajo en móvil para evitar solapamiento con el logo */}
      <div className="bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl p-6 w-full max-w-sm sm:max-w-md md:max-w-lg mt-20 md:mt-0 relative z-10">
        <img
          src={ultimaNoticia.imagenUrl}
          alt={ultimaNoticia.titulo}
          className="rounded-xl mb-4 w-full h-auto max-h-96 object-contain"
        />
        <h3 className="text-xl font-bold text-yellow-400 mb-2">
          {ultimaNoticia.titulo}
        </h3>

        <p className="text-xs text-gray-400 mb-2">
          {new Date(ultimaNoticia.fechaPublicacion).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <p className="text-gray-300 mb-4 text-sm">{ultimaNoticia.descripcion}</p>

        <Link
          to={`/noticia/${ultimaNoticia.id}`}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md text-sm"
        >
          Ver más
        </Link>
      </div>
    </section>
  );
}

export default Hero;
