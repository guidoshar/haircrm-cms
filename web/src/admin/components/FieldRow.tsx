import { ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[13px] text-[color:var(--color-ink)] font-medium">{label}</span>
      {hint && <span className="ml-2 text-[12px] text-[color:var(--color-ink-soft)]">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full px-3 py-2 rounded-lg bg-white border border-[color:var(--color-line)] outline-none focus:border-[color:var(--color-gold)] transition " +
        (props.className || "")
      }
    />
  );
}

export function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="number"
      {...props}
      className={
        "w-full px-3 py-2 rounded-lg bg-white border border-[color:var(--color-line)] outline-none focus:border-[color:var(--color-gold)] transition num " +
        (props.className || "")
      }
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={
        "w-full px-3 py-2 rounded-lg bg-white border border-[color:var(--color-line)] outline-none focus:border-[color:var(--color-gold)] transition leading-relaxed " +
        (props.className || "")
      }
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={
        "w-full px-3 py-2 rounded-lg bg-white border border-[color:var(--color-line)] outline-none focus:border-[color:var(--color-gold)] transition " +
        (props.className || "")
      }
    />
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <span
        onClick={() => onChange(!checked)}
        className={
          "relative w-10 h-6 rounded-full transition " +
          (checked ? "bg-[color:var(--color-gold)]" : "bg-[color:var(--color-line)]")
        }
      >
        <span
          className={
            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition " +
            (checked ? "left-[18px]" : "left-0.5")
          }
        />
      </span>
      {label && <span className="text-[13px] text-[color:var(--color-ink)]">{label}</span>}
    </label>
  );
}
