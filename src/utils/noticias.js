// Helpers de presentación para noticias (no modifican los datos del backend)

export function ordenarPorFecha(noticias = []) {
  return [...noticias].sort(
    (a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
  );
}

export function formatFecha(fecha, opciones = {}) {
  if (!fecha) return "";
  const d = new Date(fecha);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...opciones,
  });
}

// La descripción llega en Markdown: se limpia para mostrar un extracto en texto plano
export function extracto(texto, maxLength = 160) {
  if (!texto) return "";
  const plano = texto
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // imágenes
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> texto
    .replace(/^#{1,6}\s+/gm, "") // encabezados
    .replace(/^\s*>\s?/gm, "") // citas
    .replace(/^\s*[-*+]\s+/gm, "") // listas
    .replace(/[*_~`]/g, "") // énfasis / código
    .replace(/\s+/g, " ")
    .trim();

  if (plano.length <= maxLength) return plano;
  const corte = plano.slice(0, maxLength);
  const ultimoEspacio = corte.lastIndexOf(" ");
  return (ultimoEspacio > maxLength * 0.6 ? corte.slice(0, ultimoEspacio) : corte) + "…";
}

// Categoría opcional: se muestra solo si el backend la envía
export function getCategoria(noticia) {
  return noticia?.categoria || null;
}
