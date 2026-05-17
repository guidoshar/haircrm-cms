import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import PageHeader from "../components/PageHeader";
import { Field, TextInput, NumberInput, Toggle, Select } from "../components/FieldRow";
import ImagePicker from "../components/ImagePicker";
import { Drawer, DrawerHeader, DrawerHeaderTitle, DrawerBody } from "@fluentui/react-components";
import { Add24Regular, Edit24Regular, Delete24Regular, Save24Regular } from "@fluentui/react-icons";
import { useToast } from "../components/Toast";

const BLANK = {
  position: "home",
  image_key: "",
  headline: "",
  subline: "",
  cta_text: "",
  cta_link: "",
  sort_order: 0,
  is_active: true,
};

export default function AdminBanners() {
  const qc = useQueryClient();
  const toast = useToast();
  const list = useQuery<any[]>({ queryKey: ["adm-banners"], queryFn: () => api("/admin/banners", { auth: true }) });
  const [editing, setEditing] = useState<any | null>(null);

  const onSave = useMutation({
    mutationFn: (f: any) => {
      const body = {
        position: f.position,
        image_key: f.image_key || null,
        headline: f.headline,
        subline: f.subline,
        cta_text: f.cta_text || null,
        cta_link: f.cta_link || null,
        sort_order: Number(f.sort_order) || 0,
        is_active: !!f.is_active,
      };
      if (f.id) return api(`/admin/banners/${f.id}`, { method: "PATCH", auth: true, body: JSON.stringify(body) });
      return api("/admin/banners", { method: "POST", auth: true, body: JSON.stringify(body) });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adm-banners"] });
      qc.invalidateQueries({ queryKey: ["banners", "home"] });
      setEditing(null);
      toast.push({ type: "ok", text: "已保存" });
    },
    onError: (e: any) => toast.push({ type: "err", text: e.message }),
  });

  const onDel = useMutation({
    mutationFn: (id: number) => api(`/admin/banners/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adm-banners"] }),
  });

  return (
    <>
      <PageHeader
        title="Banner"
        subtitle="首页 / 会员页 / 项目页 顶图"
        actions={
          <button className="btn-primary-harmony" onClick={() => setEditing({ ...BLANK })}>
            <Add24Regular className="w-4 h-4" />
            新建 Banner
          </button>
        }
      />
      <div className="px-6 lg:px-10 py-8 grid md:grid-cols-2 gap-5">
        {(list.data || []).map((b) => (
          <div key={b.id} className="brand-card overflow-hidden">
            <div className="aspect-[21/9] bg-[color:var(--color-sepia-soft)] relative">
              {b.image_url && <img src={b.image_url} className="w-full h-full object-cover" />}
              <span className="absolute top-3 left-3 chip chip-gold bg-white/95">{b.position}</span>
              {!b.is_active && (
                <span className="absolute top-3 right-3 chip chip-ink bg-white/95">已隐藏</span>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-kai text-[22px]">{b.headline || "无标题"}</h3>
              <p className="text-[13px] text-[color:var(--color-ink-soft)]">{b.subline}</p>
              <div className="num text-[12px] text-[color:var(--color-ink-soft)] mt-1">排序 {b.sort_order}</div>
              <div className="mt-3 flex gap-2">
                <button className="btn-secondary-harmony !text-sm" onClick={() => setEditing(b)}>
                  <Edit24Regular className="w-4 h-4" />
                  编辑
                </button>
                <button
                  className="btn-ghost-harmony !text-sm hover:!text-rose-600"
                  onClick={() => confirm("删除此 Banner？") && onDel.mutate(b.id)}
                >
                  <Delete24Regular className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Drawer
        open={!!editing}
        onOpenChange={(_, d) => !d.open && setEditing(null)}
        position="end"
        size="medium"
        className="!w-[min(92vw,560px)]"
        style={{ background: "var(--color-cream-warm)" }}
      >
        {editing && (
          <>
            <DrawerHeader className="!border-b !border-[color:var(--color-line)]">
              <DrawerHeaderTitle>{editing.id ? "编辑 Banner" : "新建 Banner"}</DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody>
              <div className="space-y-4 py-3">
                <Field label="位置">
                  <Select value={editing.position} onChange={(e) => setEditing({ ...editing, position: e.target.value })}>
                    <option value="home">首页 home</option>
                    <option value="membership">会员页</option>
                    <option value="services">项目页</option>
                  </Select>
                </Field>
                <ImagePicker
                  imageKey={editing.image_key}
                  onChange={(k) => setEditing({ ...editing, image_key: k })}
                  label="Banner 图"
                  recommend="2400 × 900 (PC) · 2048 × 1280 (iPad)"
                  tag="banner"
                />
                <Field label="主标题">
                  <TextInput value={editing.headline} onChange={(e) => setEditing({ ...editing, headline: e.target.value })} />
                </Field>
                <Field label="副标题">
                  <TextInput value={editing.subline} onChange={(e) => setEditing({ ...editing, subline: e.target.value })} />
                </Field>
                <Field label="按钮文字">
                  <TextInput
                    value={editing.cta_text || ""}
                    onChange={(e) => setEditing({ ...editing, cta_text: e.target.value })}
                  />
                </Field>
                <Field label="按钮链接">
                  <TextInput
                    value={editing.cta_link || ""}
                    onChange={(e) => setEditing({ ...editing, cta_link: e.target.value })}
                  />
                </Field>
                <Field label="排序">
                  <NumberInput
                    value={editing.sort_order}
                    onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })}
                  />
                </Field>
                <Toggle
                  checked={!!editing.is_active}
                  onChange={(v) => setEditing({ ...editing, is_active: v })}
                  label={editing.is_active ? "启用中" : "已隐藏"}
                />
                <button
                  className="btn-primary-harmony"
                  onClick={() => onSave.mutate(editing)}
                  disabled={onSave.isPending}
                >
                  <Save24Regular className="w-4 h-4" />
                  保存
                </button>
              </div>
            </DrawerBody>
          </>
        )}
      </Drawer>
    </>
  );
}
