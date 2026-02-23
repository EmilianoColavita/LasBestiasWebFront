import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getEntradas } from "../services/entradas";

export default function AdminEntradas() {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [entradas, setEntradas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("todos");

  // Cargar eventos
  const cargarEventos = async () => {
    const res = await fetch(`${BASE_URL}/api/eventos`);
    const data = await res.json();
    setEventos(data);
  };

  // Cargar entradas
  const cargarEntradas = async () => {
    const data = await getEntradas();
    setEntradas(data);
  };

  useEffect(() => {
    cargarEventos();
    cargarEntradas();
  }, []);

  // Filtrar por evento
  const entradasFiltradas =
    eventoSeleccionado === "todos"
      ? entradas
      : entradas.filter((e) => e.eventoId === Number(eventoSeleccionado));

  // Obtener nombre del evento
  const getEventoNombre = (id) => {
    const ev = eventos.find((e) => e.id === id);
    return ev ? ev.nombre : "Desconocido";
  };

  // Exportar CSV
  const exportarCSV = () => {
    const header = [
      "Evento",
      "Nombre",
      "Apellido",
      "Email",
      "Payment ID",
      "Fecha Compra",
    ];

    const rows = entradasFiltradas.map((e) => [
      getEventoNombre(e.eventoId),
      e.nombre,
      e.apellido,
      e.email,
      e.paymentId,
      new Date(e.fechaCompra).toLocaleString("es-ES"),
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "entradas.csv";
    link.click();
  };

  // Exportar Excel
  const exportarExcel = () => {
    const data = entradasFiltradas.map((e) => ({
      Evento: getEventoNombre(e.eventoId),
      Nombre: e.nombre,
      Apellido: e.apellido,
      Email: e.email,
      "Payment ID": e.paymentId,
      "Fecha Compra": new Date(e.fechaCompra).toLocaleString("es-ES"),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Entradas");
    XLSX.writeFile(wb, "entradas.xlsx");
  };

  // Exportar PDF
  const exportarPDF = () => {
    const doc = new jsPDF();

    doc.text("Listado de Entradas", 14, 20);

    const tableData = entradasFiltradas.map((e) => [
      getEventoNombre(e.eventoId),
      e.nombre,
      e.apellido,
      e.email,
      e.paymentId,
      new Date(e.fechaCompra).toLocaleString("es-ES"),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Evento",
          "Nombre",
          "Apellido",
          "Email",
          "Payment ID",
          "Fecha Compra",
        ],
      ],
      body: tableData,
    });

    doc.save("entradas.pdf");
  };

  return (
    <div className="text-gray-200">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">
        Entradas Vendidas 🎟️
      </h1>

      {/* FILTRO */}
      <div className="mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
        <label className="block text-sm mb-2">Filtrar por evento:</label>
        <select
          value={eventoSeleccionado}
          onChange={(e) => setEventoSeleccionado(e.target.value)}
          className="bg-gray-900 border border-gray-700 p-2 rounded w-full text-gray-200"
        >
          <option value="todos">Todos los eventos</option>
          {eventos.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.nombre} - {ev.ciudad}
            </option>
          ))}
        </select>
      </div>

      {/* BOTONES EXPORTAR */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={exportarCSV}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Exportar CSV
        </button>
        <button
          onClick={exportarExcel}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
        >
          Exportar Excel
        </button>
        <button
          onClick={exportarPDF}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          Exportar PDF
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-yellow-400">
            <tr>
              <th className="py-3 px-4">Evento</th>
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Apellido</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Payment ID</th>
              <th className="py-3 px-4">Fecha Compra</th>
            </tr>
          </thead>

          <tbody>
            {entradasFiltradas.map((e) => (
              <tr
                key={e.id}
                className="border-t border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="py-3 px-4">{getEventoNombre(e.eventoId)}</td>
                <td className="py-3 px-4">{e.nombre}</td>
                <td className="py-3 px-4">{e.apellido}</td>
                <td className="py-3 px-4">{e.email}</td>
                <td className="py-3 px-4 text-gray-400">{e.paymentId}</td>
                <td className="py-3 px-4 text-gray-400">
                  {new Date(e.fechaCompra).toLocaleString("es-ES")}
                </td>
              </tr>
            ))}

            {entradasFiltradas.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                  No hay entradas para este evento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
