import type { Service } from "../lib/types";
import { Clock24Regular, ChevronRight24Regular, Sparkle24Regular } from "@fluentui/react-icons";
import PriceBlock from "./PriceBlock";

export default function ServiceCard({
  service,
  onClick,
}: {
  service: Service;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="brand-card lift text-left w-full overflow-hidden flex flex-col group"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[color:var(--color-sepia-soft)]">
        {service.cover_image_url ? (
          <img
            src={service.cover_image_url}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[color:var(--color-sepia)]">
            <Sparkle24Regular className="w-12 h-12 opacity-40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        {service.time_min ? (
          <span className="absolute top-3 right-3 chip chip-ink num bg-white/90 backdrop-blur">
            <Clock24Regular className="w-3.5 h-3.5" />
            {service.time_min}min
          </span>
        ) : null}
      </div>

      <div className="p-5 lg:p-6 flex-1 flex flex-col">
        <h3 className="font-serif-cn text-[22px] tracking-wide text-[color:var(--color-ink)] leading-tight">
          {service.name}
        </h3>
        {service.summary && (
          <p className="mt-2 text-[13.5px] text-[color:var(--color-ink-soft)] leading-[1.75] line-clamp-2">
            {service.summary}
          </p>
        )}

        <div className="mt-4">
          <PriceBlock price={service.price} compact />
        </div>

        <div className="mt-4 pt-3.5 border-t border-[color:var(--color-line-soft)] flex items-center justify-between">
          <span className="text-[12px] text-[color:var(--color-ink-mute)] tracking-[0.18em]">
            了解原理与流程
          </span>
          <span className="text-[color:var(--color-sage-600)] inline-flex items-center gap-1 text-[13px] tracking-[0.18em] transition-transform group-hover:translate-x-1">
            查看 <ChevronRight24Regular className="w-4 h-4" />
          </span>
        </div>
      </div>
    </button>
  );
}
