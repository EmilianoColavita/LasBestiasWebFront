import { useState, useEffect, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { authFetch } from "../api/authFetch";

export default function ScannerQR({ onValidacionExitosa }) {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [modoScanner, setModoScanner] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [procesando, setProcesando] = useState(false);

  const audioOk = useRef(null);
  const audioError = useRef(null);

  const cerrarResultado = () => {
    setResultado(null);
    setModoScanner(false);
  };

  useEffect(() => {
    if (resultado) {
      const timer = setTimeout(() => {
        cerrarResultado();
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [resultado]);

  const handleScan = async (result) => {
    if (!result || result.length === 0 || procesando) return;

    setProcesando(true);

    try {
      let qrValue = result[0].rawValue;

      if (qrValue.includes("/")) {
        qrValue = qrValue.split("/").pop();
      }

      const response = await authFetch(`${BASE_URL}/api/entradas/validar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: qrValue }),
      });

      const text = await response.text();

      if (response.ok) {
        const data = JSON.parse(text);

        // 🔊 SONIDO VALIDADO
        audioOk.current?.play();

        setResultado({
          tipo: "success",
          mensaje: "Ingreso permitido",
          nombre: data.comprador,
        });

        onValidacionExitosa();
      } else {
        // 🚨 SONIDO ERROR
        audioError.current?.play();

        setResultado({
          tipo: "error",
          mensaje: text,
        });
      }
    } catch (err) {
      console.error(err);

      audioError.current?.play();

      setResultado({
        tipo: "error",
        mensaje: "Error al validar entrada",
      });
    }

    setTimeout(() => {
      setProcesando(false);
    }, 2000);
  };

  return (
    <div className="mb-6">
      {/* 🔊 Audios ocultos */}
      <audio ref={audioOk} src="/sounds/ok.mp3" preload="auto" />
      <audio ref={audioError} src="/sounds/error.mp3" preload="auto" />

      <button
        onClick={() => {
          setModoScanner(!modoScanner);
          setResultado(null);
        }}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-semibold"
      >
        {modoScanner ? "Cerrar Escáner" : "Escanear Entrada"}
      </button>

      {modoScanner && (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 mt-4 text-center">
          <h2 className="text-lg text-yellow-400 mb-4">
            Escanear QR 🎟️
          </h2>

          <div className="flex justify-center">
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
              <Scanner
                onScan={handleScan}
                onError={(error) => console.error(error)}
                styles={{
                  container: { width: "100%" },
                  video: {
                    width: "100%",
                    height: "280px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  },
                }}
              />
            </div>
          </div>

          {resultado && (
            <div
              className={`mt-6 p-6 rounded-xl text-white font-bold text-lg ${
                resultado.tipo === "success"
                  ? "bg-green-600"
                  : "bg-red-600"
              }`}
            >
              {resultado.tipo === "success" ? (
                <>
                  <div className="text-2xl mb-2">✅ VÁLIDO</div>
                  <div className="text-xl">{resultado.nombre}</div>
                </>
              ) : (
                <>
                  <div className="text-2xl mb-2">❌ ENTRADA INVÁLIDA</div>
                  <div>{resultado.mensaje}</div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}