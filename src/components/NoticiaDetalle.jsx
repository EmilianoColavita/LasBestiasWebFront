import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function NoticiaDetalle() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/noticias/${id}`)
      .then(res => res.json())
      .then(data => {
        setNoticia(data);
        setLoading(false);
      })
      .catch(err => console.error("Error cargando noticia:", err));
  }, [id]);

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
          className="rounded-lg mb-4 w-full object-contain max-h-60"
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
        
        <p className="text-gray-300 text-lg leading-relaxed mb-12">
          {noticia.descripcion}
        </p>

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
