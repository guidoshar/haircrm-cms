import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import PageHeader from "../components/PageHeader";
import { Apps24Regular, Image24Regular, Location24Regular, PersonStar24Regular, TextBulletList24Regular, ImageMultiple24Regular } from "@fluentui/react-icons";
import { Link } from "react-router-dom";

const useCount = <T,>(name: string, path: string, qkey: string[]) =>
  useQuery<T[]>({ queryKey: qkey, queryFn: () => api(path, { auth: true }) });

export default function AdminDashboard() {
  const cats = useCount("分类", "/admin/categories", ["adm-cats"]);
  const svcs = useCount("项目", "/admin/services", ["adm-svcs"]);
  const tiers = useCount("会员等级", "/admin/tiers", ["adm-tiers"]);
  const stores = useCount("门店", "/admin/stores", ["adm-stores"]);
  const banners = useCount("Banner", "/admin/banners", ["adm-banners"]);
  const media = useCount("素材", "/admin/media", ["adm-media"]);

  const cards = [
    { i: <TextBulletList24Regular />, t: "分类", n: cats.data?.length ?? "—", to: "/admin/categories" },
    { i: <Apps24Regular />, t: "项目", n: svcs.data?.length ?? "—", to: "/admin/services" },
    { i: <PersonStar24Regular />, t: "会员等级", n: tiers.data?.length ?? "—", to: "/admin/tiers" },
    { i: <Location24Regular />, t: "门店", n: stores.data?.length ?? "—", to: "/admin/stores" },
    { i: <Image24Regular />, t: "Banner", n: banners.data?.length ?? "—", to: "/admin/banners" },
    { i: <ImageMultiple24Regular />, t: "素材库", n: media.data?.length ?? "—", to: "/admin/media" },
  ];

  return (
    <>
      <PageHeader title="后台概览" subtitle="诗碧曼养发会所 · 站点配置仪表盘" />
      <div className="px-6 lg:px-10 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c) => (
            <Link
              key={c.t}
              to={c.to}
              className="brand-card lift p-6 flex items-center gap-4"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[color:var(--color-gold)]/12 text-[color:var(--color-gold)]">
                {c.i}
              </span>
              <div className="flex-1">
                <div className="text-[13px] text-[color:var(--color-ink-soft)]">{c.t}</div>
                <div className="num text-[36px] font-semibold leading-none mt-0.5 text-[color:var(--color-ink)]">
                  {c.n}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
