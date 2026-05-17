import { ReactNode } from "react";

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
  icon,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  icon?: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2 ${align === "center" ? "items-center text-center" : "items-start"}`}>
      {eyebrow && (
        <span className="text-[11px] tracking-[0.42em] text-[color:var(--color-gold)] uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="font-kai text-3xl lg:text-[40px] text-[color:var(--color-ink)] leading-tight flex items-center gap-3">
        {icon}
        <span>{title}</span>
      </h2>
      {subtitle && (
        <p className="text-[color:var(--color-ink-soft)] max-w-2xl text-base lg:text-[17px]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
