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
    <div
      className={`flex flex-col gap-3 ${
        align === "center" ? "items-center text-center" : "items-start"
      }`}
    >
      {eyebrow && (
        <span className="text-[10px] tracking-[0.5em] text-[color:var(--color-sage-500)] uppercase font-medium">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif-cn text-[34px] lg:text-[44px] text-[color:var(--color-ink)] leading-[1.18] tracking-[0.04em] flex items-center gap-3">
        {icon}
        <span>{title}</span>
      </h2>
      {align === "center" ? (
        <span className="block w-12 h-px bg-gradient-to-r from-transparent via-[color:var(--color-sage-300)] to-transparent" />
      ) : (
        <span className="block w-10 h-px bg-gradient-to-r from-[color:var(--color-sage-300)] to-transparent" />
      )}
      {subtitle && (
        <p className="text-[color:var(--color-ink-soft)] max-w-2xl text-[15px] lg:text-[17px] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
