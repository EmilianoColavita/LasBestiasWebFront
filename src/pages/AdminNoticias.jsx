import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Newspaper, Search, ExternalLink } from "lucide-react";
import {
  getNoticias,
  crearNoticia,
  actualizarNoticia,
  eliminarNoticia,
} from "../services/noticias";
import { ordenarPorFecha, extracto } from "../utils/noticias";
import {
  PageHeader,
  Modal,
  Field,
  ImagePicker,
  EmptyState,
  formatFechaHora,
} from "../components/admin/AdminUI";

function AdminNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [imagenActual, setImagenActual] = useState(null);
  const [editando, setEditando] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const cargarNoticias = async () => {
    const data = await getNoticias();
    setNoticias(ordenarPorFecha(data));
    setLoading(false);
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  const resetForm = () => {
    setTitulo("");
    setDescripcion("");
    setImagen(null);
    setImagenActual(null);
    setEditando(null);
  };

  const abrirNueva = () => {
    resetForm();
    setShowForm(true);
  };

  // Acceso rápido desde el dashboard (?nuevo=1)
  useEffect(() => {
    if (searchParams.get("nuevo")) {
      abrirNueva();
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      if (editando) {
        await actualizarNoticia(editando, { titulo, descripcion, image: imagen });
      } else {
        await crearNoticia({ titulo, descripcion, image: imagen });
      }
      resetForm();
      setShowForm(false);
      cargarNoticias();
    } catch (error) {
      console.error(error);
      alert("Error al guardar la noticia");
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (n) => {
    setTitulo(n.titulo);
    setDescripcion(n.descripcion);
    setImagen(null);
    setImagenActual(n.imagenUrl || null);
    setEditando(n.id);
    setShowForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que querés eliminar esta noticia?")) {
      try {
        await eliminarNoticia(id);
        cargarNoticias();
      } catch (error) {
        alert("Error al eliminar la noticia");
      }
    }
  };

  const filtradas = noticias.filter((n) =>
    n.titulo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        eyebrow="Contenido"
        title="Noticias"
        description={`${noticias.length} noticias publicadas. La más reciente aparece en la portada del sitio.`}
        action={
          <button onClick={abrirNueva} className="btn-primary">
            <Plus size={16} /> Nueva noticia
          </button>
        }
      />

      {noticias.length > 0 && (
        <div className="relative mb-6 max-w-md">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="form-input pl-11"
          />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="surface-card overflow-hidden">
              <div className="skeleton aspect-[16/10] rounded-none" />
              <div className="space-y-2 p-5">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : noticias.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No hay noticias cargadas"
          text="Creá la primera noticia: se va a mostrar en la portada del sitio."
          action={
            <button onClick={abrirNueva} className="btn-primary">
              <Plus size={16} /> Nueva noticia
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtradas.map((n, i) => (
            <article key={n.id} className="surface-card group flex flex-col overflow-hidden hover:border-white/20">
              <div className="relative aspect-[16/10] overflow-hidden bg-night-900">
                {n.imagenUrl ? (
                  <img src={n.imagenUrl} alt={n.titulo} className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full place-items-center text-sm italic text-white/30">
                    Sin imagen
                  </span>
                )}
                {i === 0 && !busqueda && (
                  <span className="absolute left-3 top-3 rounded-full bg-bestia px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                    En portada
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                  {formatFechaHora(n.fechaPublicacion)}
                </p>
                <h3 className="mt-2 font-display text-2xl leading-tight tracking-wide text-white">
                  {n.titulo}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-white/50">{extracto(n.descripcion, 110)}</p>

                <div className="mt-auto flex items-center gap-2 pt-5">
                  <button onClick={() => handleEditar(n)} className="btn-outline btn-sm flex-1">
                    <Pencil size={14} /> Editar
                  </button>
                  <Link to={`/noticia/${n.id}`} className="icon-btn" aria-label="Ver en el sitio" title="Ver en el sitio">
                    <ExternalLink size={16} />
                  </Link>
                  <button
                    onClick={() => handleEliminar(n.id)}
                    className="icon-btn-danger"
                    aria-label="Eliminar"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
          {filtradas.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-white/40">
              Ninguna noticia coincide con “{busqueda}”.
            </p>
          )}
        </div>
      )}

      {/* Modal para crear/editar noticia */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editando ? "Editar noticia" : "Nueva noticia"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label="Título">
            <input
              type="text"
              placeholder="Título de la noticia"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="form-input"
            />
          </Field>

          <Field label="Descripción" hint="Admite formato Markdown (**negrita**, listas, links).">
            <textarea
              placeholder="Contenido de la noticia"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              rows={8}
              className="form-input resize-y"
            />
          </Field>

          <ImagePicker file={imagen} currentUrl={imagenActual} onChange={setImagen} label="Imagen / flyer" />

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline">
              Cancelar
            </button>
            <button type="submit" disabled={guardando} className="btn-primary disabled:opacity-50">
              {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Publicar noticia"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AdminNoticias;
