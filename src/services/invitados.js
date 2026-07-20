import { authFetch } from "../api/authFetch";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${BASE_URL}/api/invitados`;

// ✅ Obtener invitados de un evento
export async function getInvitadosByEvento(eventoId) {
  const response = await authFetch(`${API_URL}/evento/${eventoId}`);

  if (!response.ok) throw new Error("Error al obtener los invitados");
  return await response.json();
}

// ✅ Agregar un invitado
export async function crearInvitado({ eventoId, nombre, apellido, dni }) {
  const response = await authFetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventoId, nombre, apellido, dni }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Error al agregar el invitado");
  }

  return await response.json();
}

// ✅ Eliminar un invitado
export async function eliminarInvitado(id) {
  const response = await authFetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Error al eliminar el invitado");
}
