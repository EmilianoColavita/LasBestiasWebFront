import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Ticket,
  UserCheck,
  Clock,
  Wallet,
  Search,
  ChevronDown,
  BarChart3,
  Users,
} from "lucide-react";
import { getEntradas } from "../services/entradas";
import ScannerQR from "../components/ScannerQR";
import EntradasTable from "../components/EntradasTable";
import ExportButtons from "../components/ExportButtons";
import InvitadosEvento from "../components/InvitadosEvento";
import {
  PageHeader,
  Panel,
  StatCard,
  EmptyState,
  formatMoney,
} from "../components/admin/AdminUI";

export default function AdminEntradas() {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [searchParams] = useSearchParams();

  const [entradas, setEntradas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [mostrarInvitados, setMostrarInvitados] = useState(false);

  const cargarEventos = useMemo(
    () => async () => {
      const res = await fetch(`${BASE_URL}/api/eventos`);
      const data = await res.json();
      setEventos(data);
    },
    [BASE_URL]
  );

  const cargarEntradas = useMemo(
    () => async () => {
      const data = await getEntradas();
      setEntradas(data);
    },
    []
  );

  useEffect(() => {
    cargarEventos();
    cargarEntradas();
  }, [cargarEventos, cargarEntradas]);

  // 🔒 SOLO ENTRADAS DE EVENTOS EXISTENTES
  const entradasActivas = useMemo(() => {
    return entradas.filter((entrada) => eventos.some((evento) => evento.id === entrada.eventoId));
  }, [entradas, eventos]);

  // 🔎 FILTRO POR EVENTO
  const entradasFiltradasPorEvento = useMemo(() => {
    if (eventoSeleccionado === "") {
      return [];
    }
    return entradasActivas.filter((e) => e.eventoId === Number(eventoSeleccionado));
  }, [eventoSeleccionado, entradasActivas]);

  // 🔎 BUSCADOR + ORDEN POR FECHA MÁS NUEVA
  const entradasFiltradas = entradasFiltradasPorEvento
    .filter((e) => e.nombreComprador.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra));

  // 💸 RESUMEN POR PRECIO
  const resumenPrecios = useMemo(() => {
    const mapa = {};
    entradasFiltradasPorEvento.forEach((e) => {
      const precio = e.precioPagado || 0;
      if (!mapa[precio]) {
        mapa[precio] = { cantidad: 0, total: 0 };
      }
      mapa[precio].cantidad++;
      mapa[precio].total += precio;
    });
    return mapa;
  }, [entradasFiltradasPorEvento]);

  // 📊 ESTADISTICAS SOLO DEL EVENTO SELECCIONADO
  const estadisticas = useMemo(() => {
    if (eventoSeleccionado === "todos") return null;
    const usadas = entradasFiltradasPorEvento.filter((e) => e.usada).length;
    const pendientes = entradasFiltradasPorEvento.filter((e) => !e.usada).length;
    return { usadas, pendientes };
  }, [entradasFiltradasPorEvento, eventoSeleccionado]);

  // 📊 RESUMEN POR EVENTO
  const resumenEventos = useMemo(() => {
    return eventos.map((evento) => {
      const entradasEvento = entradasActivas.filter((e) => e.eventoId === evento.id);
      const vendidas = entradasEvento.length;
      const usadas = entradasEvento.filter((e) => e.usada).length;
      const pendientes = vendidas - usadas;
      const ocupacion = vendidas > 0 ? Math.round((usadas / vendidas) * 100) : 0;
      const totalRecaudado = entradasEvento.reduce((acc, e) => acc + (e.precioPagado || 0), 0);
      return { ...evento, vendidas, usadas, pendientes, ocupacion, totalRecaudado };
    });
  }, [entradasActivas, eventos]);

  // 💰 TOTAL GENERAL
  const totalGeneral = Object.values(resumenPrecios).reduce((acc, item) => acc + item.total, 0);

  const haySeleccion = eventoSeleccionado !== "todos";

  return (
    <div>
      <PageHeader
        eyebrow="Ventas"
        title="Entradas"
        description="Control de entradas vendidas, ingresos y lista de invitados por evento."
      />

      {/* Escáner QR */}
      <ScannerQR onValidacionExitosa={cargarEntradas} autoStart={!!searchParams.get("scan")} />

      {/* Selector de evento */}
      <Panel className="mb-6">
        <label className="form-label" htmlFor="evento">
          Evento
        </label>
        <div className="relative">
          <select
            id="evento"
            value={eventoSeleccionado}
            onChange={(e) => setEventoSeleccionado(e.target.value)}
            className="form-input appearance-none pr-10 [color-scheme:dark]"
          >
            <option value="todos">Seleccionar evento</option>
            {eventos.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.nombre} - {ev.ciudad}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40" />
        </div>
      </Panel>

      {/* 📊 ESTADISTICAS DEL EVENTO */}
      {haySeleccion && estadisticas && (
        <div className="mb-6 grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
          <StatCard label="Vendidas" value={entradasFiltradasPorEvento.length} icon={Ticket} />
          <StatCard label="Ingresaron" value={estadisticas.usadas} icon={UserCheck} accent="green" />
          <StatCard label="Pendientes" value={estadisticas.pendientes} icon={Clock} accent="red" />
          <StatCard label="Recaudado" value={formatMoney(totalGeneral)} icon={Wallet} accent="blue" />
        </div>
      )}

      {/* RESUMEN POR EVENTO (colapsable) */}
      <div className="mb-6">
        <button
          onClick={() => setMostrarResumen(!mostrarResumen)}
          className="btn-outline btn-sm"
          aria-expanded={mostrarResumen}
        >
          <BarChart3 size={14} />
          {mostrarResumen ? "Ocultar resumen" : "Ver resumen por evento"}
          <ChevronDown size={14} className={`transition-transform ${mostrarResumen ? "rotate-180" : ""}`} />
        </button>

        {mostrarResumen && (
          <Panel title="Resumen por evento" className="mt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {resumenEventos.map((ev) => (
                <div key={ev.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <p className="truncate font-semibold text-bestia">{ev.nombre}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                    <dt className="text-white/50">Vendidas</dt>
                    <dd className="text-right font-bold text-white">{ev.vendidas}</dd>
                    <dt className="text-white/50">Ingresaron</dt>
                    <dd className="text-right font-bold text-emerald-400">{ev.usadas}</dd>
                    <dt className="text-white/50">Pendientes</dt>
                    <dd className="text-right font-bold text-red-400">{ev.pendientes}</dd>
                    <dt className="text-white/50">Recaudado</dt>
                    <dd className="text-right font-bold text-white">{formatMoney(ev.totalRecaudado)}</dd>
                  </dl>
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-[11px] uppercase tracking-wider text-white/40">
                      <span>Ocupación</span>
                      <span className="text-bestia">{ev.ocupacion}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-bestia" style={{ width: `${ev.ocupacion}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 💸 RESUMEN POR PRECIO */}
            {haySeleccion && (
              <div className="mt-6 border-t border-white/10 pt-5">
                <h3 className="form-label">Ventas por precio (evento seleccionado)</h3>
                <ul className="space-y-1.5 text-sm text-white/70">
                  {Object.entries(resumenPrecios)
                    .sort((a, b) => Number(a[0]) - Number(b[0]))
                    .map(([precio, data]) => (
                      <li key={precio} className="flex flex-wrap justify-between gap-2">
                        <span>
                          {formatMoney(precio)} × {data.cantidad} entradas
                        </span>
                        <span className="font-semibold text-white">{formatMoney(data.total)}</span>
                      </li>
                    ))}
                </ul>
                <p className="mt-3 flex justify-between font-display text-2xl tracking-wide text-bestia">
                  <span>Total</span>
                  <span>{formatMoney(totalGeneral)}</span>
                </p>
              </div>
            )}
          </Panel>
        )}
      </div>

      {/* MENSAJE VACÍO */}
      {!haySeleccion && (
        <EmptyState
          icon={Ticket}
          title="Seleccioná un evento"
          text="Elegí un evento para ver las entradas vendidas, exportarlas y gestionar invitados."
        />
      )}

      {/* LISTADO */}
      {haySeleccion && (
        <>
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Buscar por nombre del comprador..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="form-input pl-11"
              />
            </div>
            <ExportButtons entradas={entradasFiltradas} eventos={eventos} />
          </div>

          <EntradasTable entradas={entradasFiltradas} eventos={eventos} />

          {/* INVITADOS */}
          <div className="mt-6">
            <button
              onClick={() => setMostrarInvitados(!mostrarInvitados)}
              className="btn-outline btn-sm"
              aria-expanded={mostrarInvitados}
            >
              <Users size={14} />
              {mostrarInvitados ? "Ocultar lista de invitados" : "Ver lista de invitados"}
              <ChevronDown size={14} className={`transition-transform ${mostrarInvitados ? "rotate-180" : ""}`} />
            </button>

            {mostrarInvitados && (
              <Panel title="Lista de invitados" className="mt-4">
                <InvitadosEvento eventoId={Number(eventoSeleccionado)} />
              </Panel>
            )}
          </div>
        </>
      )}
    </div>
  );
}
