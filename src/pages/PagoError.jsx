import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

export default function PagoError() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-center text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/images/fondo7.png')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>

      <div className="relative z-10 max-w-3xl px-6 space-y-8">
        <FaTimesCircle className="text-red-500 text-6xl mx-auto" />

        <h1 className="text-5xl font-extrabold text-red-500 tracking-widest">
          PAGO RECHAZADO
        </h1>

        <p className="text-gray-300 text-lg">
          Hubo un problema con tu pago. Podés intentarlo nuevamente.
        </p>

        <Link
          to="/shows"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-md transition-all duration-200"
        >
          Intentar nuevamente
        </Link>
      </div>
    </div>
  );
}
