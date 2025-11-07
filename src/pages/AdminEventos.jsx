import { useEffect, useState } from "react";
import {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} from "../services/eventos";

function AdminEventos() {
  const [eventos, setEventos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    lugar: "",
    ciudad: "",
    fechaEvento: "",
    image: null,
  });
  const [editando, setEditando] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const cargarEventos = async () => {
    const data = await getEventos();
    setEventos(data);
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editando) {
      await actualizarEvento(editando, form);
    } else {
      await crearEvento(form);
    }
    setForm({ nombre: "", descripcion: "", lugar: "", ciudad: "", fechaEvento: "", image: null });
    setEditando(null);
    setShowForm(false);
    cargarEventos();
  };

  const handleEditar = (e) => {
    setForm({
      nombre: e.nombre,
      descripcion: e.descripcion,
      lugar: e.lugar,
      ciudad: e.ciudad,
      fechaEvento: e.fechaEvento,
      image: null,
    });
    setEditando(e.id);
    setShowForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que querés eliminar este evento?")) {
      await eliminarEvento(id);
      cargarEventos();
    }
  };

  return (
    <div className="min-h-screen text-gray-200">
      <header className="bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">Panel de Administración - Eventos 🎤</h1>
          <p className="text-sm text-gray-400">Gestión de shows y conciertos</p>
        </div>
        <button
          onClick={() => {
            setEditando(null);
            setForm({ nombre: "", descripcion: "", lugar: "", ciudad: "", fechaEvento: "", image: null });
            setShowForm(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
        >
          + Agregar Evento
        </button>
      </header>

      <main className="p-8">
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-700 overflow-x-auto">

          <table className="min-w-full text-sm text-gray-300">
            <thead className="bg-gray-800 text-yellow-400 uppercase text-xs">
              <tr>
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Ciudad</th>
                <th className="py-3 px-4">Lugar</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Imagen</th>
                <th className="py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((e) => (
                <tr key={e.id} className="border-t border-gray-700 hover:bg-gray-800 transition">
                  <td className="py-3 px-4 text-white">{e.nombre}</td>
                  <td className="py-3 px-4 text-gray-400">{e.ciudad}</td>
                  <td className="py-3 px-4 text-gray-400">{e.lugar}</td>
                  <td className="py-3 px-4 text-gray-400">
                    {new Date(e.fechaEvento).toLocaleString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-4">
                    {e.imagenUrl ? (
                      <img src={e.imagenUrl} alt={e.nombre} className="w-20 h-14 object-cover rounded-md" />
                    ) : (
                      <span className="text-gray-500 italic">Sin imagen</span>
                    )}
                  </td>
                  <td className="py-3 px-4 flex gap-3">
                    <button
                      onClick={() => handleEditar(e)}
                      className="text-yellow-400 hover:text-yellow-300 font-semibold"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(e.id)}
                      className="text-red-500 hover:text-red-400 font-semibold"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {eventos.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                    No hay eventos cargados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-2xl w-11/12 max-w-md relative mx-auto">

            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-200 text-lg"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4 text-yellow-400">
              {editando ? "Editar Evento" : "Nuevo Evento"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                className="border border-gray-700 rounded p-2 bg-gray-800 text-white focus:border-yellow-400"
              />
              <textarea
                placeholder="Descripción"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                required
                className="border border-gray-700 rounded p-2 bg-gray-800 text-white focus:border-yellow-400"
              />
              <input
                type="text"
                placeholder="Lugar"
                value={form.lugar}
                onChange={(e) => setForm({ ...form, lugar: e.target.value })}
                required
                className="border border-gray-700 rounded p-2 bg-gray-800 text-white focus:border-yellow-400"
              />
              <input
                type="text"
                placeholder="Ciudad"
                value={form.ciudad}
                onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                required
                className="border border-gray-700 rounded p-2 bg-gray-800 text-white focus:border-yellow-400"
              />
              <input
                type="datetime-local"
                value={form.fechaEvento}
                onChange={(e) => setForm({ ...form, fechaEvento: e.target.value })}
                required
                className="border border-gray-700 rounded p-2 bg-gray-800 text-white focus:border-yellow-400"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                className="text-sm text-gray-300"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded"
                >
                  {editando ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEventos;
