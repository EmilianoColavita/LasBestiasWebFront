import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import api from "../api/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);

    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);

      alert("Inicio de sesión exitoso");
      window.location.href = "/admin/dashboard";
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="grain relative flex min-h-[calc(100svh-72px)] items-center justify-center overflow-hidden bg-black px-5 py-12 md:min-h-[calc(100svh-80px)]">
      <div
        className="absolute inset-0 bg-cover bg-left opacity-70"
        style={{ backgroundImage: "url('/images/fondo1.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src="/images/logo.png" alt="Las Bestias" className="mb-5 h-20 w-auto" />
          <span className="eyebrow mb-3">Panel de administración</span>
          <h1 className="font-display text-5xl tracking-wide text-white">Iniciar sesión</h1>
        </div>

        <form onSubmit={handleSubmit} className="surface-card space-y-4 p-6 sm:p-8">
          <label className="block">
            <span className="form-label">Email</span>
            <span className="relative block">
              <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                placeholder="tu@email.com"
                autoComplete="username"
                className="form-input pl-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </span>
          </label>

          <label className="block">
            <span className="form-label">Contraseña</span>
            <span className="relative block">
              <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="form-input pl-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </span>
          </label>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
          )}

          <button type="submit" disabled={enviando} className="btn-primary w-full disabled:opacity-50">
            {enviando ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <Link
          to="/"
          className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40 transition-colors hover:text-bestia"
        >
          <ArrowLeft size={14} /> Volver al sitio
        </Link>
      </div>
    </div>
  );
}
