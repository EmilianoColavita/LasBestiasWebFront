import { useEffect, useState } from "react";
import {
  getInvitadosByEvento,
  crearInvitado,
  eliminarInvitado,
} from "../services/invitados";
import { Trash2, UserPlus } from "lucide-react";

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
        <div className="space-y-2">
          <div className="skeleton h-10 w-full" />
          <div className="skeleton h-10 w-full" />
        </div>
      ) : invitados.length === 0 ? (
        <p className="py-4 text-sm text-white/40">No hay invitados cargados para este evento.</p>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-x-auto rounded-xl border border-white/10 md:block">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-widest text-white/50">
                  <th className="px-4 py-3 font-semibold">Nombre</th>
                  <th className="px-4 py-3 font-semibold">Apellido</th>
                  <th className="px-4 py-3 font-semibold">DNI</th>
                  <th className="px-4 py-3 font-semibold">Cargado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {invitados.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.03]">
                    <td className="px-4 py-3 font-semibold text-white">{inv.nombre}</td>
                    <td className="px-4 py-3 text-white">{inv.apellido}</td>
                    <td className="px-4 py-3 text-white/60">{inv.dni}</td>
                    <td className="px-4 py-3 text-white/40">
                      {inv.fechaCarga ? new Date(inv.fechaCarga).toLocaleString("es-AR") : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleEliminar(inv.id)}
                        className="icon-btn-danger ml-auto"
                        aria-label="Eliminar invitado"
                        title="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <ul className="space-y-2 md:hidden">
            {invitados.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 p-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">
                    {inv.nombre} {inv.apellido}
                  </p>
                  <p className="text-xs text-white/40">DNI {inv.dni}</p>
                </div>
                <button
                  onClick={() => handleEliminar(inv.id)}
                  className="icon-btn-danger"
                  aria-label="Eliminar invitado"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-5">
        {!mostrarForm ? (
          <button onClick={() => setMostrarForm(true)} className="btn-outline btn-sm">
            <UserPlus size={14} /> Agregar invitado
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="form-input" />
              <input type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required className="form-input" />
              <input type="text" placeholder="DNI" value={dni} onChange={(e) => setDni(e.target.value)} required className="form-input" />
            </div>

            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="submit" disabled={guardando} className="btn-primary btn-sm disabled:opacity-50">
                {guardando ? "Agregando..." : "Guardar invitado"}
              </button>
              <button type="button" onClick={() => setMostrarForm(false)} className="btn-outline btn-sm">
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
