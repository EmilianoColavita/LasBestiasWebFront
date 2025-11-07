import { FaInstagram, FaYoutube, FaSpotify, FaEnvelope } from "react-icons/fa";

export default function Contacto() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-center text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/images/fondo7.png')" }}
    >
      {/* Fondo oscuro */}
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-3xl px-6 space-y-8">
        <h1 className="text-5xl font-extrabold text-yellow-400 tracking-widest">
          CONTACTO
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed">
          Si querés comunicarte con{" "}
          <span className="text-red-500 font-bold">LAS BESTIAS</span>, podés
          escribirnos o seguirnos en nuestras redes sociales.
        </p>

        {/* Correo */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <FaEnvelope className="text-red-500 text-3xl" />
          <a
            href="mailto:lasbestiasok@gmail.com"
            className="text-yellow-400 text-lg font-semibold hover:text-yellow-300 transition"
          >
            lasbestiasok@gmail.com
          </a>
        </div>

        {/* Redes Sociales */}
        <div className="flex justify-center gap-8 mt-10 text-3xl">
          <a
            href="https://www.instagram.com/lasbestiasok/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-red-500 transition"
          >
            <FaInstagram />
          </a>

          <a
            href="https://www.youtube.com/@lasbestias7520"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-red-500 transition"
          >
            <FaYoutube />
          </a>

          <a
            href="https://open.spotify.com/intl-es/artist/5zNZD3CVAzkt15PqCavTZZ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-red-500 transition"
          >
            <FaSpotify />
          </a>
        </div>

        <p className="text-sm text-gray-500 mt-10 italic">
          ¡Gracias por ser parte de la comunidad bestial! 🐺⚡
        </p>
      </div>
    </div>
  );
}
