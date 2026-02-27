import { useEffect, useState, useMemo } from "react";
import { getEntradas } from "../services/entradas";
import ScannerQR from "../components/ScannerQR";
import EntradasTable from "../components/EntradasTable";
import ExportButtons from "../components/ExportButtons";

export default function AdminEntradas() {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [entradas, setEntradas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [mostrarResumen, setMostrarResumen] = useState(false);

  const cargarEventos = async () => {
    const res = await fetch(`${BASE_URL}/api/eventos`);
    const data = await res.json();
    setEventos(data);
  };

  const cargarEntradas = async () => {
    const data = await getEntradas();
    setEntradas(data);
  };

  useEffect(() => {
    cargarEventos();
    cargarEntradas();
  }, []);

  // 🔎 FILTRO POR EVENTO
  const entradasFiltradasPorEvento =
    eventoSeleccionado === "todos"
      ? entradas
      : entradas.filter((e) => e.eventoId === Number(eventoSeleccionado));

  // 🔎 BUSCADOR POR NOMBRE
  const entradasFiltradas = entradasFiltradasPorEvento.filter((e) =>
    e.nombreComprador.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 📊 RESUMEN POR EVENTO
  const resumenEventos = useMemo(() => {
    return eventos.map((evento) => {
      const entradasEvento = entradas.filter(
        (e) => e.eventoId === evento.id
      );

      const cantidadVendidas = entradasEvento.length;
      const totalRecaudado = cantidadVendidas * (evento.precio || 0);

      return {
        ...evento,
        cantidadVendidas,
        totalRecaudado,
      };
    });
  }, [entradas, eventos]);

  return (
    <div className="text-gray-200">

      <h1 className="text-xl md:text-2xl font-bold text-yellow-400 mb-6">
        Entradas Vendidas 🎟️
      </h1>

      <ScannerQR onValidacionExitosa={cargarEntradas} />

      {/* 🔘 BOTÓN MOSTRAR/OCULTAR RESUMEN */}
      <div className="mb-4">
        <button
          onClick={() => setMostrarResumen(!mostrarResumen)}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg transition"
        >
          {mostrarResumen ? "Ocultar resumen ▲" : "Ver resumen por evento ▼"}
        </button>
      </div>

      {/* 📊 RESUMEN DESPLEGABLE */}
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
                    {ev.cantidadVendidas}
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
        </div>
      )}

      {/* 🎫 FILTRO POR EVENTO */}
      <div className="mb-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
        <label className="block text-sm mb-2">
          Filtrar por evento:
        </label>
        <select
          value={eventoSeleccionado}
          onChange={(e) => setEventoSeleccionado(e.target.value)}
          className="bg-gray-900 border border-gray-700 p-3 rounded w-full text-gray-200"
        >
          <option value="todos">Todos los eventos</option>
          {eventos.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.nombre} - {ev.ciudad}
            </option>
          ))}
        </select>
      </div>

      {/* 🔎 BUSCADOR */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre del comprador..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-gray-200"
        />
      </div>

      <ExportButtons entradas={entradasFiltradas} eventos={eventos} />

      <EntradasTable entradas={entradasFiltradas} eventos={eventos} />
    </div>
  );
}