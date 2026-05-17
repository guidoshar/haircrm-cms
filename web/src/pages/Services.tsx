import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Api } from "../lib/api";
import type { Category, Service } from "../lib/types";
import SectionTitle from "../components/SectionTitle";
import ServiceCard from "../components/ServiceCard";
import ServiceDrawer from "../components/ServiceDrawer";
import { Sparkle24Regular } from "@fluentui/react-icons";

export default function Services() {
  const { data: menu } = useQuery<Category[]>({ queryKey: ["menu"], queryFn: Api.menu });
  const [params, setParams] = useSearchParams();
  const initialCat = params.get("cat") || "";
  const [activeSlug, setActiveSlug] = useState<string>(initialCat);
  const [drawerService, setDrawerService] = useState<Service | null>(null);

  const active = useMemo(() => {
    if (!menu || menu.length === 0) return null;
    return menu.find((c) => c.slug === activeSlug) || menu[0];
  }, [menu, activeSlug]);

  useEffect(() => {
    if (!activeSlug && menu && menu.length > 0) setActiveSlug(menu[0].slug);
  }, [menu]);

  const onTab = (slug: string) => {
    setActiveSlug(slug);
    setParams({ cat: slug });
  };

  return (
    <div className="max-w-[1480px] mx-auto px-6 lg:px-12 pt-10 lg:pt-14">
      <SectionTitle
        eyebrow="OUR SERVICES"
        title="项目体系"
        subtitle="头皮·清 / 调 / 补 / 养 + 发芯赋活 + 臻享疗愈，按状态分阶段照顾。"
      />

      {/* Tabs */}
      {menu && menu.length > 0 && (
        <div className="mt-10 flex justify-center">
          <div className="inline-flex flex-wrap items-center gap-2 p-1.5 rounded-full bg-white border border-[color:var(--color-line)] shadow-[var(--shadow-soft)]">
            {menu.map((c) => {
              const on = active?.slug === c.slug;
              return (
                <button
                  key={c.slug}
                  onClick={() => onTab(c.slug)}
                  className={[
                    "relative px-5 py-2 rounded-full font-serif-cn text-[16px] tracking-[0.18em] transition",
                    on
                      ? "text-white"
                      : "text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-sage-600)]",
                  ].join(" ")}
                >
                  {on && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-[color:var(--color-sage-400)] to-[color:var(--color-sage-600)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {active && (
        <div className="mt-3 text-center text-[14px] text-[color:var(--color-ink-soft)]">
          {active.tagline}
        </div>
      )}

      {/* Grid */}
      <div className="mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={active?.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6"
          >
            {(active?.services || []).map((s) => (
              <ServiceCard key={s.id} service={s} onClick={() => setDrawerService(s)} />
            ))}
            {active && active.services.length === 0 && (
              <div className="col-span-full text-center py-16 text-[color:var(--color-ink-soft)]">
                <Sparkle24Regular className="w-10 h-10 mx-auto opacity-50" />
                <p className="mt-3">本分类暂未上线项目</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="brand-stamp mt-16" />
      <p className="text-center font-kai text-[22px] text-[color:var(--color-ink)]">
        草本精华 · 缕缕用心 —— 养发，是给自己的一封慢信。
      </p>

      <ServiceDrawer
        service={drawerService}
        open={!!drawerService}
        onClose={() => setDrawerService(null)}
      />
    </div>
  );
}
