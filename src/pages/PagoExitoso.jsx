import { useLocation, Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function PagoExitoso() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const paymentId = params.get("payment_id");
  const status = params.get("status");

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!paymentId) return;

    // Intentamos obtener resumen simple (opcional)
    fetch(`${BASE_URL}/api/entradas/payment/${paymentId}/resumen`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setResumen(data);
        setCargando(false);
      })
      .catch(() => {
        // Si todavía no está listo el webhook, igual mostramos confirmación
        setCargando(false);
      });
  }, [paymentId, BASE_URL]);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-center text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/images/fondo7.png')" }}
    >
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
            <span className="text-green-400 font-semibold">
              Estado:
            </span>{" "}
            {status}
          </p>

          <p className="text-gray-400">
            <span className="text-green-400 font-semibold">
              ID de pago:
            </span>{" "}
            {paymentId}
          </p>

          {resumen && (
            <>
              <p className="text-gray-400">
                <span className="text-green-400 font-semibold">
                  Evento:
                </span>{" "}
                {resumen.evento}
              </p>

              <p className="text-gray-400">
                <span className="text-green-400 font-semibold">
                  Cantidad:
                </span>{" "}
                {resumen.cantidad}
              </p>

              {resumen.orden && (
                <p className="text-gray-400">
                  <span className="text-green-400 font-semibold">
                    N° de Orden:
                  </span>{" "}
                  {resumen.orden}
                </p>
              )}
            </>
          )}
        </div>

        {cargando && (
          <p className="text-yellow-400 animate-pulse">
            Confirmando tu compra...
          </p>
        )}

        <div className="bg-black bg-opacity-60 border border-yellow-500 rounded-xl p-6 space-y-4">

          <h2 className="text-yellow-400 font-bold text-xl">
            🎟 Tus entradas
          </h2>

          <p className="text-gray-300">
            Te enviamos tus entradas al correo electrónico ingresado
            durante la compra.
          </p>

          <p className="text-gray-400 text-sm">
            Revisá también tu carpeta de spam o promociones.
          </p>

          {resumen?.pdfDisponible && (
            <a
              href={`${BASE_URL}/api/entradas/payment/${paymentId}/pdf`}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded-md transition-all duration-200 inline-block"
            >
              Descargar Entradas (PDF)
            </a>
          )}
        </div>

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