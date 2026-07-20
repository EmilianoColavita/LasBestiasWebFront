import { useEffect, useState } from "react";
import {
  getInvitadosByEvento,
  crearInvitado,
  eliminarInvitado,
} from "../services/invitados";

export default function InvitadosEvento({ eventoId }) {
  const [invitados, setInvitados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");

  const cargarInvitados = async () => {
    setCargando(true);
    try {
      const data = await getInvitadosByEvento(eventoId);
      setInvitados(data);
    } catch (err) {
      console.error("Error cargando invitados", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarInvitados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);

    try {
      await crearInvitado({ eventoId, nombre, apellido, dni });
      setNombre("");
      setApellido("");
      setDni("");
      setMostrarForm(false);
      cargarInvitados();
    } catch (err) {
      setError(err.message || "Error al agregar el invitado");
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar este invitado?")) return;

    try {
      await eliminarInvitado(id);
      cargarInvitados();
    } catch (err) {
      console.error("Error eliminando invitado", err);
      alert("Error al eliminar el invitado");
    }
  };

  return (
    <div>
      {cargando ? (
        <p className="text-gray-400 text-sm">Cargando invitados...</p>
      ) : invitados.length === 0 ? (
        <p className="text-gray-500 italic text-sm">
          No hay invitados cargados para este evento.
        </p>
      ) : (
        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-x-auto">
          <table className="min-w-full text-sm text-gray-300">
            <thead className="bg-gray-800 text-yellow-400 uppercase text-xs">
              <tr>
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-left">Apellido</th>
                <th className="py-2 px-4 text-left">DNI</th>
                <th className="py-2 px-4 text-left">Cargado</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invitados.map((inv) => (
                <tr key={inv.id} className="border-t border-gray-700">
                  <td className="py-2 px-4 text-white">{inv.nombre}</td>
                  <td className="py-2 px-4 text-white">{inv.apellido}</td>
                  <td className="py-2 px-4">{inv.dni}</td>
                  <td className="py-2 px-4 text-gray-400">
                    {inv.fechaCarga
                      ? new Date(inv.fechaCarga).toLocaleString("es-AR")
                      : "-"}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleEliminar(inv.id)}
                      className="text-red-500 hover:text-red-400 font-semibold"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="text-xs text-gray-500 hover:text-gray-400 underline underline-offset-2"
        >
          {mostrarForm ? "Cancelar" : "+ Agregar invitado"}
        </button>

        {mostrarForm && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="border border-gray-700 rounded p-2 bg-gray-800 text-white"
              />
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
                className="border border-gray-700 rounded p-2 bg-gray-800 text-white"
              />
              <input
                type="text"
                placeholder="DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
                className="border border-gray-700 rounded p-2 bg-gray-800 text-white"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={guardando}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg self-start disabled:opacity-50"
            >
              {guardando ? "Agregando..." : "Guardar invitado"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
