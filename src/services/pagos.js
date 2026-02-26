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
    throw new Error("Error al crear la preferencia de pago");
  }

  return await response.json();
}