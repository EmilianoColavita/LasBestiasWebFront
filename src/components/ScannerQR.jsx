import { useState, useEffect, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { authFetch } from "../api/authFetch";
import { ScanLine, X, CheckCircle2, XCircle } from "lucide-react";

export default function ScannerQR({ onValidacionExitosa, autoStart = false }) {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [modoScanner, setModoScanner] = useState(autoStart);
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

  const exito = resultado?.tipo === "success";

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
        className={modoScanner ? "btn-outline w-full sm:w-auto" : "btn-primary w-full sm:w-auto"}
      >
        {modoScanner ? <X size={16} /> : <ScanLine size={16} />}
        {modoScanner ? "Cerrar escáner" : "Escanear entrada"}
      </button>

      {modoScanner && (
        <div className="surface-card mt-4 p-4 text-center sm:p-6">
          <p className="form-label">Apuntá la cámara al código QR de la entrada</p>

          <div className="mt-3 flex justify-center">
            <div className="w-full max-w-sm overflow-hidden rounded-2xl border-2 border-bestia/50 md:max-w-md">
              <Scanner
                onScan={handleScan}
                onError={(error) => console.error(error)}
                styles={{
                  container: { width: "100%" },
                  video: {
                    width: "100%",
                    height: "280px",
                    objectFit: "cover",
                  },
                }}
              />
            </div>
          </div>

          {resultado && (
            <div
              className={`mx-auto mt-5 max-w-md rounded-2xl p-5 text-white ${
                exito ? "bg-emerald-600" : "bg-red-600"
              }`}
            >
              {exito ? (
                <>
                  <CheckCircle2 size={36} className="mx-auto mb-2" />
                  <div className="font-display text-3xl tracking-wide">Válido</div>
                  <div className="mt-1 text-lg font-semibold">{resultado.nombre}</div>
                </>
              ) : (
                <>
                  <XCircle size={36} className="mx-auto mb-2" />
                  <div className="font-display text-3xl tracking-wide">Entrada inválida</div>
                  <div className="mt-1 text-sm">{resultado.mensaje}</div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
