import { ReactNode } from "react";

export default function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 px-6 lg:px-10 py-5 border-b border-[color:var(--color-line)] bg-[color:var(--color-cream-warm)]">
      <div>
        <h1 className="font-kai text-[28px] text-[color:var(--color-ink)]">{title}</h1>
        {subtitle && <p className="text-[13px] text-[color:var(--color-ink-soft)] mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
}
