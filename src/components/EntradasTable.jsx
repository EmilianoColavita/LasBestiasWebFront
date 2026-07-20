export default function EntradasTable({ entradas, eventos }) {

  const getEventoNombre = (id) => {
    const ev = eventos.find((e) => e.id === id);
    return ev ? ev.nombre : "Desconocido";
  };

  const estadoEntrada = (entrada) => {
    if (entrada.usada) {
      return (
        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
          Escaneada
        </span>
      );
    }

    return (
      <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
        Pendiente
      </span>
    );
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
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4">Hora ingreso</th>
              <th className="py-3 px-4">Fecha compra</th>
              <th className="py-3 px-4">Monto pagado</th>
            </tr>
          </thead>

          <tbody>
            {entradas.map((e) => (
              <tr key={e.id} className="border-t border-gray-700">

                <td className="py-3 px-4">
                  {getEventoNombre(e.eventoId)}
                </td>

                <td className="py-3 px-4">
                  {e.nombreComprador}
                </td>

                <td className="py-3 px-4">
                  {e.email}
                </td>

                <td className="py-3 px-4">
                  {estadoEntrada(e)}
                </td>

                <td className="py-3 px-4">
                  {e.fechaUso
                    ? new Date(e.fechaUso).toLocaleTimeString("es-AR")
                    : "-"}
                </td>

                <td className="py-3 px-4">
                  {new Date(e.fechaCompra).toLocaleString("es-AR")}
                </td>

                <td className="py-3 px-4 text-green-400 font-semibold">
                  ${Number(e.precioPagado || 0).toLocaleString("es-AR")}
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
              {e.nombreComprador}
            </p>

            <p className="text-gray-400 text-sm">
              {e.email}
            </p>

            <div className="mt-2">
              {estadoEntrada(e)}
            </div>

            {e.fechaUso && (
              <p className="text-green-400 text-xs mt-1">
                Ingresó: {new Date(e.fechaUso).toLocaleTimeString("es-AR")}
              </p>
            )}

            <p className="text-gray-500 text-xs mt-2">
              Compra: {new Date(e.fechaCompra).toLocaleString("es-AR")}
            </p>

            <p className="text-green-400 text-sm font-semibold mt-1">
              💰 ${Number(e.precioPagado || 0).toLocaleString("es-AR")}
            </p>

          </div>
        ))}
      </div>

    </div>
  );
}