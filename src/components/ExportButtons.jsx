// src/components/ExportButtons.jsx

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportButtons({ entradas, eventos }) {
  const getEventoNombre = (id) => {
    const ev = eventos.find((e) => e.id === id);
    return ev ? ev.nombre : "Desconocido";
  };

  const exportarCSV = () => {
    const header = [
      "Evento",
      "Nombre",
      "Apellido",
      "Email",
      "Payment ID",
      "Fecha Compra",
    ];

    const rows = entradas.map((e) => [
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

  const exportarExcel = () => {
    const data = entradas.map((e) => ({
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

  const exportarPDF = () => {
    const doc = new jsPDF();

    doc.text("Listado de Entradas", 14, 20);

    const tableData = entradas.map((e) => [
      getEventoNombre(e.eventoId),
      e.nombre,
      e.apellido,
      e.email,
      e.paymentId,
      new Date(e.fechaCompra).toLocaleString("es-ES"),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [[
        "Evento",
        "Nombre",
        "Apellido",
        "Email",
        "Payment ID",
        "Fecha Compra",
      ]],
      body: tableData,
    });

    doc.save("entradas.pdf");
  };

  return (
    <div className="flex gap-4 mb-4 flex-wrap">
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
  );
}