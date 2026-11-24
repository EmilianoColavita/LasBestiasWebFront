import Reveal from "./Reveal";

// Cabecera editorial reutilizable: eyebrow + título + acción opcional a la derecha
export default function SectionHeader({ eyebrow, title, action, align = "left", as = "h2" }) {
  const Title = as;
  const centered = align === "center";

  return (
    <Reveal
      className={`mb-10 flex flex-col gap-6 md:mb-14 ${
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={centered ? "flex flex-col items-center" : ""}>
        {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
        <Title className="section-title">{title}</Title>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
