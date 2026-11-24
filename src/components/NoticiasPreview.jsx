import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNoticias } from "../services/noticias";
import { ordenarPorFecha } from "../utils/noticias";
import NoticiaCard, { NoticiaCardSkeleton } from "./NoticiaCard";
import SectionHeader from "./ui/SectionHeader";
import Reveal from "./ui/Reveal";
import ArrowIcon from "./ui/ArrowIcon";

const CANTIDAD = 4;

function NoticiasPreview() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNoticias().then((data) => {
      const ordenadas = ordenarPorFecha(data);
      // La más reciente ya se presenta en el Hero: acá se muestran las siguientes.
      // Si solo existe una noticia, se muestra igual para no dejar la sección vacía.
      const siguientes = ordenadas.length > 1 ? ordenadas.slice(1) : ordenadas;
      setNoticias(siguientes.slice(0, CANTIDAD));
      setLoading(false);
    });
  }, []);

  return (
    <section id="noticias" className="grain relative overflow-hidden bg-black py-20 md:py-28">
      {/* Fotografía original de la banda como textura de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.18]"
        style={{ backgroundImage: "url('/images/fondo4.JPEG')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black via-night-950/90 to-black"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="Novedades"
          title="Noticias"
          action={
            <Link to="/noticias" className="btn-outline group">
              Ver todas
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: CANTIDAD }).map((_, i) => <NoticiaCardSkeleton key={i} />)
            : noticias.map((noticia, i) => (
                <Reveal key={noticia.id} delay={i * 0.08} className="h-full">
                  <NoticiaCard noticia={noticia} />
                </Reveal>
              ))}
        </div>

        {!loading && noticias.length === 0 && (
          <p className="text-center text-white/50">No hay noticias disponibles.</p>
        )}
      </div>
    </section>
  );
}

export default NoticiasPreview;
