import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { Ticket, ExternalLink, CreditCard, DoorOpen } from "lucide-react";

// Valores que acepta y devuelve el backend (Evento.modoVenta / Evento.plataformaVenta)

export const MODOS_VENTA = [
  {
    value: "MERCADO_PAGO",
    label: "Mercado Pago (web)",
    descripcion: "Se compra desde la página y se genera la entrada con QR.",
    Icon: CreditCard,
  },
  {
    value: "EXTERNO",
    label: "Plataforma externa",
    descripcion: "Ticketek, WhatsApp, Instagram u otra: el botón abre un link.",
    Icon: ExternalLink,
  },
  {
    value: "SIN_VENTA_ONLINE",
    label: "Sin venta online",
    descripcion: "No hay botón de compra; podés dejar una nota (ej: entradas en puerta).",
    Icon: DoorOpen,
  },
];

export const PLATAFORMAS_VENTA = {
  TICKETEK: {
    label: "Ticketek",
    boton: "Comprar en Ticketek",
    Icon: Ticket,
    placeholder: "https://www.ticketek.com.ar/...",
  },
  WHATSAPP: {
    label: "WhatsApp",
    boton: "Comprar por WhatsApp",
    Icon: FaWhatsapp,
    placeholder: "https://wa.me/5492211234567",
    ayuda: "Formato: https://wa.me/ + código de país + número, sin espacios ni signos.",
  },
  INSTAGRAM: {
    label: "Instagram",
    boton: "Comprar por Instagram",
    Icon: FaInstagram,
    placeholder: "https://www.instagram.com/lasbestiasok/",
  },
  OTRA: {
    label: "Otra",
    boton: "Comprar entradas",
    Icon: ExternalLink,
    placeholder: "https://...",
  },
};

// Eventos viejos (o backend sin actualizar) no traen modoVenta: se tratan como Mercado Pago
export function getModoVenta(evento) {
  return evento?.modoVenta || "MERCADO_PAGO";
}

export function esUrlValida(url) {
  try {
    const u = new URL(url);
    return (u.protocol === "http:" || u.protocol === "https:") && !!u.hostname;
  } catch {
    return false;
  }
}

// Datos del botón de compra externa (null si no corresponde o la URL no es segura)
export function getVentaExterna(evento) {
  if (getModoVenta(evento) !== "EXTERNO" || !esUrlValida(evento.urlVenta)) return null;
  const plataforma = PLATAFORMAS_VENTA[evento.plataformaVenta] || PLATAFORMAS_VENTA.OTRA;
  return { ...plataforma, url: evento.urlVenta };
}

// Extrae el mensaje {"error": "..."} que devuelve el backend en los 400
export function mensajeDeError(error, fallback) {
  return error?.response?.data?.error || error?.message || fallback;
}
