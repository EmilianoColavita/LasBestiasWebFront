import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNoticias } from "../services/noticias";

function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNoticias().then((data) => {
      setNoticias(data);
      setLoading(false);
    });
  }, []);

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return <p className="text-center text-gray-400">Cargando noticias...</p>;
  }

  return (
    <section
      id="noticias"
      className="relative py-20 px-6 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/fondo4.JPEG')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-yellow-400 mb-12">
          Noticias
        </h2>

        <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
          {noticias.map((noticia) => (
            <div
              key={noticia.id}
              className="min-w-[280px] sm:min-w-[300px] md:min-w-[320px] max-w-[320px]
                         bg-gray-900/90 rounded-xl shadow-lg p-4
                         hover:scale-105 transform transition duration-300
                         flex flex-col snap-start"
            >
              <img
                src={noticia.imagenUrl}
                alt={noticia.titulo}
                className="rounded-lg mb-4 w-full h-48 object-cover"
              />

              <h3 className="text-lg font-bold text-red-500 mb-2">
                {noticia.titulo}
              </h3>

              <p className="text-xs text-gray-400 mb-3">
                {new Date(noticia.fechaPublicacion).toLocaleDateString(
                  "es-ES",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>

              <p className="text-gray-300 text-sm mb-4">
                {truncateText(noticia.descripcion, 120)}
              </p>

              <Link
                to={`/noticia/${noticia.id}`}
                className="text-yellow-400 hover:text-yellow-500 font-semibold text-sm mt-auto"
              >
                Leer más →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Noticias;