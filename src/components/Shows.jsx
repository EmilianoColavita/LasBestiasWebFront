import { useEffect, useState } from "react";
import { MapPin, CalendarDays, Ticket, X, Info } from "lucide-react";
import { getEventos } from "../services/eventos";
import ComprarEntrada from "../components/ComprarEntrada";
import SectionHeader from "./ui/SectionHeader";
import Reveal from "./ui/Reveal";
import { getModoVenta, getVentaExterna } from "../constants/venta";

// Acción de compra según el modo de venta que define el evento en el backend
function CompraEvento({ evento, abierto, onToggle }) {
  const modo = getModoVenta(evento);
  const externa = getVentaExterna(evento);

  const nota = evento.notaVenta && (
    <p className="mt-3 flex items-center justify-center gap-2 text-sm text-white/60 md:justify-start">
      <Info size={15} className="shrink-0 text-bestia" />
      {evento.notaVenta}
    </p>
  );

  if (modo === "EXTERNO") {
    return (
      <>
        {externa ? (
          <a href={externa.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <externa.Icon size={16} />
            {externa.boton}
          </a>
        ) : (
          <p className="text-sm text-white/50">Entradas a la venta próximamente.</p>
        )}
        {nota}
      </>
    );
  }

  if (modo === "SIN_VENTA_ONLINE") {
    return (
      nota || (
        <p className="flex items-center justify-center gap-2 text-sm text-white/60 md:justify-start">
          <Info size={15} className="shrink-0 text-bestia" />
          Sin venta online
        </p>
      )
    );
  }

  // MERCADO_PAGO (y eventos sin modoVenta): formulario de siempre
  return (
    <>
      <button onClick={onToggle} className={abierto ? "btn-outline" : "btn-primary"} aria-expanded={abierto}>
        {abierto ? <X size={16} /> : <Ticket size={16} />}
        {abierto ? "Cerrar" : "Comprar entrada"}
      </button>
      {!abierto && nota}
      {abierto && <ComprarEntrada eventoId={evento.id} />}
    </>
  );
}

// Fondo y encabezado compartidos por todos los estados de la sección
function ShowsShell({ children }) {
  return (
    <section
      id="shows"
      className="grain relative min-h-[calc(100svh-72px)] overflow-hidden bg-black bg-cover bg-center py-16 md:min-h-[calc(100svh-80px)] md:py-24"
      style={{ backgroundImage: "url('/images/fondoNegro.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <div
        className="absolute inset-x-0 top-0 h-[28rem] bg-gradient-to-b from-night-800/50 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeader eyebrow="En vivo" title="Shows" as="h1" />
        {children}
        <p className="mt-12 text-center text-xs italic text-white/40">
          Mantente al día con LAS BESTIAS
        </p>
      </div>
    </section>
  );
}

function Shows() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventoActivo, setEventoActivo] = useState(null);

  useEffect(() => {
    getEventos().then((data) => {
      // Filtrar solo futuros
      const futuros = data
        .filter((evento) => new Date(evento.fechaEvento) > new Date())
        .sort((a, b) => new Date(a.fechaEvento) - new Date(b.fechaEvento));

      setEventos(futuros);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <ShowsShell>
        <div className="surface-card flex flex-col overflow-hidden md:flex-row">
          <div className="skeleton h-56 w-full rounded-none md:h-auto md:min-h-[16rem] md:w-1/3" />
          <div className="flex-1 space-y-3 p-6">
            <div className="skeleton h-8 w-2/3" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-16 w-full" />
          </div>
        </div>
      </ShowsShell>
    );
  }

  if (eventos.length === 0) {
    return (
      <ShowsShell>
        <div className="surface-card flex flex-col items-center px-6 py-16 text-center">
          <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-white/5 text-white/40">
            <CalendarDays size={26} />
          </span>
          <p className="font-display text-3xl tracking-wide text-white">No hay shows disponibles</p>
          <p className="mt-2 max-w-sm text-sm text-white/50">
            Seguinos en redes para enterarte de las próximas fechas.
          </p>
        </div>
      </ShowsShell>
    );
  }

  return (
    <ShowsShell>
      <div className="space-y-6">
        {eventos.map((evento, i) => {
          const fecha = new Date(evento.fechaEvento);
          const abierto = eventoActivo === evento.id;

          return (
            <Reveal key={evento.id} delay={i * 0.06}>
              <article
                className={`surface-card group flex flex-col overflow-hidden md:flex-row md:items-stretch ${
                  abierto ? "border-bestia/40" : "hover:-translate-y-0.5 hover:border-bestia/30"
                }`}
              >
                {/* Imagen */}
                {evento.imagenUrl && (
                  <div className="relative w-full overflow-hidden bg-night-900 md:w-1/3">
                    <img
                      src={evento.imagenUrl}
                      alt={evento.nombre}
                      className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:absolute md:inset-0 md:h-full"
                    />
                    {/* Fecha destacada sobre el flyer */}
                    <div className="absolute left-4 top-4 rounded-xl border border-bestia/40 bg-black/80 px-3 py-2 text-center leading-none backdrop-blur">
                      <span className="block font-display text-3xl text-bestia">{fecha.getDate()}</span>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-white/70">
                        {fecha.toLocaleDateString("es-ES", { month: "short" })}
                      </span>
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="flex flex-1 flex-col p-5 text-center sm:p-6 md:p-8 md:text-left">
                  <h3 className="font-display text-3xl leading-none tracking-wide text-white sm:text-4xl">
                    {evento.nombre}
                  </h3>

                  <div className="mt-4 flex flex-col items-center gap-2 text-sm text-white/70 md:items-start">
                    <p className="flex items-center gap-2">
                      <MapPin size={16} className="shrink-0 text-bestia" />
                      {evento.ciudad} — {evento.lugar}
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} className="shrink-0 text-bestia" />
                      {fecha.toLocaleString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white/60 sm:text-base">
                    {evento.descripcion}
                  </p>

                  <div className="mt-6">
                    <CompraEvento
                      evento={evento}
                      abierto={abierto}
                      onToggle={() => setEventoActivo(abierto ? null : evento.id)}
                    />
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </ShowsShell>
  );
}

export default Shows;
