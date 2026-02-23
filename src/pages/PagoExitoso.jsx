import { useLocation, Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

export default function PagoExitoso() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const paymentId = params.get("payment_id");
  const status = params.get("status");

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-center text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/images/fondo7.png')" }}
    >
      {/* Fondo oscuro */}
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>

      <div className="relative z-10 max-w-3xl px-6 space-y-8">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto" />

        <h1 className="text-5xl font-extrabold text-green-400 tracking-widest">
          ¡PAGO CONFIRMADO!
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed">
          Gracias por comprar tu entrada para{" "}
          <span className="text-red-500 font-bold">LAS BESTIAS</span>.
        </p>

        <div className="bg-black bg-opacity-60 border border-green-500 rounded-xl p-6 space-y-3">
          <p className="text-gray-400">
            <span className="text-green-400 font-semibold">Estado:</span>{" "}
            {status}
          </p>
          <p className="text-gray-400">
            <span className="text-green-400 font-semibold">
              ID de pago:
            </span>{" "}
            {paymentId}
          </p>
        </div>

        <p className="text-gray-400 text-sm italic">
          Recibirás un email con la confirmación de tu entrada.
        </p>

        <Link
          to="/shows"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-md transition-all duration-200"
        >
          Volver a Shows
        </Link>
      </div>
    </div>
  );
}
