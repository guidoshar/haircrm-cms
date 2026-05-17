import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../lib/api";
import type { SiteConfig } from "../lib/types";
import { Phone24Regular, Location24Regular } from "@fluentui/react-icons";

const NAVS = [
  { to: "/", label: "首页" },
  { to: "/services", label: "项目" },
  { to: "/membership", label: "会员" },
  { to: "/stores", label: "门店" },
  { to: "/about", label: "理念" },
];

export default function PublicLayout() {
  const { data: site } = useQuery<SiteConfig>({ queryKey: ["site"], queryFn: Api.site });
  const loc = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as any });
  }, [loc.pathname]);

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[color:var(--color-cream)]/82 border-b border-[color:var(--color-line)]">
        <div className="max-w-[1480px] mx-auto px-6 lg:px-12 h-[68px] flex items-center justify-between gap-4">
          {/* logo —— Sipimo 字标 + 中文小副标 */}
          <NavLink to="/" className="flex items-center gap-3.5 group">
            <img
              src="/products/logo.png"
              alt="Sipimo"
              className="h-8 lg:h-9 w-auto select-none transition-opacity group-hover:opacity-80"
              draggable={false}
            />
            <span className="hidden sm:flex flex-col leading-tight pl-3.5 border-l border-[color:var(--color-line)]">
              <span className="font-serif-cn text-[13px] tracking-[0.34em] text-[color:var(--color-ink)]">
                诗碧曼
              </span>
              <span className="text-[10px] tracking-[0.32em] text-[color:var(--color-ink-mute)] mt-0.5">
                草本养护中心
              </span>
            </span>
          </NavLink>

          {/* nav —— 文字 + 下划线 */}
          <nav className="hidden md:flex items-center gap-1">
            {NAVS.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  [
                    "relative px-4 py-2 text-[14px] tracking-[0.2em] transition",
                    isActive
                      ? "text-[color:var(--color-sage-600)]"
                      : "text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-sage-600)]",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{n.label}</span>
                    {isActive && (
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-6 h-px bg-gradient-to-r from-transparent via-[color:var(--color-sage-400)] to-transparent" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {site?.cta_phone ? (
            <a href={`tel:${site.cta_phone}`} className="btn-secondary-harmony text-[13px]">
              <Phone24Regular className="w-4 h-4" />
              <span className="num tracking-wider">{site.cta_phone}</span>
            </a>
          ) : (
            <NavLink to="/stores" className="btn-secondary-harmony text-[13px]">
              <Location24Regular className="w-4 h-4" />
              <span>门店导航</span>
            </NavLink>
          )}
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-20 lg:mt-28 border-t border-[color:var(--color-line)] bg-[color:var(--color-cream-warm)]">
        <div className="max-w-[1480px] mx-auto px-6 lg:px-12 py-12">
          <div className="brand-stamp"></div>
          <p className="text-center font-kai text-[26px] text-[color:var(--color-ink)] leading-relaxed">
            {site?.footer_quote || "请尽情享受城市中的小憩时刻，让头发恢复活力。"}
          </p>
          <p className="mt-5 text-center text-[12px] tracking-[0.3em] text-[color:var(--color-ink-mute)]">
            © 2026 Sipimo · 诗碧曼草本养护中心 · 草本精华 · 缕缕用心
          </p>
        </div>
      </footer>
    </div>
  );
}
