import { useEffect, useState } from "react";
import { getEventos } from "../services/eventos";

function Shows() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventos().then((data) => {
      setEventos(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="text-center text-gray-400 py-20">Cargando shows...</p>;
  }

  if (eventos.length === 0) {
    return (
      <p className="text-center text-gray-500 py-20">
        No hay shows disponibles.
      </p>
    );
  }

  return (
    <section
      id="shows"
      className="relative py-16 px-4 sm:px-6 md:px-10 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/fondoNegro.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      <div className="relative max-w-5xl mx-auto text-white">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-yellow-400 mb-10 sm:mb-12 tracking-widest">
          SHOWS
        </h2>

        <div className="space-y-6">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="flex flex-col md:flex-row items-center md:items-stretch justify-between bg-black bg-opacity-60 rounded-xl border border-gray-700 shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Imagen del evento */}
              {evento.imagenUrl && (
                <div className="w-full md:w-1/3">
                  <img
                    src={evento.imagenUrl}
                    alt={evento.nombre}
                    className="w-full h-56 object-cover md:h-full md:rounded-none md:rounded-l-xl"
                  />
                </div>
              )}

              {/* Info del evento */}
              <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-red-500 mb-2 uppercase">
                  {evento.nombre}
                </h3>

                <p className="text-gray-300 mb-2 text-sm sm:text-base">
                  📍 {evento.ciudad} — {evento.lugar}
                </p>

                <p className="text-gray-400 mb-3 text-sm sm:text-base">
                  🗓️{" "}
                  {new Date(evento.fechaEvento).toLocaleString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-4 whitespace-pre-line">
                  {evento.descripcion}
                </p>

                <div className="mt-auto">
                  <a
                    href={evento.linkCompra || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-md transition-all duration-200 text-sm"
                  >
                    COMPRA
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-10 italic">
          Mantente al día con LAS BESTIAS ⚡
        </p>
      </div>
    </section>
  );
}

export default Shows;
