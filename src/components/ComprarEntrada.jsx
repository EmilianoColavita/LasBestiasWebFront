import { useState } from "react";
import { crearPreferenciaPago } from "../services/pagos";

export default function ComprarEntrada({ eventoId }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  // 🟡 Paso 1 → Antes de pagar, mostrar confirmación
  const handlePreSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !email) {
      return alert("Por favor completa todos los campos");
    }

    setShowConfirm(true);
  };

  // 🟢 Paso 2 → Confirmar y crear preferencia
  const handleConfirm = async () => {
    setLoading(true);
    setShowConfirm(false);

    try {
      const preferencia = await crearPreferenciaPago({
        eventoId,
        email,
        nombre,
        apellido,
      });

      window.location.href = preferencia.init_point;
    } catch (err) {
      console.error(err);
      alert("Error al iniciar el pago");
    }

    setLoading(false);
  };

  return (
    <>
      {/* FORMULARIO */}
      <form
        onSubmit={handlePreSubmit}
        className="bg-black bg-opacity-70 p-4 rounded-lg mt-3 text-center space-y-3"
      >
        <input
          type="text"
          placeholder="Nombre"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Apellido"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
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

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-md w-full"
        >
          {loading ? "Procesando..." : "Comprar entrada"}
        </button>
      </form>

      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl w-80 text-center">
            <h3 className="text-yellow-400 text-lg font-bold mb-4">
              Confirmar datos
            </h3>

            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Al confirmar, recibirás un correo con los detalles de tu compra y tus datos serán registrados en la lista del evento para tu ingreso.
            </p>

            <p className="text-gray-300 mb-2">
              <strong>Nombre:</strong> {nombre}
            </p>
            <p className="text-gray-300 mb-2">
              <strong>Apellido:</strong> {apellido}
            </p>
            <p className="text-gray-300 mb-4">
              <strong>Email:</strong> {email}
            </p>

            <div className="flex gap-3 justify-center mt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
              >
                Confirmar y pagar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
