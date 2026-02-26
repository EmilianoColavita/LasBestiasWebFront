export default function EntradasTable({ entradas, eventos }) {

  const getEventoNombre = (id) => {
    const ev = eventos.find((e) => e.id === id);
    return ev ? ev.nombre : "Desconocido";
  };

  return (
    <div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-gray-900 p-6 rounded-xl border border-gray-700 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-yellow-400">
            <tr>
              <th className="py-3 px-4">Evento</th>
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Apellido</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Fecha Compra</th>
            </tr>
          </thead>
          <tbody>
            {entradas.map((e) => (
              <tr key={e.id} className="border-t border-gray-700">
                <td className="py-3 px-4">{getEventoNombre(e.eventoId)}</td>
                <td className="py-3 px-4">{e.nombre}</td>
                <td className="py-3 px-4">{e.apellido}</td>
                <td className="py-3 px-4">{e.email}</td>
                <td className="py-3 px-4">
                  {new Date(e.fechaCompra).toLocaleString("es-ES")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {entradas.map((e) => (
          <div
            key={e.id}
            className="bg-gray-900 border border-gray-700 p-4 rounded-xl"
          >
            <p className="text-yellow-400 font-semibold">
              {getEventoNombre(e.eventoId)}
            </p>
            <p className="text-white font-bold text-lg">
              {e.nombre} {e.apellido}
            </p>
            <p className="text-gray-400 text-sm">{e.email}</p>
            <p className="text-gray-500 text-xs mt-2">
              {new Date(e.fechaCompra).toLocaleString("es-ES")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}