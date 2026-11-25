import api from "../api/axios";
import { authFetch } from "../api/authFetch";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${BASE_URL}/api/eventos`;


export async function getEventos() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al obtener los eventos");
    return await response.json();
  } catch (error) {
    console.error("Error en getEventos:", error);
    return [];
  }
}



// ✅ Obtener un evento por ID
export async function getEventoById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Error al obtener el evento");
    return await response.json();
  } catch (error) {
    console.error("Error en getEventoById:", error);
    return null;
  }
}



// Multipart común a crear y actualizar.
// - precio es opcional: si no hay valor no se envía (nunca como "null").
// - modoVenta siempre se envía desde este frontend, así el backend toma los 4 campos
//   de venta del request (urlVenta/plataformaVenta solo aplican a EXTERNO).
function buildEventoFormData(evento) {
  const formData = new FormData();

  formData.append("nombre", evento.nombre);
  formData.append("descripcion", evento.descripcion);
  formData.append("lugar", evento.lugar);
  formData.append("ciudad", evento.ciudad);
  formData.append("fechaEvento", evento.fechaEvento);

  if (evento.precio !== null && evento.precio !== undefined && evento.precio !== "") {
    formData.append("precio", evento.precio);
  }

  formData.append("modoVenta", evento.modoVenta || "MERCADO_PAGO");

  if (evento.modoVenta === "EXTERNO") {
    formData.append("plataformaVenta", evento.plataformaVenta);
    formData.append("urlVenta", evento.urlVenta);
  }

  if (evento.notaVenta && evento.notaVenta.trim()) {
    formData.append("notaVenta", evento.notaVenta.trim());
  }

  if (evento.image) {
    formData.append("image", evento.image);
  }

  return formData;
}

export const crearEvento = async (evento) => {
  const formData = buildEventoFormData(evento);

  const response = await api.post("/api/eventos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const actualizarEvento = async (id, evento) => {
  const formData = buildEventoFormData(evento);

  const response = await api.put(`/api/eventos/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ✅ Eliminar evento
export async function eliminarEvento(id) {
  const response = await authFetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Error al eliminar el evento");
}
