import type { Step } from "../lib/types";
import { Clock24Regular } from "@fluentui/react-icons";

export default function StepsTimeline({ steps, totalMin }: { steps: Step[]; totalMin: number }) {
  if (!steps || !steps.length) return null;
  const sum = Math.max(
    1,
    steps.reduce((a, b) => a + (b.minutes || 0), 0) || totalMin || 1
  );
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <h4 className="font-kai text-[22px] text-[color:var(--color-ink)]">服务流程 · 时间分配</h4>
        <span className="chip chip-gold num">
          <Clock24Regular className="w-4 h-4" />
          总计 {totalMin || sum} 分钟
        </span>
      </div>

      <div className="flex h-3 rounded-full overflow-hidden border border-[color:var(--color-line)] bg-white">
        {steps.map((s, i) => {
          const w = ((s.minutes || 1) / sum) * 100;
          const colors = [
            "var(--color-leaf-soft)",
            "var(--color-gold-light)",
            "var(--color-rose)",
            "var(--color-leaf)",
            "var(--color-gold)",
            "var(--color-sepia)",
          ];
          return (
            <div
              key={i}
              style={{ width: `${w}%`, background: colors[i % colors.length] }}
              title={`${s.title} · ${s.minutes || 0}min`}
            />
          );
        })}
      </div>

      <ol className="mt-4 space-y-2.5">
        {steps.map((s, i) => (
          <li
            key={s.id || i}
            className="flex gap-3 items-start rounded-lg px-3 py-2.5 bg-[color:var(--color-cream-warm)] border border-[color:var(--color-line)]"
          >
            <span className="num flex-none w-7 h-7 rounded-full bg-[color:var(--color-gold)] text-white text-[13px] font-semibold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-[color:var(--color-ink)]">{s.title}</span>
                {s.minutes ? (
                  <span className="num text-[12px] text-[color:var(--color-ink-soft)]">
                    {s.minutes} 分钟
                  </span>
                ) : null}
              </div>
              {s.description && (
                <p className="text-[13px] text-[color:var(--color-ink-soft)] mt-1 leading-relaxed">
                  {s.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
