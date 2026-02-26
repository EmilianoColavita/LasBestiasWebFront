import api from "../api/axios";

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



export const crearEvento = async (evento) => {
  const formData = new FormData();

  formData.append("nombre", evento.nombre);
  formData.append("descripcion", evento.descripcion);
  formData.append("lugar", evento.lugar);
  formData.append("ciudad", evento.ciudad);
  formData.append("fechaEvento", evento.fechaEvento);
  formData.append("precio", evento.precio);

  if (evento.image) {
    formData.append("image", evento.image);
  }

  const response = await api.post("/api/eventos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const actualizarEvento = async (id, evento) => {
  const formData = new FormData();

  formData.append("nombre", evento.nombre);
  formData.append("descripcion", evento.descripcion);
  formData.append("lugar", evento.lugar);
  formData.append("ciudad", evento.ciudad);
  formData.append("fechaEvento", evento.fechaEvento);
  formData.append("precio", evento.precio);

  if (evento.image) {
    formData.append("image", evento.image);
  }

  const response = await api.put(`/api/eventos/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ✅ Eliminar evento
export async function eliminarEvento(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al eliminar el evento");
}
