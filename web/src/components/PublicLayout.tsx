import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../lib/api";
import type { SiteConfig } from "../lib/types";
import {
  Home24Regular,
  PersonStar24Regular,
  Apps24Regular,
  Location24Regular,
  LeafOne24Regular as Leaf24Regular,
  Phone24Regular,
} from "@fluentui/react-icons";

const NAVS = [
  { to: "/", label: "首页", icon: <Home24Regular /> },
  { to: "/services", label: "项目", icon: <Apps24Regular /> },
  { to: "/membership", label: "会员", icon: <PersonStar24Regular /> },
  { to: "/stores", label: "门店", icon: <Location24Regular /> },
  { to: "/about", label: "理念", icon: <Leaf24Regular /> },
];

export default function PublicLayout() {
  const { data: site } = useQuery<SiteConfig>({ queryKey: ["site"], queryFn: Api.site });
  const loc = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as any });
  }, [loc.pathname]);

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[color:var(--color-cream)]/85 border-b border-[color:var(--color-line)]">
        <div className="max-w-[1480px] mx-auto px-6 lg:px-10 py-3.5 flex items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-3 group">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold)] text-white shadow-[0_4px_12px_rgba(184,148,90,.35)]">
              <Leaf24Regular />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-kai text-[1.35rem] text-[color:var(--color-ink)] group-hover:text-[color:var(--color-gold)] transition">
                {site?.brand_name || "诗碧曼·养发会所"}
              </span>
              <span className="text-[11px] tracking-[0.3em] text-[color:var(--color-ink-soft)]">
                SIBIMAN · HAIR CARE SALON
              </span>
            </span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {NAVS.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-2 px-4 py-2 rounded-full text-[15px] transition",
                    isActive
                      ? "bg-[color:var(--color-gold)]/10 text-[color:var(--color-gold)]"
                      : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-gold)]/5 hover:text-[color:var(--color-ink)]",
                  ].join(" ")
                }
              >
                {n.icon}
                <span>{n.label}</span>
              </NavLink>
            ))}
          </nav>

          {site?.cta_phone ? (
            <a
              href={`tel:${site.cta_phone}`}
              className="btn-secondary-harmony text-sm"
            >
              <Phone24Regular className="w-4 h-4" />
              <span>{site.cta_phone}</span>
            </a>
          ) : (
            <NavLink to="/stores" className="btn-secondary-harmony text-sm">
              <Location24Regular className="w-4 h-4" />
              <span>门店导航</span>
            </NavLink>
          )}
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-[color:var(--color-line)] bg-[color:var(--color-cream-warm)]">
        <div className="max-w-[1480px] mx-auto px-6 lg:px-10 py-10">
          <div className="brand-stamp"></div>
          <p className="text-center font-kai text-2xl text-[color:var(--color-ink)] leading-relaxed">
            {site?.footer_quote || "请尽情享受城市中的小憩时刻，让头发恢复活力。"}
          </p>
          <p className="mt-4 text-center text-sm text-[color:var(--color-ink-soft)] tracking-wider">
            © 2026 诗碧曼养发会所 · 草本精华 · 缕缕用心
          </p>
        </div>
      </footer>
    </div>
  );
}
