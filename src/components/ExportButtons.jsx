import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";

export default function ExportButtons({ entradas, eventos }) {
  const getEventoNombre = (id) => {
    const ev = eventos.find((e) => e.id === id);
    return ev ? ev.nombre : "Desconocido";
  };

  // 🔹 FORMATEO DE FECHA
  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleString("es-AR");
  };

  // 🔹 PREPARAR DATOS UNIFICADOS
  const prepararDatos = () => {
    return entradas.map((e) => ({
      Evento: getEventoNombre(e.eventoId),
      Comprador: e.nombreComprador || "-",
      Email: e.email || "-",
      Telefono: e.telefono || "-",          // si lo agregaste
      DNI: e.dni || "-",                    // si lo agregaste
      "Payment ID": e.paymentId || "-",
      "Fecha Compra": formatFecha(e.fechaCompra),
    }));
  };

  // =============================
  // 📄 EXPORTAR CSV
  // =============================
  const exportarCSV = () => {
    const data = prepararDatos();

    const headers = Object.keys(data[0] || {});
    const rows = data.map((row) =>
      headers.map((field) => `"${row[field]}"`).join(",")
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "entradas.csv";
    link.click();
  };

  // =============================
  // 📊 EXPORTAR EXCEL
  // =============================
  const exportarExcel = () => {
    const data = prepararDatos();

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Entradas");
    XLSX.writeFile(wb, "entradas.xlsx");
  };

  // =============================
  // 📕 EXPORTAR PDF
  // =============================
  const exportarPDF = () => {
    const data = prepararDatos();
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Listado de Entradas - LasBestias", 14, 20);

    const headers = Object.keys(data[0] || {});
    const body = data.map((row) =>
      headers.map((field) => row[field])
    );

    autoTable(doc, {
      startY: 30,
      head: [headers],
      body: body,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save("entradas.pdf");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/40">
        <Download size={14} /> Exportar
      </span>
      <button onClick={exportarCSV} className="btn-outline btn-sm">
        CSV
      </button>
      <button onClick={exportarExcel} className="btn-outline btn-sm">
        Excel
      </button>
      <button onClick={exportarPDF} className="btn-outline btn-sm">
        PDF
      </button>
    </div>
  );
}