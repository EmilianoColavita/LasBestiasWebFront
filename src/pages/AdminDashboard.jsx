import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Newspaper,
  CalendarDays,
  Ticket,
  Wallet,
  ScanLine,
  Plus,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { getNoticias } from "../services/noticias";
import { getEventos } from "../services/eventos";
import { getEntradas } from "../services/entradas";
import { ordenarPorFecha, formatFecha } from "../utils/noticias";
import {
  PageHeader,
  Panel,
  StatCard,
  Badge,
  formatMoney,
  formatFechaHora,
} from "../components/admin/AdminUI";

const QUICK_ACTIONS = [
  { label: "Nueva noticia", text: "Publicar en el sitio", to: "/admin/noticias?nuevo=1", icon: Plus },
  { label: "Nuevo evento", text: "Cargar un show", to: "/admin/eventos?nuevo=1", icon: CalendarDays },
  { label: "Escanear entradas", text: "Control de ingreso", to: "/admin/entradas?scan=1", icon: ScanLine },
];

export default function AdminDashboard() {
  const [noticias, setNoticias] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getNoticias(), getEventos(), getEntradas()]).then(([n, ev, en]) => {
      setNoticias(Array.isArray(n) ? n : []);
      setEventos(Array.isArray(ev) ? ev : []);
      setEntradas(Array.isArray(en) ? en : []);
      setLoading(false);
    });
  }, []);

  const datos = useMemo(() => {
    const ahora = new Date();
    // Igual que en Entradas: solo cuentan entradas de eventos existentes
    const activas = entradas.filter((e) => eventos.some((ev) => ev.id === e.eventoId));
    const proximos = eventos
      .filter((ev) => new Date(ev.fechaEvento) >= ahora)
      .sort((a, b) => new Date(a.fechaEvento) - new Date(b.fechaEvento));

    return {
      vendidas: activas.length,
      ingresaron: activas.filter((e) => e.usada).length,
      recaudado: activas.reduce((acc, e) => acc + (e.precioPagado || 0), 0),
      proximos,
      ultimasNoticias: ordenarPorFecha(noticias).slice(0, 4),
      vendidasPorEvento: (id) => activas.filter((e) => e.eventoId === id).length,
    };
  }, [noticias, eventos, entradas]);

  const v = (valor) => (loading ? "—" : valor);

  return (
    <div>
      <PageHeader
        eyebrow="Panel de administración"
        title="Hola, Bestia"
        description="Resumen general del sitio, eventos y venta de entradas."
      />

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <StatCard label="Noticias" value={v(noticias.length)} icon={Newspaper} hint="publicadas" />
        <StatCard
          label="Próximos shows"
          value={v(datos.proximos.length)}
          icon={CalendarDays}
          accent="blue"
          hint={`${v(eventos.length)} eventos en total`}
        />
        <StatCard
          label="Entradas vendidas"
          value={v(datos.vendidas)}
          icon={Ticket}
          accent="green"
          hint={
            <span className="inline-flex items-center gap-1">
              <UserCheck size={12} /> {v(datos.ingresaron)} ingresaron
            </span>
          }
        />
        <StatCard label="Recaudado" value={v(formatMoney(datos.recaudado))} icon={Wallet} accent="yellow" hint="total entradas" />
      </div>

      {/* Accesos rápidos */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 md:mt-8 md:gap-4">
        {QUICK_ACTIONS.map(({ label, text, to, icon: Icon }) => (
          <Link
            key={label}
            to={to}
            className="surface-card group flex items-center gap-4 p-4 hover:-translate-y-0.5 hover:border-bestia/40 hover:shadow-glow md:p-5"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-bestia text-black">
              <Icon size={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-white">{label}</span>
              <span className="block text-xs text-white/50">{text}</span>
            </span>
            <ArrowRight size={18} className="text-white/30 transition-all group-hover:translate-x-1 group-hover:text-bestia" />
          </Link>
        ))}
      </div>

      {/* Listados */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:mt-8 lg:grid-cols-2">
        <Panel
          title="Últimas noticias"
          action={
            <Link to="/admin/noticias" className="link-arrow text-xs">
              Ver todas <ArrowRight size={14} />
            </Link>
          }
        >
          {loading ? (
            <ListSkeleton />
          ) : datos.ultimasNoticias.length === 0 ? (
            <p className="py-6 text-center text-sm text-white/40">No hay noticias cargadas.</p>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {datos.ultimasNoticias.map((n) => (
                <li key={n.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white/5">
                    {n.imagenUrl && (
                      <img src={n.imagenUrl} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">{n.titulo}</p>
                    <p className="text-xs text-white/40">{formatFecha(n.fechaPublicacion)}</p>
                  </div>
                  <Link to={`/noticia/${n.id}`} className="icon-btn" aria-label="Ver en el sitio">
                    <ArrowRight size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Próximos eventos"
          action={
            <Link to="/admin/eventos" className="link-arrow text-xs">
              Gestionar <ArrowRight size={14} />
            </Link>
          }
        >
          {loading ? (
            <ListSkeleton />
          ) : datos.proximos.length === 0 ? (
            <p className="py-6 text-center text-sm text-white/40">No hay eventos próximos.</p>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {datos.proximos.slice(0, 4).map((ev) => {
                const d = new Date(ev.fechaEvento);
                return (
                  <li key={ev.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-bestia/30 bg-bestia/10 text-center leading-none">
                      <span>
                        <span className="block font-display text-2xl text-bestia">{d.getDate()}</span>
                        <span className="block text-[10px] font-bold uppercase text-white/60">
                          {d.toLocaleDateString("es-AR", { month: "short" })}
                        </span>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-white">{ev.nombre}</p>
                      <p className="truncate text-xs text-white/40">
                        {ev.lugar} · {ev.ciudad} · {formatFechaHora(ev.fechaEvento)}
                      </p>
                    </div>
                    <Badge tone="green">{datos.vendidasPorEvento(ev.id)} vendidas</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="skeleton h-14 w-14" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
