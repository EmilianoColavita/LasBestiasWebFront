const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${BASE_URL}/noticias`;

// ✅ Obtener todas las noticias
export async function getNoticias() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al obtener noticias");
    return await response.json();
  } catch (error) {
    console.error("Error en getNoticias:", error);
    return [];
  }
}

// ✅ Obtener una noticia por ID
export async function getNoticiaById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Error al obtener la noticia");
    return await response.json();
  } catch (error) {
    console.error("Error en getNoticiaById:", error);
    return null;
  }
}

// ✅ Crear una noticia (multipart/form-data)
export async function crearNoticia({ titulo, descripcion, image }) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("titulo", titulo);
  formData.append("descripcion", descripcion);
  formData.append("image", image); // 👈 asegurate que esto siempre se ejecute

  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // ⚠️ NO agregues manualmente Content-Type
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Error al crear la noticia");
  return await response.json();
}

// ✅ Actualizar una noticia (PUT)
export async function actualizarNoticia(id, { titulo, descripcion, image }) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("titulo", titulo);
  formData.append("descripcion", descripcion);
  if (image) formData.append("image", image);

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error("Error al actualizar la noticia");
    return await response.json();
  } catch (error) {
    console.error("Error en actualizarNoticia:", error);
    throw error;
  }
}

// ✅ Eliminar una noticia
export async function eliminarNoticia(id) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Error al eliminar la noticia");
  } catch (error) {
    console.error("Error en eliminarNoticia:", error);
    throw error;
  }
}
