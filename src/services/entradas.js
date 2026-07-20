import { authFetch } from "../api/authFetch";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${BASE_URL}/api/entradas`;

export async function getEntradas() {
  try {
    const response = await authFetch(API_URL);

    if (!response.ok) {
      throw new Error("Error al obtener entradas");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getEntradas:", error);
    return [];
  }
}
