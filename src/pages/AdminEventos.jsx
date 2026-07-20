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
    precio: "",
    image: null,
  });
  const [editando, setEditando] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const cargarEventos = async () => {
    try {
      const data = await getEventos();
      setEventos(data);
    } catch (error) {
      console.error("Error cargando eventos", error);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const precioNumero = Number(form.precio);

      if (form.precio === "" || isNaN(precioNumero) || precioNumero <= 0) {
        alert("El precio debe ser un número válido mayor a 0");
        return;
      }

      const fechaConSegundos =
        form.fechaEvento.length === 16
          ? form.fechaEvento + ":00"
          : form.fechaEvento;

      const dataToSend = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        lugar: form.lugar,
        ciudad: form.ciudad,
        fechaEvento: fechaConSegundos,
        precio: precioNumero,
        image: form.image, // 🔥 IMPORTANTE
      };

      if (editando) {
        await actualizarEvento(editando, dataToSend);
      } else {
        await crearEvento(dataToSend);
      }

      setForm({
        nombre: "",
        descripcion: "",
        lugar: "",
        ciudad: "",
        fechaEvento: "",
        precio: "",
        image: null,
      });

      setEditando(null);
      setShowForm(false);
      cargarEventos();
    } catch (error) {
      console.error(error);
      alert("Error al guardar el evento");
    }
  };

  const handleEditar = (evento) => {
    setForm({
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      lugar: evento.lugar,
      ciudad: evento.ciudad,
      fechaEvento: evento.fechaEvento?.slice(0, 16),
      precio: evento.precio,
      image: null,
    });

    setEditando(evento.id);
    setShowForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que querés eliminar este evento?")) {
      try {
        await eliminarEvento(id);
        cargarEventos();
      } catch (error) {
        console.error("Error eliminando evento", error);
      }
    }
  };

  return (
    <div className="min-h-screen text-gray-200">
      <header className="bg-gray-900 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-yellow-400">
              Panel de Administración - Eventos 🎤
            </h1>
            <p className="text-sm text-gray-400">
              Gestión de shows y conciertos
            </p>
          </div>

          <button
            onClick={() => {
              setEditando(null);
              setForm({
                nombre: "",
                descripcion: "",
                lugar: "",
                ciudad: "",
                fechaEvento: "",
                precio: "",
                image: null,
              });
              setShowForm(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
          >
            + Agregar Evento
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-700 overflow-x-auto">
          <table className="min-w-full text-sm text-gray-300">
            <thead className="bg-gray-800 text-yellow-400 uppercase text-xs">
              <tr>
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Ciudad</th>
                <th className="py-3 px-4">Lugar</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Precio</th>
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
                    {new Date(e.fechaEvento).toLocaleString("es-AR")}
                  </td>
                  <td className="py-3 px-4 text-green-400 font-semibold">
                    ${e.precio?.toLocaleString("es-AR")}
                  </td>
                  <td className="py-3 px-4">
                    {e.imagenUrl ? (
                      <img
                        src={e.imagenUrl}
                        alt={e.nombre}
                        className="w-20 h-14 object-cover rounded-md border border-gray-700"
                      />
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
                  <td colSpan="7" className="text-center py-6 text-gray-500 italic">
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
              <input type="text" placeholder="Nombre" required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="border border-gray-700 rounded p-2 bg-gray-800 text-white"
              />

              <textarea placeholder="Descripción" required
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className="border border-gray-700 rounded p-2 bg-gray-800 text-white"
              />

              <input type="text" placeholder="Lugar" required
                value={form.lugar}
                onChange={(e) => setForm({ ...form, lugar: e.target.value })}
                className="border border-gray-700 rounded p-2 bg-gray-800 text-white"
              />

              <input type="text" placeholder="Ciudad" required
                value={form.ciudad}
                onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                className="border border-gray-700 rounded p-2 bg-gray-800 text-white"
              />

              <input type="datetime-local" required
                value={form.fechaEvento}
                onChange={(e) => setForm({ ...form, fechaEvento: e.target.value })}
                className="border border-gray-700 rounded p-2 bg-gray-800 text-white"
              />

              <input type="number" step="0.01" min="0" required
                placeholder="Precio"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                className="border border-gray-700 rounded p-2 bg-gray-800 text-white"
              />

              {/* 🔥 INPUT IMAGEN RESTAURADO */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                className="text-sm text-gray-300"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                >
                  Cancelar
                </button>

                <button type="submit"
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