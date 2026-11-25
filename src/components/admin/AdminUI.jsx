import { useEffect, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, ImagePlus } from "lucide-react";

// Componentes visuales compartidos por las pantallas de administración

export function PageHeader({ eyebrow = "Panel", title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        <span className="eyebrow mb-3">{eyebrow}</span>
        <h1 className="font-display text-4xl leading-none tracking-wide text-white md:text-5xl">
          {title}
        </h1>
        {description && <p className="mt-3 text-sm text-white/50">{description}</p>}
      </div>
      {action && <div className="flex flex-wrap gap-3">{action}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className = "" }) {
  return (
    <section className={`surface-card p-5 md:p-6 ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-4">
          {title && (
            <h2 className="font-display text-2xl tracking-wide text-white">{title}</h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const ACCENTS = {
  yellow: "bg-bestia/15 text-bestia",
  green: "bg-emerald-500/15 text-emerald-400",
  red: "bg-red-500/15 text-red-400",
  blue: "bg-sky-500/15 text-sky-400",
};

export function StatCard({ label, value, icon: Icon, accent = "yellow", hint }) {
  return (
    <div className="surface-card flex items-start justify-between gap-3 p-4 md:p-5">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
          {label}
        </p>
        <p className="mt-2 truncate font-display text-3xl tracking-wide text-white md:text-4xl">
          {value}
        </p>
        {hint && <p className="mt-1 text-xs text-white/40">{hint}</p>}
      </div>
      {Icon && (
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl md:h-11 md:w-11 ${ACCENTS[accent]}`}
        >
          <Icon size={20} />
        </span>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="surface-card flex flex-col items-center px-6 py-14 text-center">
      {Icon && (
        <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-white/5 text-white/40">
          <Icon size={26} />
        </span>
      )}
      <p className="font-display text-2xl tracking-wide text-white">{title}</p>
      {text && <p className="mt-2 max-w-sm text-sm text-white/50">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-white/10 text-white/70",
    yellow: "bg-bestia/15 text-bestia",
    green: "bg-emerald-500/15 text-emerald-400",
    red: "bg-red-500/15 text-red-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="form-label">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-white/40">{hint}</span>}
    </label>
  );
}

// Selector de imagen con vista previa (nueva o actual)
export function ImagePicker({ file, currentUrl, onChange, label = "Imagen" }) {
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);
  const src = preview || currentUrl;

  return (
    <div>
      <span className="form-label">{label}</span>
      <label className="group flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-white/15 bg-black/30 p-3 transition-colors hover:border-bestia/60">
        <span className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-white/5 text-white/40">
          {src ? (
            <img src={src} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus size={24} />
          )}
        </span>
        <span className="min-w-0 text-sm">
          <span className="block font-semibold text-white group-hover:text-bestia">
            {src ? "Cambiar imagen" : "Subir imagen"}
          </span>
          <span className="block truncate text-xs text-white/40">
            {file ? file.name : currentUrl ? "Se mantiene la imagen actual" : "JPG, PNG o WEBP"}
          </span>
        </span>
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => onChange(e.target.files[0] || null)}
        />
      </label>
    </div>
  );
}

export function Modal({ open, onClose, title, children, size = "md" }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const widths = { md: "sm:max-w-lg", lg: "sm:max-w-2xl" };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-6"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-gradient-to-b from-night-800 to-ash-900 shadow-2xl sm:rounded-3xl ${widths[size]}`}
            initial={reduce ? false : { y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
              <h2 className="font-display text-2xl tracking-wide text-white">{title}</h2>
              <button onClick={onClose} className="icon-btn" aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const formatMoney = (n) => `$${Number(n || 0).toLocaleString("es-AR")}`;

export const formatFechaHora = (fecha) => {
  if (!fecha) return "-";
  const d = new Date(fecha);
  if (isNaN(d)) return "-";
  return d.toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
