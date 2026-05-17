import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import PageHeader from "../components/PageHeader";
import { Field, TextInput, NumberInput, TextArea, Toggle, Select } from "../components/FieldRow";
import ImagePicker from "../components/ImagePicker";
import { Drawer, DrawerHeader, DrawerHeaderTitle, DrawerBody } from "@fluentui/react-components";
import {
  Add24Regular,
  Edit24Regular,
  Delete24Regular,
  Save24Regular,
  ArrowExportLtr24Regular,
} from "@fluentui/react-icons";
import { useToast } from "../components/Toast";

const PKG_KINDS = [
  { v: "course5", t: "课程" },
  { v: "ten1", t: "次卡" },
  { v: "quarter", t: "季卡" },
  { v: "half", t: "半年卡" },
  { v: "addon", t: "搭配建议" },
];

const BLANK = {
  name: "",
  slug: "",
  category_id: 0,
  summary: "",
  principle_md: "",
  value_md: "",
  products_md: "",
  time_min: 0,
  cover_image_key: "",
  gallery: [],
  sort_order: 0,
  is_active: true,
};

export default function AdminServices() {
  const qc = useQueryClient();
  const toast = useToast();
  const [filterCat, setFilterCat] = useState<string>("");
  const cats = useQuery<any[]>({ queryKey: ["adm-cats"], queryFn: () => api("/admin/categories", { auth: true }) });
  const list = useQuery<any[]>({
    queryKey: ["adm-svcs", filterCat],
    queryFn: () =>
      api(`/admin/services${filterCat ? `?category_id=${filterCat}` : ""}`, { auth: true }),
  });
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const detail = useQuery<any>({
    queryKey: ["adm-svc", editingId],
    queryFn: () => api(`/admin/services/${editingId}`, { auth: true }),
    enabled: typeof editingId === "number",
  });
  const [form, setForm] = useState<any>(null);
  const [price, setPrice] = useState<any>({ store_price: 0, member_price: 0, platinum_price: 0, diamond_price: 0, taste_price: 0 });
  const [steps, setSteps] = useState<any[]>([]);
  const [pkgs, setPkgs] = useState<any[]>([]);

  useEffect(() => {
    if (editingId === "new") {
      setForm({ ...BLANK, category_id: cats.data?.[0]?.id || 0 });
      setPrice({ store_price: 0, member_price: 0, platinum_price: 0, diamond_price: 0, taste_price: 0 });
      setSteps([]);
      setPkgs([]);
    } else if (detail.data) {
      const d = detail.data;
      setForm({
        ...d,
        cover_image_key: d.cover_image_key || "",
      });
      setPrice(d.price || { store_price: 0, member_price: 0, platinum_price: 0, diamond_price: 0, taste_price: 0 });
      setSteps((d.steps || []).map((s: any) => ({ ...s })));
      setPkgs((d.packages || []).map((p: any) => ({ ...p })));
    }
  }, [editingId, detail.data, cats.data]);

  const closeDrawer = () => {
    setEditingId(null);
    setForm(null);
  };

  const saveMain = useMutation({
    mutationFn: async (f: any) => {
      const body = {
        category_id: Number(f.category_id),
        name: f.name,
        slug: f.slug,
        summary: f.summary,
        principle_md: f.principle_md,
        value_md: f.value_md,
        products_md: f.products_md,
        time_min: Number(f.time_min) || 0,
        cover_image_key: f.cover_image_key || null,
        gallery: f.gallery || [],
        sort_order: Number(f.sort_order) || 0,
        is_active: !!f.is_active,
      };
      let saved;
      if (f.id) {
        saved = await api(`/admin/services/${f.id}`, { method: "PATCH", auth: true, body: JSON.stringify(body) });
      } else {
        saved = await api(`/admin/services`, { method: "POST", auth: true, body: JSON.stringify(body) });
      }
      const id = saved.id;
      // 价格
      await api(`/admin/services/${id}/price`, {
        method: "PUT",
        auth: true,
        body: JSON.stringify({
          store_price: Number(price.store_price) || 0,
          member_price: Number(price.member_price) || 0,
          platinum_price: Number(price.platinum_price) || 0,
          diamond_price: Number(price.diamond_price) || 0,
          taste_price: Number(price.taste_price) || 0,
        }),
      });
      // steps
      await api(`/admin/services/${id}/steps`, {
        method: "PUT",
        auth: true,
        body: JSON.stringify(
          steps.map((s, idx) => ({
            idx,
            title: s.title || `步骤${idx + 1}`,
            minutes: Number(s.minutes) || 0,
            description: s.description || "",
          }))
        ),
      });
      // packages
      await api(`/admin/services/${id}/packages`, {
        method: "PUT",
        auth: true,
        body: JSON.stringify(
          pkgs.map((p, idx) => ({
            kind: p.kind || "course5",
            label: p.label || "",
            price: Number(p.price) || 0,
            times: Number(p.times) || 0,
            gift_count: Number(p.gift_count) || 0,
            options_text: p.options_text || null,
            sort_order: idx,
          }))
        ),
      });
      return saved;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adm-svcs"] });
      qc.invalidateQueries({ queryKey: ["adm-svc"] });
      qc.invalidateQueries({ queryKey: ["menu"] });
      toast.push({ type: "ok", text: "已保存" });
      closeDrawer();
    },
    onError: (e: any) => toast.push({ type: "err", text: e.message }),
  });

  const onDel = useMutation({
    mutationFn: (id: number) => api(`/admin/services/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adm-svcs"] });
      qc.invalidateQueries({ queryKey: ["menu"] });
    },
  });

  const catName = (id: number) => cats.data?.find((c) => c.id === id)?.name || "—";

  return (
    <>
      <PageHeader
        title="项目"
        subtitle="完整项目卡片：基础信息 / 价格 / 步骤 / 课程套餐"
        actions={
          <button className="btn-primary-harmony" onClick={() => setEditingId("new")}>
            <Add24Regular className="w-4 h-4" />
            新建项目
          </button>
        }
      />
      <div className="px-6 lg:px-10 py-6 flex items-center gap-3 flex-wrap">
        <span className="text-[13px] text-[color:var(--color-ink-soft)]">分类筛选：</span>
        <button
          className={
            "px-3 py-1.5 rounded-full text-[13px] " +
            (!filterCat
              ? "bg-[color:var(--color-gold)] text-white"
              : "bg-white border border-[color:var(--color-line)] text-[color:var(--color-ink-soft)]")
          }
          onClick={() => setFilterCat("")}
        >
          全部
        </button>
        {(cats.data || []).map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCat(String(c.id))}
            className={
              "px-3 py-1.5 rounded-full text-[13px] " +
              (filterCat === String(c.id)
                ? "bg-[color:var(--color-gold)] text-white"
                : "bg-white border border-[color:var(--color-line)] text-[color:var(--color-ink-soft)]")
            }
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="px-6 lg:px-10 pb-10">
        <div className="brand-card overflow-hidden">
          <table className="w-full text-[14px]">
            <thead className="bg-[color:var(--color-cream-warm)] text-[color:var(--color-ink-soft)]">
              <tr>
                <th className="text-left px-4 py-3">名称</th>
                <th className="text-left px-4 py-3">分类</th>
                <th className="text-left px-4 py-3 num">门店价</th>
                <th className="text-left px-4 py-3 num">会员价</th>
                <th className="text-left px-4 py-3 num">时长</th>
                <th className="text-left px-4 py-3 num">排序</th>
                <th className="text-left px-4 py-3">状态</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {(list.data || []).map((s) => (
                <tr key={s.id} className="border-t border-[color:var(--color-line)] hover:bg-[color:var(--color-cream-warm)]/60">
                  <td className="px-4 py-3 font-kai text-[16px]">{s.name}</td>
                  <td className="px-4 py-3 text-[color:var(--color-ink-soft)]">{catName(s.category_id)}</td>
                  <td className="px-4 py-3 num">{s.price?.store_price || "—"}</td>
                  <td className="px-4 py-3 num text-[color:var(--color-gold)]">{s.price?.member_price || "—"}</td>
                  <td className="px-4 py-3 num">{s.time_min || "—"}</td>
                  <td className="px-4 py-3 num">{s.sort_order}</td>
                  <td className="px-4 py-3">
                    <span className={"chip " + (s.is_active ? "chip" : "chip-ink")}>
                      {s.is_active ? "启用" : "隐藏"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button className="btn-ghost-harmony !text-sm" onClick={() => setEditingId(s.id)}>
                        <Edit24Regular className="w-4 h-4" />
                      </button>
                      <button
                        className="btn-ghost-harmony !text-sm hover:!text-rose-600"
                        onClick={() => confirm(`删除「${s.name}」？`) && onDel.mutate(s.id)}
                      >
                        <Delete24Regular className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!list.data || list.data.length === 0) && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[color:var(--color-ink-soft)]">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Drawer
        open={!!editingId}
        onOpenChange={(_, d) => !d.open && closeDrawer()}
        position="end"
        size="full"
        className="!w-[min(96vw,860px)]"
        style={{ background: "var(--color-cream-warm)" }}
      >
        <DrawerHeader className="!border-b !border-[color:var(--color-line)]">
          <DrawerHeaderTitle>{editingId === "new" ? "新建项目" : "编辑项目"}</DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          {form ? (
            <div className="space-y-7 py-3">
              <section className="space-y-4">
                <h3 className="font-kai text-[20px]">基础信息</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="名称">
                    <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </Field>
                  <Field label="slug">
                    <TextInput value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                  </Field>
                  <Field label="分类">
                    <Select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                      {(cats.data || []).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="时长 (分钟)">
                    <NumberInput value={form.time_min} onChange={(e) => setForm({ ...form, time_min: e.target.value })} />
                  </Field>
                </div>
                <Field label="一句话卖点">
                  <TextInput value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
                </Field>
                <ImagePicker
                  imageKey={form.cover_image_key}
                  onChange={(k) => setForm({ ...form, cover_image_key: k })}
                  label="封面图"
                  recommend="1200 × 800 (3:2)"
                  tag="service"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="排序">
                    <NumberInput
                      value={form.sort_order}
                      onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                    />
                  </Field>
                  <Field label="状态">
                    <Toggle
                      checked={!!form.is_active}
                      onChange={(v) => setForm({ ...form, is_active: v })}
                      label={form.is_active ? "启用中" : "已隐藏"}
                    />
                  </Field>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="font-kai text-[20px]">价格 (元)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {(["store_price", "member_price", "platinum_price", "diamond_price", "taste_price"] as const).map((k) => (
                    <Field key={k} label={{
                      store_price: "门店价",
                      member_price: "贵宾卡",
                      platinum_price: "白金卡",
                      diamond_price: "钻石卡",
                      taste_price: "体验价",
                    }[k]}>
                      <NumberInput value={price[k]} onChange={(e) => setPrice({ ...price, [k]: e.target.value })} />
                    </Field>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="font-kai text-[20px]">大白话内容</h3>
                <Field label="原理 · 大白话说" hint="Markdown">
                  <TextArea
                    rows={5}
                    value={form.principle_md}
                    onChange={(e) => setForm({ ...form, principle_md: e.target.value })}
                  />
                </Field>
                <Field label="我们用什么" hint="Markdown · 列举产品/成分">
                  <TextArea
                    rows={4}
                    value={form.products_md}
                    onChange={(e) => setForm({ ...form, products_md: e.target.value })}
                  />
                </Field>
                <Field label="适合谁来做" hint="Markdown">
                  <TextArea
                    rows={4}
                    value={form.value_md}
                    onChange={(e) => setForm({ ...form, value_md: e.target.value })}
                  />
                </Field>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-kai text-[20px]">服务步骤</h3>
                  <button
                    className="btn-secondary-harmony !text-sm"
                    onClick={() => setSteps([...steps, { title: "", minutes: 0, description: "" }])}
                  >
                    <Add24Regular className="w-4 h-4" />
                    增加一步
                  </button>
                </div>
                {steps.map((s, i) => (
                  <div key={i} className="brand-card p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="num w-7 h-7 rounded-full bg-[color:var(--color-gold)] text-white flex items-center justify-center text-[13px] font-medium">
                        {i + 1}
                      </span>
                      <TextInput
                        placeholder="步骤标题"
                        value={s.title}
                        onChange={(e) => {
                          const n = [...steps]; n[i].title = e.target.value; setSteps(n);
                        }}
                      />
                      <NumberInput
                        className="w-24"
                        placeholder="分"
                        value={s.minutes}
                        onChange={(e) => {
                          const n = [...steps]; n[i].minutes = e.target.value; setSteps(n);
                        }}
                      />
                      <button
                        className="btn-ghost-harmony !text-sm hover:!text-rose-600"
                        onClick={() => setSteps(steps.filter((_, ii) => ii !== i))}
                      >
                        <Delete24Regular className="w-4 h-4" />
                      </button>
                    </div>
                    <TextArea
                      rows={2}
                      placeholder="步骤详细描述"
                      value={s.description}
                      onChange={(e) => {
                        const n = [...steps]; n[i].description = e.target.value; setSteps(n);
                      }}
                    />
                  </div>
                ))}
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-kai text-[20px]">课程 / 套餐</h3>
                  <button
                    className="btn-secondary-harmony !text-sm"
                    onClick={() => setPkgs([...pkgs, { kind: "course5", label: "", price: 0, times: 0, gift_count: 0 }])}
                  >
                    <Add24Regular className="w-4 h-4" />
                    增加一档
                  </button>
                </div>
                {pkgs.map((p, i) => (
                  <div key={i} className="brand-card p-4 grid sm:grid-cols-12 gap-2 items-end">
                    <Select
                      className="sm:col-span-2"
                      value={p.kind}
                      onChange={(e) => {
                        const n = [...pkgs]; n[i].kind = e.target.value; setPkgs(n);
                      }}
                    >
                      {PKG_KINDS.map((k) => (
                        <option key={k.v} value={k.v}>
                          {k.t}
                        </option>
                      ))}
                    </Select>
                    <TextInput
                      className="sm:col-span-3"
                      placeholder="标签"
                      value={p.label}
                      onChange={(e) => {
                        const n = [...pkgs]; n[i].label = e.target.value; setPkgs(n);
                      }}
                    />
                    <NumberInput
                      className="sm:col-span-2"
                      placeholder="价格"
                      value={p.price}
                      onChange={(e) => {
                        const n = [...pkgs]; n[i].price = e.target.value; setPkgs(n);
                      }}
                    />
                    <NumberInput
                      className="sm:col-span-1"
                      placeholder="次数"
                      value={p.times}
                      onChange={(e) => {
                        const n = [...pkgs]; n[i].times = e.target.value; setPkgs(n);
                      }}
                    />
                    <NumberInput
                      className="sm:col-span-1"
                      placeholder="赠送"
                      value={p.gift_count}
                      onChange={(e) => {
                        const n = [...pkgs]; n[i].gift_count = e.target.value; setPkgs(n);
                      }}
                    />
                    <TextInput
                      className="sm:col-span-2"
                      placeholder="备注"
                      value={p.options_text || ""}
                      onChange={(e) => {
                        const n = [...pkgs]; n[i].options_text = e.target.value; setPkgs(n);
                      }}
                    />
                    <button
                      className="btn-ghost-harmony !text-sm hover:!text-rose-600 sm:col-span-1"
                      onClick={() => setPkgs(pkgs.filter((_, ii) => ii !== i))}
                    >
                      <Delete24Regular className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </section>

              <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-[color:var(--color-cream-warm)]/95 backdrop-blur border-t border-[color:var(--color-line)] flex justify-end gap-2">
                <button className="btn-secondary-harmony" onClick={closeDrawer}>
                  取消
                </button>
                <button
                  className="btn-primary-harmony"
                  onClick={() => saveMain.mutate({ ...form })}
                  disabled={saveMain.isPending}
                >
                  <Save24Regular className="w-4 h-4" />
                  {saveMain.isPending ? "保存中..." : "保存全部"}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-[color:var(--color-ink-soft)]">加载中...</div>
          )}
        </DrawerBody>
      </Drawer>
    </>
  );
}
