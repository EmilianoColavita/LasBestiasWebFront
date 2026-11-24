import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { SOCIAL_LINKS } from "../constants/social";
import Reveal from "../components/ui/Reveal";
import ArrowIcon from "../components/ui/ArrowIcon";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3.5 text-white placeholder-white/35 transition-colors focus:border-bestia focus:outline-none focus:ring-1 focus:ring-bestia sm:px-5 sm:py-4";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviarMensaje = async (e) => {
    e.preventDefault();

    if (enviando) return;

    setEnviando(true);

    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/contacto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          email,
          mensaje,
        }),
      });

      alert("Mensaje enviado 🐺");

      setNombre("");
      setEmail("");
      setMensaje("");
    } catch (error) {
      alert("Error enviando mensaje");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section
      className="grain relative min-h-[calc(100svh-72px)] overflow-hidden bg-black bg-cover bg-center md:min-h-[calc(100svh-80px)]"
      style={{ backgroundImage: "url('/images/fondo7.png')" }}
    >
      {/* Overlay oscuro sobre el fondo original */}
      <div className="absolute inset-0 bg-black/80" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-b from-night-950/60 via-transparent to-black/80"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-12 lg:gap-16">
        {/* Info */}
        <Reveal className="lg:col-span-5">
          <span className="eyebrow mb-4">Las Bestias</span>
          <h1 className="section-title">Contacto</h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
            Si querés comunicarte con{" "}
            <span className="font-bold text-white">Las Bestias</span>, podés escribirnos o
            seguirnos en nuestras redes sociales.
          </p>

          {/* Email */}
          <a
            href="mailto:lasbestiasok@gmail.com"
            className="surface-card group mt-10 flex items-center gap-4 p-5 hover:border-bestia/40 hover:shadow-glow"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-bestia text-black">
              <FaEnvelope size={18} />
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-semibold uppercase tracking-widest text-white/50">
                Email
              </span>
              <span className="block truncate font-semibold text-white transition-colors group-hover:text-bestia">
                lasbestiasok@gmail.com
              </span>
            </span>
          </a>

          {/* Redes */}
          <div className="mt-10">
            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-widest text-white/50">
              Seguinos
            </span>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-bestia hover:text-bestia"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Formulario */}
        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="surface-card p-6 sm:p-8 md:p-10">
            <h2 className="font-display text-3xl tracking-wide text-white md:text-4xl">
              Escribinos directamente
            </h2>
            <span className="mt-3 block h-1 w-12 bg-bestia" aria-hidden="true" />

            <form onSubmit={enviarMensaje} className="mt-8 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="sr-only">Tu nombre</span>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className={inputCls}
                  />
                </label>

                <label className="block">
                  <span className="sr-only">Tu email</span>
                  <input
                    type="email"
                    placeholder="Tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputCls}
                  />
                </label>
              </div>

              <label className="block">
                <span className="sr-only">Mensaje</span>
                <textarea
                  placeholder="Escribí tu mensaje..."
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  rows="6"
                  required
                  className={`${inputCls} resize-y`}
                />
              </label>

              <button
                type="submit"
                disabled={enviando}
                className="btn-primary group mt-2 w-full py-4 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:self-start"
              >
                {enviando ? "Enviando..." : "Enviar mensaje"}
                {!enviando && (
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs italic text-white/40 lg:text-left">
            ¡Gracias por ser parte de la comunidad bestial!
          </p>
        </Reveal>
      </div>
    </section>
  );
}
