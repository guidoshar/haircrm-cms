import type { Price } from "../lib/types";
import { yuan } from "../lib/format";

export default function PriceBlock({ price, compact = false }: { price?: Price | null; compact?: boolean }) {
  if (!price) return null;
  if (compact) {
    return (
      <div className="num flex items-baseline gap-2">
        <span className="text-[13px] text-[color:var(--color-ink-soft)] line-through">
          {yuan(price.store_price)}
        </span>
        <span className="text-[22px] font-semibold text-[color:var(--color-gold)]">
          {yuan(price.member_price)}
        </span>
        <span className="text-[12px] text-[color:var(--color-ink-soft)]">起</span>
      </div>
    );
  }
  const rows: Array<{ label: string; value: number; tag?: string }> = [
    { label: "门店价", value: price.store_price },
    { label: "贵宾卡", value: price.member_price, tag: "VIP" },
    { label: "白金卡", value: price.platinum_price, tag: "Platinum" },
    { label: "钻石卡", value: price.diamond_price, tag: "Diamond" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 num">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-baseline justify-between rounded-lg px-3 py-2 bg-[color:var(--color-cream-warm)] border border-[color:var(--color-line)]"
        >
          <span className="text-[13px] text-[color:var(--color-ink-soft)]">{r.label}</span>
          <span className="text-[18px] font-semibold text-[color:var(--color-ink)]">
            {yuan(r.value)}
          </span>
        </div>
      ))}
      {price.taste_price > 0 && (
        <div className="col-span-2 flex items-center justify-between rounded-lg px-3 py-2 bg-gradient-to-r from-[color:var(--color-gold)]/12 to-transparent border border-[color:var(--color-gold)]/25">
          <span className="text-[13px] text-[color:var(--color-gold)] tracking-wider">体验价</span>
          <span className="text-[20px] font-semibold text-[color:var(--color-gold)]">
            {yuan(price.taste_price)}
          </span>
        </div>
      )}
    </div>
  );
}
