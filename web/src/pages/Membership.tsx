import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Api } from "../lib/api";
import type { Tier } from "../lib/types";
import SectionTitle from "../components/SectionTitle";
import Markdown from "../components/Markdown";
import {
  Crown24Regular,
  Diamond24Regular,
  Sparkle24Regular,
  CheckmarkCircle24Filled,
} from "@fluentui/react-icons";

const ICONS: Record<string, any> = {
  Sparkle: <Sparkle24Regular />,
  Crown: <Crown24Regular />,
  Diamond: <Diamond24Regular />,
};

export default function Membership() {
  const { data: tiers } = useQuery<Tier[]>({ queryKey: ["tiers"], queryFn: Api.tiers });

  return (
    <div className="max-w-[1480px] mx-auto px-6 lg:px-12 pt-10 lg:pt-14">
      <SectionTitle
        eyebrow="MEMBERSHIP"
        title="会员体系"
        subtitle="三档之选，三种节奏，把『经常被照顾』变成日常的小确幸。"
      />

      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7 mt-12">
        {(tiers || []).map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="brand-card lift relative overflow-hidden flex flex-col p-7 lg:p-9"
          >
            <div
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-20 blur-3xl"
              style={{ background: t.accent_color }}
            />
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${t.accent_color}, transparent)`,
              }}
            />
            <div className="relative">
              <span
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                style={{ background: `linear-gradient(180deg, ${t.accent_color}, ${t.accent_color}cc)` }}
              >
                {t.icon_key && ICONS[t.icon_key] ? ICONS[t.icon_key] : <Sparkle24Regular />}
              </span>
              <h3 className="font-serif-cn mt-5 text-[36px] tracking-[0.06em] text-[color:var(--color-ink)] leading-tight">
                {t.name}
              </h3>
              <p className="text-[12px] tracking-[0.42em] uppercase mt-1" style={{ color: t.accent_color }}>
                {t.slug}
              </p>

              <div className="num mt-5 flex items-baseline gap-1.5">
                <span className="text-[16px] text-[color:var(--color-ink-soft)]">¥</span>
                <span className="text-[56px] font-semibold leading-none" style={{ color: t.accent_color }}>
                  {t.fee.toLocaleString("zh-CN")}
                </span>
              </div>
              <p
                className="mt-1.5 inline-block px-3 py-1 rounded-full text-[13px] font-medium"
                style={{
                  background: `${t.accent_color}1F`,
                  color: t.accent_color,
                }}
              >
                {t.discount_text}
              </p>

              <div className="mt-5 brand-divider" />

              <ul className="mt-5 space-y-2.5 text-[14.5px] text-[color:var(--color-ink-soft)]">
                {t.benefits_md
                  .split("\n")
                  .filter((l) => l.trim().startsWith("-"))
                  .map((line, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckmarkCircle24Filled
                        className="w-5 h-5 flex-none mt-0.5"
                        style={{ color: t.accent_color }}
                      />
                      <span>{line.replace(/^-\s*/, "")}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="brand-stamp mt-16" />
      <p className="text-center text-[14px] text-[color:var(--color-ink-soft)] max-w-2xl mx-auto leading-relaxed">
        诗碧曼产品按全国统一零售价执行，不参与办卡折扣。<br />
        办卡可享对应折扣的项目优惠，可与课程价、季卡、半年卡叠加使用，详情请咨询门店。
      </p>
    </div>
  );
}
