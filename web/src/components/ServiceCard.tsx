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

      <div className="p-4 lg:p-5 flex-1 flex flex-col">
        <h3 className="font-kai text-[24px] text-[color:var(--color-ink)] leading-tight">
          {service.name}
        </h3>
        {service.summary && (
          <p className="mt-1.5 text-[14px] text-[color:var(--color-ink-soft)] leading-relaxed line-clamp-2">
            {service.summary}
          </p>
        )}

        <div className="mt-3.5">
          <PriceBlock price={service.price} compact />
        </div>

        <div className="mt-3 pt-3 border-t border-[color:var(--color-line)] flex items-center justify-between">
          <span className="text-[13px] text-[color:var(--color-ink-soft)] tracking-wider">
            了解原理与流程
          </span>
          <span className="text-[color:var(--color-gold)] inline-flex items-center gap-1 transition-transform group-hover:translate-x-1">
            查看 <ChevronRight24Regular className="w-4 h-4" />
          </span>
        </div>
      </div>
    </button>
  );
}
