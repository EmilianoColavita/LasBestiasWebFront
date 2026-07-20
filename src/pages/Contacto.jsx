import { useState } from "react";
import { FaInstagram, FaYoutube, FaSpotify, FaTiktok, FaEnvelope } from "react-icons/fa";

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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre,
          email,
          mensaje
        })
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
    <div
      className="relative min-h-screen flex flex-col items-center text-center text-white bg-cover bg-center pt-24 sm:pt-28 md:pt-32 pb-16 px-4"
      style={{ backgroundImage: "url('/images/fondo7.png')" }}
    >

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>

      {/* Contenido */}
      <div className="relative z-10 max-w-3xl w-full space-y-8 sm:space-y-10">

        {/* Título */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yellow-400 tracking-widest">
          CONTACTO
        </h1>

        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          Si querés comunicarte con{" "}
          <span className="text-red-500 font-bold">LAS BESTIAS</span>, podés
          escribirnos o seguirnos en nuestras redes sociales.
        </p>

        {/* Email */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <FaEnvelope className="text-red-500 text-2xl sm:text-3xl" />
          <a
            href="mailto:lasbestiasok@gmail.com"
            className="text-yellow-400 text-base sm:text-lg font-semibold hover:text-yellow-300 transition"
          >
            lasbestiasok@gmail.com
          </a>
        </div>

        {/* Redes */}
        <div className="flex justify-center gap-8 sm:gap-10 mt-8 text-3xl sm:text-4xl">

          <a
            href="https://www.instagram.com/lasbestiasok/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-red-500 transition transform hover:scale-110"
          >
            <FaInstagram />
          </a>

          <a
            href="https://www.youtube.com/@lasbestias7520"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-red-500 transition transform hover:scale-110"
          >
            <FaYoutube />
          </a>

          <a
            href="https://open.spotify.com/intl-es/artist/5zNZD3CVAzkt15PqCavTZZ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-red-500 transition transform hover:scale-110"
          >
            <FaSpotify />
          </a>

          <a
            href="https://www.tiktok.com/@lasbestiasok"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-red-500 transition transform hover:scale-110"
          >
            <FaTiktok />
          </a>

        </div>

        {/* Separación grande */}
        <h2 className="text-xl sm:text-2xl text-yellow-400 font-bold mt-16 sm:mt-20">
          Escribinos directamente
        </h2>

        {/* Formulario */}
        <form
          onSubmit={enviarMensaje}
          className="flex flex-col gap-4 mt-6"
        >

          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="p-3 sm:p-4 rounded bg-black bg-opacity-50 border border-gray-600 text-white focus:border-red-500 focus:outline-none"
          />

          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 sm:p-4 rounded bg-black bg-opacity-50 border border-gray-600 text-white focus:border-red-500 focus:outline-none"
          />

          <textarea
            placeholder="Escribí tu mensaje..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            rows="5"
            required
            className="p-3 sm:p-4 rounded bg-black bg-opacity-50 border border-gray-600 text-white focus:border-red-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={enviando}
            className="bg-red-600 hover:bg-red-700 transition p-3 sm:p-4 rounded font-bold disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Enviar mensaje"}
          </button>

        </form>

        <p className="text-xs sm:text-sm text-gray-500 mt-10 italic">
          ¡Gracias por ser parte de la comunidad bestial!
        </p>

      </div>
    </div>
  );
}