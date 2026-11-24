import { useEffect, useState } from "react";
import { getNoticias } from "../services/noticias";
import { ordenarPorFecha } from "../utils/noticias";
import NoticiaCard, { NoticiaCardSkeleton } from "../components/NoticiaCard";
import SectionHeader from "../components/ui/SectionHeader";
import Reveal from "../components/ui/Reveal";

function NoticiasPage() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNoticias().then((data) => {
      setNoticias(ordenarPorFecha(data));
      setLoading(false);
    });
  }, []);

  return (
    <div className="grain relative min-h-screen overflow-hidden bg-black py-16 md:py-24">
      <div
        className="absolute inset-x-0 top-0 h-[28rem] bg-gradient-to-b from-night-800/60 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader eyebrow="Las Bestias" title="Noticias" as="h1" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <NoticiaCardSkeleton key={i} />)
            : noticias.map((noticia, i) => (
                <Reveal key={noticia.id} delay={(i % 4) * 0.06} className="h-full">
                  <NoticiaCard noticia={noticia} />
                </Reveal>
              ))}
        </div>

        {!loading && noticias.length === 0 && (
          <p className="mt-10 text-center text-white/50">No hay noticias disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default NoticiasPage;
