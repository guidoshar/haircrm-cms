import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { clearToken } from "../lib/api";
import {
  Home24Regular,
  PersonStar24Regular,
  Apps24Regular,
  Location24Regular,
  Image24Regular,
  TextBulletList24Regular,
  Settings24Regular,
  ImageMultiple24Regular,
  SignOut24Regular,
  Sparkle24Filled,
  Open24Regular,
} from "@fluentui/react-icons";

const NAVS = [
  { to: "/admin", label: "概览", icon: <Home24Regular />, end: true },
  { to: "/admin/site", label: "站点配置", icon: <Settings24Regular /> },
  { to: "/admin/categories", label: "分类", icon: <TextBulletList24Regular /> },
  { to: "/admin/services", label: "项目", icon: <Apps24Regular /> },
  { to: "/admin/tiers", label: "会员等级", icon: <PersonStar24Regular /> },
  { to: "/admin/stores", label: "门店", icon: <Location24Regular /> },
  { to: "/admin/banners", label: "Banner", icon: <Image24Regular /> },
  { to: "/admin/media", label: "图片库", icon: <ImageMultiple24Regular /> },
];

export default function AdminLayout() {
  const nav = useNavigate();
  const logout = () => {
    clearToken();
    nav("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-[color:var(--color-cream)]">
      <aside className="w-60 shrink-0 border-r border-[color:var(--color-line)] bg-[color:var(--color-cream-warm)] flex flex-col">
        <div className="h-[68px] px-5 flex items-center gap-3 border-b border-[color:var(--color-line)]">
          <img
            src="/products/logo.png"
            alt="Sipimo"
            className="h-7 w-auto select-none"
            draggable={false}
          />
          <div className="pl-3 border-l border-[color:var(--color-line)]">
            <div className="font-serif-cn text-[12px] tracking-[0.32em] text-[color:var(--color-ink)]">
              诗碧曼
            </div>
            <div className="text-[10px] tracking-[0.32em] text-[color:var(--color-ink-mute)] uppercase mt-0.5">
              ADMIN
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1">
          {NAVS.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end as any}
              className={({ isActive }) =>
                [
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] transition",
                  isActive
                    ? "bg-[color:var(--color-sage-100)] text-[color:var(--color-sage-700)] font-medium"
                    : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-sage-50)] hover:text-[color:var(--color-sage-700)]",
                ].join(" ")
              }
            >
              {n.icon}
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-[color:var(--color-line)] space-y-1.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-sage-50)] hover:text-[color:var(--color-sage-700)]"
          >
            <Open24Regular />
            <span>打开站点</span>
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[color:var(--color-ink-soft)] hover:bg-rose-50 hover:text-rose-600"
          >
            <SignOut24Regular />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
