const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${BASE_URL}/api/eventos`;

// ✅ Obtener todos los eventos
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

// ✅ Crear evento (multipart/form-data)
export async function crearEvento({ nombre, descripcion, lugar, ciudad, fechaEvento, image }) {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("nombre", nombre);
  formData.append("descripcion", descripcion);
  formData.append("lugar", lugar);
  formData.append("ciudad", ciudad);
  formData.append("fechaEvento", fechaEvento);
  if (image) formData.append("image", image);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Error al crear el evento");
  return await response.json();
}

// ✅ Actualizar evento (multipart/form-data)
export async function actualizarEvento(id, { nombre, descripcion, lugar, ciudad, fechaEvento, image }) {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("nombre", nombre);
  formData.append("descripcion", descripcion);
  formData.append("lugar", lugar);
  formData.append("ciudad", ciudad);
  formData.append("fechaEvento", fechaEvento);
  if (image) formData.append("image", image);

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Error al actualizar el evento");
  return await response.json();
}

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
