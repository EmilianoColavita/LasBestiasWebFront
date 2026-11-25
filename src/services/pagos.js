const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function crearPreferenciaPago({
  eventoId,
  email,
  nombre,
  telefono,
  dni,
  cantidad
}) {
  const response = await fetch(`${BASE_URL}/api/pagos/crear-preferencia`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventoId,
      email,
      nombre,
      telefono,
      dni,
      cantidad
    })
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(text);
    // En los 400 el backend responde {"error": "mensaje"}
    let mensaje = null;
    try {
      mensaje = JSON.parse(text)?.error || null;
    } catch {
      // respuesta sin JSON: se usa el mensaje genérico
    }
    const error = new Error(mensaje || "Error al crear la preferencia de pago");
    error.mensajeBackend = mensaje;
    throw error;
  }

  return await response.json();
}