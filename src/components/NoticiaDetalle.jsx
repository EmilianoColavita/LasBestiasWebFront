import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function NoticiaDetalle() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/api/noticias/${id}`)
      .then(res => res.json())
      .then(data => {
        setNoticia(data);
        setLoading(false);
      })
      .catch(err => console.error("Error cargando noticia:", err));
  }, [id, BASE_URL]);

  if (loading) {
    return <p className="text-center text-gray-400 mt-20">Cargando noticia...</p>;
  }

  if (!noticia) {
    return <p className="text-center text-red-500 mt-20">No se encontró la noticia</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-8 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <img
          src={noticia.imagenUrl}
          alt={noticia.titulo}
          className="w-full h-auto max-h-[80vh] object-contain rounded-2xl mb-8"
        />
        <h1 className="text-4xl font-extrabold text-yellow-400 mb-4">{noticia.titulo}</h1>
        
        <p className="text-sm text-gray-400 mb-6">
          Publicado el{" "}
          {new Date(noticia.fechaPublicacion).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        
        <div className="text-gray-300 text-lg leading-relaxed mb-12 prose prose-invert max-w-none">
          <ReactMarkdown>
            {noticia.descripcion}
          </ReactMarkdown>
        </div>

        <Link
          to="/"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md"
        >
          ← Volver
        </Link>
      </div>
    </div>
  );
}

export default NoticiaDetalle;
