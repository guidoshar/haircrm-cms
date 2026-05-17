import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Api } from "../lib/api";
import type { Store } from "../lib/types";
import SectionTitle from "../components/SectionTitle";
import Markdown from "../components/Markdown";
import {
  Location24Regular,
  Phone24Regular,
  Clock24Regular,
  Star24Filled,
  Sparkle24Regular,
} from "@fluentui/react-icons";

export default function Stores() {
  const { data: stores } = useQuery<Store[]>({ queryKey: ["stores"], queryFn: Api.stores });
  return (
    <div className="max-w-[1480px] mx-auto px-6 lg:px-12 pt-10 lg:pt-14">
      <SectionTitle
        eyebrow="OUR STORES"
        title="四家门店 · 各自温度"
        subtitle="每一处都不太一样 —— 城市里这些角落，是我们留给你做『小憩』的位置。"
      />
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mt-12">
        {(stores || []).map((s, i) => (
          <motion.article
            key={s.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            className="brand-card lift overflow-hidden flex flex-col"
          >
            <div className="relative aspect-[16/9] bg-[color:var(--color-sepia-soft)] overflow-hidden">
              {s.image_url ? (
                <img
                  src={s.image_url}
                  alt={s.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Sparkle24Regular className="w-12 h-12 text-[color:var(--color-sepia)]" />
                </div>
              )}
              {s.is_flagship && (
                <span className="absolute top-4 left-4 chip chip-gold bg-white/95 inline-flex items-center gap-1">
                  <Star24Filled className="w-3.5 h-3.5" />
                  旗舰店
                </span>
              )}
            </div>
            <div className="p-6 lg:p-8">
              <h3 className="font-kai text-[32px] text-[color:var(--color-ink)]">{s.name}</h3>
              {s.intro_md && (
                <div className="mt-2 text-[15px] text-[color:var(--color-ink-soft)]">
                  <Markdown>{s.intro_md}</Markdown>
                </div>
              )}

              <ul className="mt-5 space-y-2 text-[14px] text-[color:var(--color-ink-soft)]">
                <li className="flex items-start gap-3">
                  <Location24Regular className="w-5 h-5 flex-none mt-0.5 text-[color:var(--color-gold)]" />
                  <span>{s.address || "—"}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone24Regular className="w-5 h-5 flex-none mt-0.5 text-[color:var(--color-gold)]" />
                  <span className="num">{s.phone || "—"}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock24Regular className="w-5 h-5 flex-none mt-0.5 text-[color:var(--color-gold)]" />
                  <span className="num">{s.hours || "10:00 - 22:00"}</span>
                </li>
              </ul>

              {s.address && (
                <div className="mt-6 flex gap-2">
                  <a
                    href={`https://uri.amap.com/marker?name=${encodeURIComponent(s.name)}&position=${encodeURIComponent(s.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary-harmony text-sm"
                  >
                    <Location24Regular className="w-4 h-4" />
                    导航至此处
                  </a>
                  {s.phone && (
                    <a href={`tel:${s.phone}`} className="btn-secondary-harmony text-sm">
                      <Phone24Regular className="w-4 h-4" />
                      预约咨询
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
