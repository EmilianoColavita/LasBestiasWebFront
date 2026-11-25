import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2, CalendarDays, MapPin, Clock } from "lucide-react";
import {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} from "../services/eventos";
import {
  PageHeader,
  Modal,
  Field,
  ImagePicker,
  EmptyState,
  Badge,
  formatMoney,
  formatFechaHora,
} from "../components/admin/AdminUI";
import {
  MODOS_VENTA,
  PLATAFORMAS_VENTA,
  getModoVenta,
  esUrlValida,
  mensajeDeError,
} from "../constants/venta";

const FORM_VACIO = {
  nombre: "",
  descripcion: "",
  lugar: "",
  ciudad: "",
  fechaEvento: "",
  precio: "",
  modoVenta: "MERCADO_PAGO",
  plataformaVenta: "",
  urlVenta: "",
  notaVenta: "",
  image: null,
};

// Etiqueta corta del modo de venta para las tarjetas del listado
function VentaBadge({ evento }) {
  const modo = getModoVenta(evento);
  if (modo === "EXTERNO") {
    const p = PLATAFORMAS_VENTA[evento.plataformaVenta] || PLATAFORMAS_VENTA.OTRA;
    return (
      <Badge tone="yellow">
        <p.Icon size={11} /> {p.label}
      </Badge>
    );
  }
  if (modo === "SIN_VENTA_ONLINE") return <Badge>Sin venta online</Badge>;
  return <Badge tone="green">Mercado Pago</Badge>;
}

function AdminEventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(FORM_VACIO);
  const [imagenActual, setImagenActual] = useState(null);
  const [editando, setEditando] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const cargarEventos = async () => {
    try {
      const data = await getEventos();
      // Próximos primero (más cercano arriba), luego los pasados
      const ahora = new Date();
      const ordenados = [...data].sort((a, b) => {
        const fa = new Date(a.fechaEvento);
        const fb = new Date(b.fechaEvento);
        const pa = fa < ahora;
        const pb = fb < ahora;
        if (pa !== pb) return pa ? 1 : -1;
        return pa ? fb - fa : fa - fb;
      });
      setEventos(ordenados);
    } catch (error) {
      console.error("Error cargando eventos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const abrirNuevo = () => {
    setEditando(null);
    setForm(FORM_VACIO);
    setImagenActual(null);
    setErrorForm("");
    setShowForm(true);
  };

  // Acceso rápido desde el dashboard (?nuevo=1)
  useEffect(() => {
    if (searchParams.get("nuevo")) {
      abrirNuevo();
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mismas reglas que valida el backend, para avisar antes de enviar
  const validar = () => {
    const tienePrecio = form.precio !== "" && form.precio !== null;
    const precioNumero = Number(form.precio);

    if (form.modoVenta === "MERCADO_PAGO") {
      if (!tienePrecio || isNaN(precioNumero) || precioNumero <= 0) {
        return "Para vender por Mercado Pago, el precio debe ser un número mayor a 0.";
      }
    } else if (tienePrecio && (isNaN(precioNumero) || precioNumero < 0)) {
      return "El precio no puede ser negativo.";
    }

    if (form.modoVenta === "EXTERNO") {
      if (!form.plataformaVenta) return "Elegí la plataforma de venta.";
      if (!esUrlValida(form.urlVenta)) {
        return "El link de venta tiene que ser una URL completa (empieza con https://).";
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorForm("");

    const error = validar();
    if (error) {
      setErrorForm(error);
      return;
    }

    try {
      const fechaConSegundos =
        form.fechaEvento.length === 16 ? form.fechaEvento + ":00" : form.fechaEvento;

      const dataToSend = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        lugar: form.lugar,
        ciudad: form.ciudad,
        fechaEvento: fechaConSegundos,
        precio: form.precio === "" || form.precio === null ? null : Number(form.precio),
        modoVenta: form.modoVenta,
        plataformaVenta: form.plataformaVenta,
        urlVenta: form.urlVenta.trim(),
        notaVenta: form.notaVenta,
        image: form.image,
      };

      setGuardando(true);
      if (editando) {
        await actualizarEvento(editando, dataToSend);
      } else {
        await crearEvento(dataToSend);
      }

      setForm(FORM_VACIO);
      setEditando(null);
      setShowForm(false);
      cargarEventos();
    } catch (error) {
      console.error(error);
      // El backend responde {"error": "..."} en los 400
      setErrorForm(mensajeDeError(error, "Error al guardar el evento"));
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (evento) => {
    setForm({
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      lugar: evento.lugar,
      ciudad: evento.ciudad,
      fechaEvento: evento.fechaEvento?.slice(0, 16),
      precio: evento.precio ?? "",
      modoVenta: getModoVenta(evento),
      plataformaVenta: evento.plataformaVenta || "",
      urlVenta: evento.urlVenta || "",
      notaVenta: evento.notaVenta || "",
      image: null,
    });
    setImagenActual(evento.imagenUrl || null);
    setErrorForm("");
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
        alert("Error al eliminar el evento");
      }
    }
  };

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });
  const ahora = new Date();
  const plataformaSel = PLATAFORMAS_VENTA[form.plataformaVenta];
  const precioObligatorio = form.modoVenta === "MERCADO_PAGO";

  return (
    <div>
      <PageHeader
        eyebrow="Shows"
        title="Eventos"
        description="Gestión de shows y conciertos. Los próximos aparecen primero."
        action={
          <button onClick={abrirNuevo} className="btn-primary">
            <Plus size={16} /> Nuevo evento
          </button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="surface-card overflow-hidden">
              <div className="skeleton aspect-[16/10] rounded-none" />
              <div className="space-y-2 p-5">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : eventos.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No hay eventos cargados"
          text="Cargá un show y elegí por dónde se venden las entradas."
          action={
            <button onClick={abrirNuevo} className="btn-primary">
              <Plus size={16} /> Nuevo evento
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {eventos.map((ev) => {
            const pasado = new Date(ev.fechaEvento) < ahora;
            const tienePrecio = ev.precio !== null && ev.precio !== undefined;
            return (
              <article
                key={ev.id}
                className={`surface-card flex flex-col overflow-hidden hover:border-white/20 ${pasado ? "opacity-60" : ""}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-night-900">
                  {ev.imagenUrl ? (
                    <img src={ev.imagenUrl} alt={ev.nombre} className="h-full w-full object-cover" />
                  ) : (
                    <span className="grid h-full place-items-center text-sm italic text-white/30">
                      Sin imagen
                    </span>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-black/75 backdrop-blur">
                    <Badge tone={pasado ? "neutral" : "green"}>{pasado ? "Finalizado" : "Próximo"}</Badge>
                  </span>
                  {tienePrecio && (
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/80 px-3 py-1 font-display text-lg tracking-wide text-bestia backdrop-blur">
                      {formatMoney(ev.precio)}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-2xl leading-tight tracking-wide text-white">{ev.nombre}</h3>
                  <p className="mt-3 flex items-center gap-2 text-sm text-white/60">
                    <Clock size={14} className="shrink-0 text-bestia" />
                    {formatFechaHora(ev.fechaEvento)}
                  </p>
                  <p className="mt-1.5 flex items-center gap-2 text-sm text-white/60">
                    <MapPin size={14} className="shrink-0 text-bestia" />
                    <span className="truncate">
                      {ev.lugar} · {ev.ciudad}
                    </span>
                  </p>
                  <div className="mt-3">
                    <VentaBadge evento={ev} />
                  </div>

                  <div className="mt-auto flex items-center gap-2 pt-5">
                    <button onClick={() => handleEditar(ev)} className="btn-outline btn-sm flex-1">
                      <Pencil size={14} /> Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(ev.id)}
                      className="icon-btn-danger"
                      aria-label="Eliminar"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editando ? "Editar evento" : "Nuevo evento"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label="Nombre">
            <input type="text" placeholder="Nombre del show" required value={form.nombre} onChange={set("nombre")} className="form-input" />
          </Field>

          <Field label="Descripción">
            <textarea placeholder="Descripción" required rows={4} value={form.descripcion} onChange={set("descripcion")} className="form-input resize-y" />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Lugar">
              <input type="text" placeholder="Ej: Bye Henry" required value={form.lugar} onChange={set("lugar")} className="form-input" />
            </Field>
            <Field label="Ciudad">
              <input type="text" placeholder="Ej: La Plata" required value={form.ciudad} onChange={set("ciudad")} className="form-input" />
            </Field>
            <Field label="Fecha y hora">
              <input type="datetime-local" required value={form.fechaEvento} onChange={set("fechaEvento")} className="form-input [color-scheme:dark]" />
            </Field>
            <Field
              label={precioObligatorio ? "Precio" : "Precio (opcional)"}
              hint={precioObligatorio ? null : "Solo informativo para este modo de venta."}
            >
              <input
                type="number"
                step="0.01"
                min="0"
                required={precioObligatorio}
                placeholder="0"
                value={form.precio}
                onChange={set("precio")}
                className="form-input"
              />
            </Field>
          </div>

          {/* Modo de venta */}
          <fieldset className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <legend className="form-label px-1">¿Cómo se venden las entradas?</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {MODOS_VENTA.map(({ value, label, Icon }) => {
                const activo = form.modoVenta === value;
                return (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${
                      activo
                        ? "border-bestia bg-bestia/10 text-white"
                        : "border-white/10 text-white/60 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="modoVenta"
                      value={value}
                      checked={activo}
                      onChange={set("modoVenta")}
                      className="sr-only"
                    />
                    <Icon size={16} className={activo ? "text-bestia" : ""} />
                    {label}
                  </label>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-white/40">
              {MODOS_VENTA.find((m) => m.value === form.modoVenta)?.descripcion}
            </p>

            {form.modoVenta === "EXTERNO" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,180px)_1fr]">
                <Field label="Plataforma">
                  <select
                    required
                    value={form.plataformaVenta}
                    onChange={set("plataformaVenta")}
                    className="form-input [color-scheme:dark]"
                  >
                    <option value="">Elegir...</option>
                    {Object.entries(PLATAFORMAS_VENTA).map(([key, p]) => (
                      <option key={key} value={key}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Link de venta" hint={plataformaSel?.ayuda}>
                  <input
                    type="url"
                    required
                    maxLength={500}
                    placeholder={plataformaSel?.placeholder || "https://..."}
                    value={form.urlVenta}
                    onChange={set("urlVenta")}
                    className="form-input"
                  />
                </Field>
              </div>
            )}

            <Field label="Nota (opcional)" hint={`${form.notaVenta.length}/200 · Se muestra en la página de Shows.`} className="mt-4">
              <input
                type="text"
                maxLength={200}
                placeholder={
                  form.modoVenta === "SIN_VENTA_ONLINE" ? "Ej: Entradas en puerta" : "Ej: También en puerta"
                }
                value={form.notaVenta}
                onChange={set("notaVenta")}
                className="form-input"
              />
            </Field>
          </fieldset>

          <ImagePicker
            file={form.image}
            currentUrl={imagenActual}
            onChange={(file) => setForm({ ...form, image: file })}
            label="Imagen / flyer"
          />

          {errorForm && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400" role="alert">
              {errorForm}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline">
              Cancelar
            </button>
            <button type="submit" disabled={guardando} className="btn-primary disabled:opacity-50">
              {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear evento"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AdminEventos;
