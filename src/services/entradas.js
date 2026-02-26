const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${BASE_URL}/api/entradas`;

export async function getEntradas() {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener entradas");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getEntradas:", error);
    return [];
  }
}