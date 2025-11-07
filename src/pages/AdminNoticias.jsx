import { useEffect, useState } from "react";
import {
  getNoticias,
  crearNoticia,
  actualizarNoticia,
  eliminarNoticia,
} from "../services/noticias";

function AdminNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [editando, setEditando] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const cargarNoticias = async () => {
    const data = await getNoticias();
    setNoticias(data);
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editando) {
      await actualizarNoticia(editando, { titulo, descripcion, image: imagen });
    } else {
      await crearNoticia({ titulo, descripcion, image: imagen });
    }

    setTitulo("");
    setDescripcion("");
    setImagen(null);
    setEditando(null);
    setShowForm(false);
    cargarNoticias();
  };

  const handleEditar = (n) => {
    setTitulo(n.titulo);
    setDescripcion(n.descripcion);
    setEditando(n.id);
    setShowForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que querés eliminar esta noticia?")) {
      await eliminarNoticia(id);
      cargarNoticias();
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">
            Panel de Administración - Noticias 📰
          </h1>
          <p className="text-sm text-gray-400">Bienvenido, Administrador 👋</p>
        </div>
        <button
          onClick={() => {
            setEditando(null);
            setTitulo("");
            setDescripcion("");
            setImagen(null);
            setShowForm(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
        >
          + Agregar Noticia
        </button>
      </header>

      {/* Tabla de noticias */}
      <main className="p-8">
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-700 overflow-x-auto">

          <table className="min-w-full text-sm text-gray-300">
            <thead className="bg-gray-800 text-yellow-400 uppercase text-left text-xs">
              <tr>
                <th className="py-3 px-4">Título</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Imagen</th>
                <th className="py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {noticias.map((n) => (
                <tr
                  key={n.id}
                  className="border-t border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="py-3 px-4 font-semibold text-white">
                    {n.titulo}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {new Date(n.fechaPublicacion).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    {n.imagenUrl ? (
                      <img
                        src={n.imagenUrl}
                        alt={n.titulo}
                        className="w-20 h-14 object-cover rounded-md border border-gray-700"
                      />
                    ) : (
                      <span className="text-gray-500 italic">Sin imagen</span>
                    )}
                  </td>
                  <td className="py-3 px-4 flex gap-3">
                    <button
                      onClick={() => handleEditar(n)}
                      className="text-yellow-400 hover:text-yellow-300 font-semibold"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(n.id)}
                      className="text-red-500 hover:text-red-400 font-semibold"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {noticias.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No hay noticias cargadas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal para crear/editar noticia */}
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
              {editando ? "Editar Noticia" : "Nueva Noticia"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className="border border-gray-700 rounded p-2 bg-gray-800 text-white focus:outline-none focus:border-yellow-400"
              />
              <textarea
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                className="border border-gray-700 rounded p-2 bg-gray-800 text-white focus:outline-none focus:border-yellow-400"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
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

export default AdminNoticias;
