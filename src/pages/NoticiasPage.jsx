import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNoticias } from "../services/noticias";

function NoticiasPage() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNoticias().then((data) => {
      const ordenadas = [...data].sort(
        (a, b) =>
          new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
      );

      setNoticias(ordenadas);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-400 mt-20">
        Cargando noticias...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-extrabold text-yellow-400 text-center mb-16">
          Noticias
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {noticias.map((noticia) => (
            <div
              key={noticia.id}
              className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition"
            >
              <img
                src={noticia.imagenUrl}
                alt={noticia.titulo}
                className="w-full h-64 object-cover"
              />

              <div className="p-6">
                <h2 className="text-2xl font-bold text-red-500 mb-3">
                  {noticia.titulo}
                </h2>

                <p className="text-sm text-gray-400 mb-4">
                  {new Date(noticia.fechaPublicacion).toLocaleDateString(
                    "es-ES",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>

                <p className="text-gray-300 mb-6">
                  {noticia.descripcion.substring(0, 180)}...
                </p>

                <Link
                  to={`/noticia/${noticia.id}`}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
                >
                  Leer noticia
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default NoticiasPage;