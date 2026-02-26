import { useState } from "react";
import { crearPreferenciaPago } from "../services/pagos";

export default function ComprarEntrada({ eventoId }) {

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [repetirEmail, setRepetirEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [dni, setDni] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email !== repetirEmail) {
      return alert("Los emails no coinciden");
    }

    setLoading(true);

    try {
      const preferencia = await crearPreferenciaPago({
        eventoId,
        nombre,
        email,
        telefono,
        dni,
        cantidad
      });

      window.location.href = preferencia.init_point;

    } catch (err) {
      alert("Error al iniciar el pago");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black bg-opacity-70 p-4 rounded-lg mt-3 space-y-3"
    >

      <input
        placeholder="Nombre y Apellido"
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Repetir Email"
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={repetirEmail}
        onChange={(e) => setRepetirEmail(e.target.value)}
        required
      />

      <input
        placeholder="Teléfono"
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        required
      />

      <input
        placeholder="DNI / Passport"
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        required
      />

      <select
        value={cantidad}
        onChange={(e) => setCantidad(Number(e.target.value))}
        className="w-full p-2 rounded bg-gray-800 text-white"
      >
        {[1,2,3,4,5,6].map(n => (
          <option key={n} value={n}>
            {n} entradas
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-md w-full"
      >
        {loading ? "Procesando..." : "Comprar entradas"}
      </button>
    </form>
  );
}