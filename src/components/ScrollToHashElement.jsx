import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHashElement() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      // Al cambiar de página sin ancla, empezar desde arriba
      window.scrollTo(0, 0);
      return;
    }

    const id = location.hash.replace("#", "");
    let intentos = 0;
    let timer;

    // Las secciones cargan datos async: se reintenta hasta que el elemento exista
    const buscar = () => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else if (intentos++ < 20) {
        timer = setTimeout(buscar, 150);
      }
    };
    timer = setTimeout(buscar, 300);

    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return null;
}
