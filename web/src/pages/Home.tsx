import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LeafOne24Regular as Leaf24Regular,
  HandRight24Regular,
  Beaker24Regular,
  ChevronRight24Regular,
  Sparkle24Filled,
} from "@fluentui/react-icons";
import { Api } from "../lib/api";
import type { Banner, SiteConfig, Category, Store, Tier } from "../lib/types";
import SectionTitle from "../components/SectionTitle";
import Markdown from "../components/Markdown";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Home() {
  const { data: site } = useQuery<SiteConfig>({ queryKey: ["site"], queryFn: Api.site });
  const { data: banners } = useQuery<Banner[]>({
    queryKey: ["banners", "home"],
    queryFn: () => Api.banners("home"),
  });
  const { data: menu } = useQuery<Category[]>({ queryKey: ["menu"], queryFn: Api.menu });
  const { data: stores } = useQuery<Store[]>({ queryKey: ["stores"], queryFn: Api.stores });
  const { data: tiers } = useQuery<Tier[]>({ queryKey: ["tiers"], queryFn: Api.tiers });

  const hero = banners?.[0];

  return (
    <div className="space-y-20 lg:space-y-28">
      {/* HERO */}
      <section className="relative h-[78vh] min-h-[560px] max-h-[820px] overflow-hidden">
        {hero?.image_url ? (
          <img
            src={hero.image_url}
            alt={hero.headline || "诗碧曼"}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-sepia-soft)] to-[color:var(--color-cream-warm)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/35 to-black/65" />

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="relative h-full max-w-[1480px] mx-auto px-6 lg:px-12 flex flex-col justify-end pb-16 lg:pb-24 text-white"
        >
          <span className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 text-[12px] tracking-[0.4em] uppercase">
            <Sparkle24Filled className="w-4 h-4 text-[color:var(--color-gold-light)]" />
            诗碧曼 · 养发会所
          </span>
          <h1 className="font-kai mt-5 text-[56px] lg:text-[88px] leading-[1.05] tracking-wider drop-shadow-[0_2px_24px_rgba(0,0,0,0.4)]">
            {hero?.headline || site?.slogan_main || "草本精华  缕缕用心"}
          </h1>
          <p className="mt-4 max-w-2xl text-[18px] lg:text-[22px] text-white/90 font-kai tracking-wide">
            {hero?.subline || site?.slogan_sub || "诗碧曼养发，让你持久年轻"}
          </p>
          <p className="mt-6 max-w-xl text-[15px] text-white/80 leading-relaxed">
            请尽情享受城市中的小憩时刻，让头发恢复活力 —— 这是我们能为你做的事。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/services" className="btn-primary-harmony">
              <span>进入项目</span>
              <ChevronRight24Regular className="w-5 h-5" />
            </Link>
            <Link
              to="/about"
              className="px-5 py-2.5 rounded-full border border-white/40 text-white/95 hover:bg-white/10 transition flex items-center gap-2"
            >
              <Leaf24Regular className="w-5 h-5" />
              了解理念
            </Link>
          </div>
        </motion.div>
      </section>

      {/* PHILOSOPHY 三栏 */}
      <section className="max-w-[1480px] mx-auto px-6 lg:px-12">
        <SectionTitle
          eyebrow="OUR PHILOSOPHY"
          title="草本精华 · 缕缕用心"
          subtitle="不夸张承诺，只把每一寸发缝、每一次按压里的『用心』写下来。"
        />
        <div className="grid md:grid-cols-3 gap-5 lg:gap-7 mt-10">
          {[
            {
              icon: <Leaf24Regular />,
              title: "草本配方",
              tone: "var(--color-leaf)",
              body: "姜、玫瑰、艾草等天然原料，按头皮状态调配。不是简单『洗一洗』，是给毛囊和经络一次温柔的呼吸。",
            },
            {
              icon: <HandRight24Regular />,
              title: "古法手法",
              tone: "var(--color-gold)",
              body: "源自经络的辨证施护，结合中医视角看头皮、耳后淋巴与颈椎。让『放松』是身体能感知的事。",
            },
            {
              icon: <Beaker24Regular />,
              title: "数字检测",
              tone: "var(--color-rose)",
              body: "护理前 + 复检，每一次都有据可查的变化。我们不靠感觉说『有效』，让数据替我们开口。",
            },
          ].map((c, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="brand-card lift p-6 lg:p-8"
            >
              <span
                className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white"
                style={{ background: `linear-gradient(180deg, ${c.tone}, ${c.tone}cc)` }}
              >
                {c.icon}
              </span>
              <h3 className="font-kai mt-4 text-[28px] text-[color:var(--color-ink)]">{c.title}</h3>
              <p className="mt-2 text-[15px] text-[color:var(--color-ink-soft)] leading-relaxed">
                {c.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATEGORIES 概览 */}
      {menu && menu.length > 0 && (
        <section className="max-w-[1480px] mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <SectionTitle
              align="left"
              eyebrow="OUR SERVICES"
              title="六大体系 · 一人一方"
              subtitle="头皮·清 / 调 / 补 / 养 + 发芯赋活 + 臻享疗愈，按状态分阶段照顾。"
            />
            <Link to="/services" className="btn-secondary-harmony">
              <span>查看全部项目</span>
              <ChevronRight24Regular className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mt-10">
            {menu.map((c) => (
              <Link
                key={c.id}
                to={`/services?cat=${c.slug}`}
                className="brand-card lift p-5 lg:p-6 group"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-kai text-[28px] text-[color:var(--color-ink)] group-hover:text-[color:var(--color-gold)] transition">
                    {c.name}
                  </h3>
                  <span className="num text-[13px] text-[color:var(--color-ink-soft)]">
                    {c.services.length} 项
                  </span>
                </div>
                {c.tagline && (
                  <p className="mt-1 text-[14px] text-[color:var(--color-ink-soft)]">{c.tagline}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.services.slice(0, 4).map((s) => (
                    <span key={s.id} className="chip">
                      {s.name}
                    </span>
                  ))}
                  {c.services.length > 4 && (
                    <span className="chip chip-ink">+{c.services.length - 4}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* MEMBERSHIP teaser */}
      {tiers && tiers.length > 0 && (
        <section className="max-w-[1480px] mx-auto px-6 lg:px-12">
          <SectionTitle
            eyebrow="MEMBERSHIP"
            title="会员体系 · 三档之选"
            subtitle="贵宾 / 白金 / 钻石，三种节奏适配三种忙碌生活。"
          />
          <div className="grid lg:grid-cols-3 gap-5 lg:gap-7 mt-10">
            {tiers.map((t) => (
              <Link
                to="/membership"
                key={t.id}
                className="brand-card lift p-6 lg:p-7 relative overflow-hidden"
              >
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-15 blur-2xl"
                  style={{ background: t.accent_color }}
                />
                <span
                  className="text-[11px] tracking-[0.42em] uppercase"
                  style={{ color: t.accent_color }}
                >
                  {t.slug}
                </span>
                <h3 className="font-kai mt-2 text-[34px] text-[color:var(--color-ink)]">{t.name}</h3>
                <div className="num mt-3 flex items-baseline gap-1">
                  <span className="text-[14px] text-[color:var(--color-ink-soft)]">¥</span>
                  <span className="text-[44px] font-semibold" style={{ color: t.accent_color }}>
                    {t.fee.toLocaleString("zh-CN")}
                  </span>
                </div>
                <p
                  className="mt-1 text-[14px] tracking-wider"
                  style={{ color: t.accent_color }}
                >
                  {t.discount_text}
                </p>
                <div className="mt-3 text-[13px] text-[color:var(--color-ink-soft)]">
                  <Markdown>{t.benefits_md}</Markdown>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* STORES */}
      {stores && stores.length > 0 && (
        <section className="max-w-[1480px] mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <SectionTitle
              align="left"
              eyebrow="OUR STORES"
              title="四家门店 · 各自温度"
              subtitle="陆家嘴 / 新天地 / 曹路花园城 / 金茂大厦黑金店，每一处都有它该有的样子。"
            />
            <Link to="/stores" className="btn-secondary-harmony">
              <span>了解门店</span>
              <ChevronRight24Regular className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mt-10">
            {stores.map((s) => (
              <Link
                to="/stores"
                key={s.id}
                className="brand-card lift overflow-hidden"
              >
                <div className="relative aspect-[5/4] bg-[color:var(--color-sepia-soft)] overflow-hidden">
                  {s.image_url ? (
                    <img
                      src={s.image_url}
                      alt={s.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkle24Filled className="w-10 h-10 text-[color:var(--color-sepia)]" />
                    </div>
                  )}
                  {s.is_flagship && (
                    <span className="absolute top-3 left-3 chip chip-gold bg-white/95">旗舰</span>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-kai text-[22px] text-[color:var(--color-ink)]">{s.name}</h4>
                  <p className="mt-1 text-[13px] text-[color:var(--color-ink-soft)] line-clamp-2">
                    {s.address}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
