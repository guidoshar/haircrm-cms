import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LeafOne24Regular as Leaf24Regular,
  HandRight24Regular,
  Beaker24Regular,
  ArrowRight24Regular,
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
    <div className="space-y-24 lg:space-y-32 pb-8">
      {/* ============== HERO ============== */}
      <section className="relative h-[78vh] min-h-[580px] max-h-[820px] overflow-hidden">
        {hero?.image_url ? (
          <img
            src={hero.image_url}
            alt={hero.headline || "诗碧曼"}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-sage-700)] to-[color:var(--color-sage-500)]" />
        )}
        {/* 双层蒙层：森林墨 → 透明，再叠一层底部杉绿，复刻皙妍居 hero 卡 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(52,75,48,0.55)] via-transparent to-transparent" />

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="relative h-full max-w-[1480px] mx-auto px-6 lg:px-12 flex flex-col justify-end pb-20 lg:pb-28 text-white"
        >
          <span className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/25 text-[11px] tracking-[0.42em] uppercase">
            <Sparkle24Filled className="w-3.5 h-3.5 text-[color:var(--color-mint)]" />
            Sipimo · 诗碧曼草本养护中心
          </span>
          {/* 主标：细衬线，重点字渐变 */}
          <h1 className="mt-6 font-serif-cn text-[58px] lg:text-[92px] leading-[1.04] tracking-[0.04em] drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
            {hero?.headline || site?.slogan_main || "草本精华  缕缕用心"}
          </h1>
          <p className="mt-3 max-w-2xl text-[20px] lg:text-[26px] font-kai tracking-wider text-gradient-pearl">
            {hero?.subline || site?.slogan_sub || "诗碧曼养发  让你持久年轻"}
          </p>
          <p className="mt-7 max-w-xl text-[15px] text-white/80 leading-relaxed">
            请尽情享受城市中的小憩时刻，让头发恢复活力 —— 这是我们能为你做的事。
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/services" className="btn-primary-harmony">
              <span>进入项目</span>
              <ArrowRight24Regular className="w-5 h-5" />
            </Link>
            <Link
              to="/about"
              className="px-5 py-2.5 rounded-full border border-white/40 text-white/95 hover:bg-white/12 transition flex items-center gap-2 text-[14px] tracking-wider"
            >
              <Leaf24Regular className="w-5 h-5" />
              了解理念
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ============== 三联摄影卡 · 复刻皙妍居那张 ============== */}
      <section className="max-w-[1480px] mx-auto px-6 lg:px-12">
        <div className="mb-10 lg:mb-14">
          <h2 className="text-[44px] lg:text-[60px] leading-[1.18] tracking-[0.04em] text-[color:var(--color-ink)] font-medium">
            自然养发用诗碧曼
          </h2>
          <h2 className="mt-1 text-[44px] lg:text-[60px] leading-[1.18] tracking-[0.04em] font-medium text-gradient-sage">
            祝您今天过得愉快！
          </h2>
          <span className="block mt-4 w-20 h-px bg-gradient-to-r from-[color:var(--color-sage-300)] to-transparent" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-7">
          {[
            {
              to: "/services",
              tag: "服务体系",
              title: "六大体系  一人一方",
              sub: "头皮 · 发芯 · 疗愈三段，按状态分阶段照顾",
              cta: "查看项目",
              fallback: "linear-gradient(160deg,#3D6235 0%,#739968 100%)",
              cover:
                menu?.find((c) => c.hero_image_url)?.hero_image_url ||
                menu?.flatMap((c) => c.services).find((s) => s.cover_image_url)?.cover_image_url,
            },
            {
              to: "/membership",
              tag: "会员体系",
              title: "贵宾  白金  钻石",
              sub: "三种节奏适配三种忙碌生活",
              cta: "了解会员",
              fallback: "linear-gradient(160deg,#243C20 0%,#587B4F 100%)",
              cover: banners?.[1]?.image_url,
            },
            {
              to: "/about",
              tag: "品牌哲学",
              title: "草本配方  古法手法",
              sub: "我们如何用一杯茶的时间，让头皮重新呼吸",
              cta: "走近诗碧曼",
              fallback: "linear-gradient(160deg,#34552E 0%,#92AF89 100%)",
              cover: hero?.image_url,
            },
          ].map((c, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Link to={c.to} className="photo-card block aspect-[5/4] lg:aspect-[5/4]">
                {c.cover ? (
                  <img className="photo-card-img" src={c.cover} alt={c.title} />
                ) : (
                  <div className="photo-card-img" style={{ background: c.fallback }} />
                )}
                <div className="photo-card-overlay" />
                <div className="photo-card-content">
                  <span className="text-[11px] tracking-[0.4em] uppercase text-white/70">
                    {c.tag}
                  </span>
                  <h3 className="font-serif-cn text-[28px] lg:text-[32px] leading-tight">
                    {c.title}
                  </h3>
                  <p className="text-[13px] text-white/75 leading-relaxed">{c.sub}</p>
                  <span className="photo-card-cta">
                    {c.cta} <ArrowRight24Regular className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============== PHILOSOPHY 三栏 ============== */}
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
              tone: "var(--color-sage-500)",
              body: "姜、玫瑰、艾草等天然原料，按头皮状态调配。不是简单『洗一洗』，是给毛囊和经络一次温柔的呼吸。",
            },
            {
              icon: <HandRight24Regular />,
              title: "古法手法",
              tone: "var(--color-sage-600)",
              body: "源自经络的辨证施护，结合中医视角看头皮、耳后淋巴与颈椎。让『放松』是身体能感知的事。",
            },
            {
              icon: <Beaker24Regular />,
              title: "数字检测",
              tone: "var(--color-gold)",
              body: "护理前 + 复检，每一次都有据可查的变化。我们不靠感觉说『有效』，让数据替我们开口。",
            },
          ].map((c, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="brand-card p-7 lg:p-9"
            >
              <span
                className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white"
                style={{ background: `linear-gradient(155deg, ${c.tone}, ${c.tone}cc)` }}
              >
                {c.icon}
              </span>
              <h3 className="font-serif-cn mt-5 text-[26px] tracking-wide text-[color:var(--color-ink)]">
                {c.title}
              </h3>
              <p className="mt-2.5 text-[15px] text-[color:var(--color-ink-soft)] leading-[1.85]">
                {c.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============== CATEGORIES ============== */}
      {menu && menu.length > 0 && (
        <section className="max-w-[1480px] mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <SectionTitle
              align="left"
              eyebrow="OUR SERVICES"
              title="六大体系 · 一人一方"
              subtitle="头皮·清 / 调 / 补 / 养 + 发芯赋活 + 臻享疗愈，按状态分阶段照顾。"
            />
            <Link to="/services" className="btn-step">
              <span>查看全部项目</span>
              <ArrowRight24Regular className="w-4 h-4 arrow" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mt-10">
            {menu.map((c) => (
              <Link
                key={c.id}
                to={`/services?cat=${c.slug}`}
                className="brand-card p-6 lg:p-7 group"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif-cn text-[26px] tracking-wide text-[color:var(--color-ink)] group-hover:text-[color:var(--color-sage-600)] transition">
                    {c.name}
                  </h3>
                  <span className="num text-[12px] text-[color:var(--color-ink-mute)] tracking-wider">
                    {c.services.length} 项
                  </span>
                </div>
                {c.tagline && (
                  <p className="mt-2 text-[14px] text-[color:var(--color-ink-soft)] leading-relaxed">
                    {c.tagline}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-1.5">
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

      {/* ============== MEMBERSHIP ============== */}
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
                className="brand-card p-7 lg:p-8 relative overflow-hidden"
              >
                <div
                  className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10 blur-3xl"
                  style={{ background: t.accent_color }}
                />
                <span
                  className="text-[10px] tracking-[0.5em] uppercase font-medium"
                  style={{ color: t.accent_color }}
                >
                  {t.slug}
                </span>
                <h3 className="font-serif-cn mt-2 text-[32px] tracking-wide text-[color:var(--color-ink)]">
                  {t.name}
                </h3>
                <div className="num mt-4 flex items-baseline gap-1">
                  <span className="text-[14px] text-[color:var(--color-ink-mute)]">¥</span>
                  <span className="text-[44px] font-semibold tracking-tight" style={{ color: t.accent_color }}>
                    {t.fee.toLocaleString("zh-CN")}
                  </span>
                </div>
                <p
                  className="mt-1 text-[13px] tracking-[0.18em]"
                  style={{ color: t.accent_color }}
                >
                  {t.discount_text}
                </p>
                <div className="mt-4 text-[13px] text-[color:var(--color-ink-soft)]">
                  <Markdown>{t.benefits_md}</Markdown>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============== STORES ============== */}
      {stores && stores.length > 0 && (
        <section className="max-w-[1480px] mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <SectionTitle
              align="left"
              eyebrow="OUR STORES"
              title="四家门店 · 各自温度"
              subtitle="陆家嘴 / 新天地 / 曹路花园城 / 金茂大厦黑金店，每一处都有它该有的样子。"
            />
            <Link to="/stores" className="btn-step">
              <span>了解门店</span>
              <ArrowRight24Regular className="w-4 h-4 arrow" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mt-10">
            {stores.map((s) => (
              <Link to="/stores" key={s.id} className="photo-card aspect-[5/6] block">
                {s.image_url ? (
                  <img className="photo-card-img" src={s.image_url} alt={s.name} />
                ) : (
                  <div
                    className="photo-card-img"
                    style={{ background: "linear-gradient(160deg,#34552E,#92AF89)" }}
                  />
                )}
                <div className="photo-card-overlay" />
                {s.is_flagship && (
                  <span className="absolute top-3 left-3 chip chip-pearl text-[11px]">旗舰</span>
                )}
                <div className="photo-card-content">
                  <h4 className="font-serif-cn text-[22px] tracking-wide">{s.name}</h4>
                  <p className="text-[12px] text-white/70 line-clamp-2 leading-relaxed">
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
