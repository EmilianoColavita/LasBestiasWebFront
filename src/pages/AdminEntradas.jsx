import { useEffect, useState, useMemo } from "react";
import { getEntradas } from "../services/entradas";
import ScannerQR from "../components/ScannerQR";
import EntradasTable from "../components/EntradasTable";
import ExportButtons from "../components/ExportButtons";
import InvitadosEvento from "../components/InvitadosEvento";

export default function AdminEntradas() {

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [entradas, setEntradas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [mostrarInvitados, setMostrarInvitados] = useState(false);

  const cargarEventos = useMemo(() => async () => {
    const res = await fetch(`${BASE_URL}/api/eventos`);
    const data = await res.json();
    setEventos(data);
  }, [BASE_URL]);

  const cargarEntradas = useMemo(() => async () => {
    const data = await getEntradas();
    setEntradas(data);
  }, []);

  useEffect(() => {
    cargarEventos();
    cargarEntradas();
  }, []);

  // 🔒 SOLO ENTRADAS DE EVENTOS EXISTENTES
  const entradasActivas = useMemo(() => {
    return entradas.filter((entrada) =>
      eventos.some((evento) => evento.id === entrada.eventoId)
    );
  }, [entradas, eventos]);

  // 🔎 FILTRO POR EVENTO
  // SI NO HAY EVENTO SELECCIONADO → NO MOSTRAR NADA
  const entradasFiltradasPorEvento = useMemo(() => {

    if (eventoSeleccionado === "") {
      return [];
    }

    return entradasActivas.filter(
      (e) => e.eventoId === Number(eventoSeleccionado)
    );

  }, [eventoSeleccionado, entradasActivas]);
  
  // 🔎 BUSCADOR + ORDEN POR FECHA MÁS NUEVA
  const entradasFiltradas = entradasFiltradasPorEvento
    .filter((e) =>
      e.nombreComprador.toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) =>
      new Date(b.fechaCompra) - new Date(a.fechaCompra)
    );

  // 💸 RESUMEN POR PRECIO
  const resumenPrecios = useMemo(() => {
    const mapa = {};

    entradasFiltradasPorEvento.forEach(e => {
      const precio = e.precioPagado || 0;

      if (!mapa[precio]) {
        mapa[precio] = {
          cantidad: 0,
          total: 0
        };
      }

      mapa[precio].cantidad++;
      mapa[precio].total += precio;
    });

    return mapa;
  }, [entradasFiltradasPorEvento]);

  // 📊 ESTADISTICAS SOLO DEL EVENTO SELECCIONADO
  const estadisticas = useMemo(() => {

    if (eventoSeleccionado === "todos") return null;

    const usadas = entradasFiltradasPorEvento.filter(e => e.usada).length;
    const pendientes = entradasFiltradasPorEvento.filter(e => !e.usada).length;

    return {
      usadas,
      pendientes
    };

  }, [entradasFiltradasPorEvento, eventoSeleccionado]);

  // 📊 RESUMEN POR EVENTO
  const resumenEventos = useMemo(() => {

    return eventos.map((evento) => {

      const entradasEvento = entradasActivas.filter(
        (e) => e.eventoId === evento.id
      );

      const vendidas = entradasEvento.length;
      const usadas = entradasEvento.filter(e => e.usada).length;
      const pendientes = vendidas - usadas;

      const ocupacion = vendidas > 0
        ? Math.round((usadas / vendidas) * 100)
        : 0;

      const totalRecaudado = entradasEvento.reduce((acc, e) => {
        return acc + (e.precioPagado || 0);
      }, 0);

      return {
        ...evento,
        vendidas,
        usadas,
        pendientes,
        ocupacion,
        totalRecaudado
      };

    });

  }, [entradasActivas, eventos]);

  // 💰 TOTAL GENERAL
  const totalGeneral = Object.values(resumenPrecios)
    .reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="text-gray-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <h1 className="text-xl md:text-2xl font-bold text-yellow-400 mb-6">
        Entradas Vendidas 🎟️
      </h1>

      {/* 📊 ESTADISTICAS SOLO CUANDO SE SELECCIONA EVENTO */}
      {eventoSeleccionado !== "todos" && estadisticas && (
        <div className="grid grid-cols-2 gap-4 mb-6">

          <div className="bg-green-700 p-4 rounded-lg text-center">
            <p className="text-sm text-green-200">Ingresaron</p>
            <p className="text-2xl font-bold">{estadisticas.usadas}</p>
          </div>

          <div className="bg-red-700 p-4 rounded-lg text-center">
            <p className="text-sm text-red-200">Pendientes</p>
            <p className="text-2xl font-bold">{estadisticas.pendientes}</p>
          </div>

        </div>
      )}

      <ScannerQR onValidacionExitosa={cargarEntradas} />

      {/* BOTON RESUMEN */}
      <div className="mb-4">
        <button
          onClick={() => setMostrarResumen(!mostrarResumen)}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg transition"
        >
          {mostrarResumen ? "Ocultar resumen ▲" : "Ver resumen por evento ▼"}
        </button>
      </div>

      {/* RESUMEN EVENTOS */}
      {mostrarResumen && (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 mb-6">

          <h2 className="text-yellow-400 font-bold mb-4">
            Resumen por Evento
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            {resumenEventos.map((ev) => (

              <div
                key={ev.id}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700"
              >

                <p className="text-yellow-400 font-semibold">
                  {ev.nombre}
                </p>

                <p className="text-sm text-gray-400">
                  🎟️ Vendidas:{" "}
                  <span className="text-white font-bold">
                    {ev.vendidas}
                  </span>
                </p>

                <p className="text-sm text-gray-400">
                  ✅ Ingresaron:{" "}
                  <span className="text-green-400 font-bold">
                    {ev.usadas}
                  </span>
                </p>

                <p className="text-sm text-gray-400">
                  ⏳ Pendientes:{" "}
                  <span className="text-red-400 font-bold">
                    {ev.pendientes}
                  </span>
                </p>

                <p className="text-sm text-gray-400">
                  📊 Ocupación:{" "}
                  <span className="text-yellow-400 font-bold">
                    {ev.ocupacion}%
                  </span>
                </p>

                <p className="text-sm text-gray-400">
                  💰 Recaudado:{" "}
                  <span className="text-green-400 font-bold">
                    ${ev.totalRecaudado.toLocaleString("es-AR")}
                  </span>
                </p>

              </div>

            ))}

          </div>

          {/* 💸 RESUMEN POR PRECIO */}
          {eventoSeleccionado !== "todos" && (
            <div className="mt-6">

              <h3 className="text-yellow-400 font-bold mb-2">
                💸 Ventas por precio
              </h3>

              {Object.entries(resumenPrecios)
                .sort((a, b) => Number(a[0]) - Number(b[0]))
                .map(([precio, data]) => (
                  <p key={precio} className="text-sm text-gray-300">
                    ${Number(precio).toLocaleString("es-AR")} → {data.cantidad} entradas | 💰 $
                    {data.total.toLocaleString("es-AR")}
                  </p>
                ))}

              <p className="mt-3 text-lg font-bold text-green-400">
                TOTAL: ${totalGeneral.toLocaleString("es-AR")}
              </p>

            </div>
          )}

        </div>
      )}

      {/* FILTRO EVENTO */}
      <div className="mb-4 bg-gray-800 p-4 rounded-lg border border-gray-700">

        <label className="block text-sm mb-2">
          Filtrar por evento:
        </label>

        <select
          value={eventoSeleccionado}
          onChange={(e) => setEventoSeleccionado(e.target.value)}
          className="bg-gray-900 border border-gray-700 p-3 rounded w-full text-gray-200"
        >
          <option value="todos">Seleccionar evento</option>

          {eventos.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.nombre} - {ev.ciudad}
            </option>
          ))}

        </select>
      </div>

      {/* BUSCADOR */}
      {eventoSeleccionado !== "todos" && (
        <div className="mb-6">

          <input
            type="text"
            placeholder="Buscar por nombre del comprador..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-gray-200"
          />

        </div>
      )}

      {/* MENSAJE VACÍO */}
      {eventoSeleccionado === "todos" && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center text-gray-400">
          Seleccioná un evento para ver las entradas vendidas 🎟️
        </div>
      )}

      {/* TABLA */}
      {eventoSeleccionado !== "todos" && (
        <>
          <ExportButtons entradas={entradasFiltradas} eventos={eventos} />

          <EntradasTable
            entradas={entradasFiltradas}
            eventos={eventos}
          />
        </>
      )}

      {/* INVITADOS */}
      {eventoSeleccionado !== "todos" && (
        <div className="mt-6">
          <button
            onClick={() => setMostrarInvitados(!mostrarInvitados)}
            className="text-xs text-gray-400 hover:text-gray-300 underline underline-offset-2"
          >
            {mostrarInvitados ? "Ocultar lista de invitados" : "Ver lista de invitados"}
          </button>

          {mostrarInvitados && (
            <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 mt-3">
              <h2 className="text-yellow-400 font-bold text-lg mb-4">
                Lista de Invitados 🧾
              </h2>

              <InvitadosEvento eventoId={Number(eventoSeleccionado)} />
            </div>
          )}
        </div>
      )}

    </div>
  );
}