import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNoticias } from "../services/noticias";

function NoticiasPreview() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNoticias().then((data) => {
      const ordenadas = [...data].sort(
        (a, b) =>
          new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
      );

      setNoticias(ordenadas.slice(0, 4)); // SOLO 4
      setLoading(false);
    });
  }, []);

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <p className="text-center text-gray-400">
        Cargando noticias...
      </p>
    );
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {noticias.map((noticia) => (
            <div
              key={noticia.id}
              className="bg-gray-900/90 rounded-xl shadow-lg p-4
                         hover:scale-105 transform transition duration-300
                         flex flex-col"
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

        {/* BOTÓN VER TODAS */}
        <div className="flex justify-center mt-10">
          <Link
            to="/noticias"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition"
          >
            Ver todas las noticias
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NoticiasPreview;