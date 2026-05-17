import type { Pkg } from "../lib/types";
import { yuan } from "../lib/format";

const KIND_LABEL: Record<string, string> = {
  course5: "课程",
  ten1: "次卡",
  quarter: "季卡",
  half: "半年卡",
  addon: "搭配建议",
};

const KIND_TONE: Record<string, string> = {
  course5: "chip chip-gold",
  ten1: "chip chip-gold",
  quarter: "chip",
  half: "chip",
  addon: "chip chip-ink",
};

export default function PackageList({ packages }: { packages: Pkg[] }) {
  if (!packages?.length) return null;
  return (
    <div className="space-y-2.5">
      {packages.map((p) => (
        <div
          key={p.id}
          className="flex items-center gap-3 rounded-xl px-3.5 py-3 bg-white border border-[color:var(--color-line)]"
        >
          <span className={KIND_TONE[p.kind] || "chip"}>{KIND_LABEL[p.kind] || p.kind}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <span className="text-[15px] text-[color:var(--color-ink)] font-medium">{p.label}</span>
              {p.price > 0 && (
                <span className="num text-[18px] font-semibold text-[color:var(--color-gold)]">
                  {yuan(p.price)}
                </span>
              )}
            </div>
            {p.times > 0 && (
              <div className="num text-[12px] text-[color:var(--color-ink-soft)]">
                共 {p.times} 次
                {p.gift_count > 0 ? ` · 加赠 ${p.gift_count} 次` : ""}
              </div>
            )}
            {p.options_text && (
              <div className="text-[12px] text-[color:var(--color-ink-soft)] mt-1">{p.options_text}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
