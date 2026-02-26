import { useEffect, useState } from "react";
import { getEntradas } from "../services/entradas";
import ScannerQR from "../components/ScannerQR";
import EntradasTable from "../components/EntradasTable";
import ExportButtons from "../components/ExportButtons";

export default function AdminEntradas() {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [entradas, setEntradas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("todos");

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

  const entradasFiltradas =
    eventoSeleccionado === "todos"
      ? entradas
      : entradas.filter((e) => e.eventoId === Number(eventoSeleccionado));

  return (
    <div className="text-gray-200">

      <h1 className="text-xl md:text-2xl font-bold text-yellow-400 mb-6">
        Entradas Vendidas 🎟️
      </h1>

      <ScannerQR onValidacionExitosa={cargarEntradas} />

      <div className="mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
        <label className="block text-sm mb-2">Filtrar por evento:</label>
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

      <ExportButtons entradas={entradasFiltradas} eventos={eventos} />

      <EntradasTable entradas={entradasFiltradas} eventos={eventos} />
    </div>
  );
}