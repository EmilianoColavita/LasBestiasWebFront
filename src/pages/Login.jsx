import React, { useState } from "react";
import api from "../api/axios"; // ajustá la ruta según tu estructura

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);

      alert("Inicio de sesión exitoso");
      window.location.href = "/admin/dashboard"; // redirigís donde quieras
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl mb-4">Iniciar sesión</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-80"
      >
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 rounded bg-gray-700 border border-gray-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-3 p-2 rounded bg-gray-700 border border-gray-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-400 mb-3">{error}</p>}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 p-2 rounded"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
