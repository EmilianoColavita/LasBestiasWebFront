import { useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";
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
        cantidad,
      });

      window.location.href = preferencia.init_point;
    } catch (err) {
      alert(err?.mensajeBackend || "Error al iniciar el pago");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-2xl border border-white/10 bg-black/50 p-4 text-left sm:p-5"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          placeholder="Nombre y Apellido"
          className="form-input sm:col-span-2"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Repetir Email"
          className="form-input"
          value={repetirEmail}
          onChange={(e) => setRepetirEmail(e.target.value)}
          required
        />

        <input
          placeholder="Teléfono"
          className="form-input"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />

        <input
          placeholder="DNI / Passport"
          className="form-input"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          required
        />

        <div className="relative sm:col-span-2">
          <select
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="form-input appearance-none pr-10 [color-scheme:dark]"
            aria-label="Cantidad de entradas"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} entradas
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary mt-4 w-full disabled:opacity-50">
        {loading ? "Procesando..." : "Comprar entradas"}
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-white/40">
        <ShieldCheck size={13} /> Vas a ser redirigido para completar el pago
      </p>
    </form>
  );
}
