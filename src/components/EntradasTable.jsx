import { Badge, formatMoney } from "./admin/AdminUI";

export default function EntradasTable({ entradas, eventos }) {
  const getEventoNombre = (id) => {
    const ev = eventos.find((e) => e.id === id);
    return ev ? ev.nombre : "Desconocido";
  };

  const estadoEntrada = (entrada) =>
    entrada.usada ? <Badge tone="green">Escaneada</Badge> : <Badge tone="red">Pendiente</Badge>;

  if (entradas.length === 0) {
    return (
      <div className="surface-card px-6 py-10 text-center text-sm text-white/40">
        No hay entradas para mostrar.
      </div>
    );
  }

  return (
    <div>
      {/* DESKTOP TABLE */}
      <div className="surface-card hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[11px] uppercase tracking-widest text-white/50">
              <th className="px-5 py-4 font-semibold">Evento</th>
              <th className="px-5 py-4 font-semibold">Nombre</th>
              <th className="px-5 py-4 font-semibold">Email</th>
              <th className="px-5 py-4 font-semibold">Estado</th>
              <th className="px-5 py-4 font-semibold">Hora ingreso</th>
              <th className="px-5 py-4 font-semibold">Fecha compra</th>
              <th className="px-5 py-4 text-right font-semibold">Monto pagado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {entradas.map((e) => (
              <tr key={e.id} className="transition-colors hover:bg-white/[0.03]">
                <td className="px-5 py-3.5 text-white/60">{getEventoNombre(e.eventoId)}</td>
                <td className="px-5 py-3.5 font-semibold text-white">{e.nombreComprador}</td>
                <td className="px-5 py-3.5 text-white/60">{e.email}</td>
                <td className="px-5 py-3.5">{estadoEntrada(e)}</td>
                <td className="px-5 py-3.5 text-white/60">
                  {e.fechaUso ? new Date(e.fechaUso).toLocaleTimeString("es-AR") : "-"}
                </td>
                <td className="px-5 py-3.5 text-white/60">
                  {new Date(e.fechaCompra).toLocaleString("es-AR")}
                </td>
                <td className="px-5 py-3.5 text-right font-semibold text-white">
                  {formatMoney(e.precioPagado)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="space-y-3 md:hidden">
        {entradas.map((e) => (
          <div key={e.id} className="surface-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold uppercase tracking-widest text-bestia">
                  {getEventoNombre(e.eventoId)}
                </p>
                <p className="mt-1 truncate text-lg font-bold text-white">{e.nombreComprador}</p>
                <p className="truncate text-sm text-white/50">{e.email}</p>
              </div>
              {estadoEntrada(e)}
            </div>

            <div className="mt-3 flex items-end justify-between gap-3 border-t border-white/[0.06] pt-3 text-xs text-white/40">
              <div>
                <p>Compra: {new Date(e.fechaCompra).toLocaleString("es-AR")}</p>
                {e.fechaUso && (
                  <p className="text-emerald-400">
                    Ingresó: {new Date(e.fechaUso).toLocaleTimeString("es-AR")}
                  </p>
                )}
              </div>
              <p className="font-display text-xl tracking-wide text-white">{formatMoney(e.precioPagado)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
