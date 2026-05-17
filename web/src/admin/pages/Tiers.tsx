import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import PageHeader from "../components/PageHeader";
import { Field, TextInput, NumberInput, TextArea, Toggle } from "../components/FieldRow";
import { Drawer, DrawerHeader, DrawerHeaderTitle, DrawerBody } from "@fluentui/react-components";
import { Add24Regular, Edit24Regular, Delete24Regular, Save24Regular } from "@fluentui/react-icons";
import { useToast } from "../components/Toast";

const BLANK = {
  name: "",
  slug: "",
  fee: 0,
  discount_text: "会员价",
  benefits_md: "",
  accent_color: "#B8945A",
  icon_key: "Sparkle",
  sort_order: 0,
  is_active: true,
};

const ICON_OPTIONS = ["Sparkle", "Crown", "Diamond"];

export default function AdminTiers() {
  const qc = useQueryClient();
  const toast = useToast();
  const list = useQuery<any[]>({
    queryKey: ["adm-tiers"],
    queryFn: () => api("/admin/tiers", { auth: true }),
  });
  const [editing, setEditing] = useState<any | null>(null);

  const onSave = useMutation({
    mutationFn: (f: any) => {
      const body = {
        name: f.name,
        slug: f.slug,
        fee: Number(f.fee) || 0,
        discount_text: f.discount_text,
        benefits_md: f.benefits_md,
        accent_color: f.accent_color,
        icon_key: f.icon_key || null,
        sort_order: Number(f.sort_order) || 0,
        is_active: !!f.is_active,
      };
      if (f.id) return api(`/admin/tiers/${f.id}`, { method: "PATCH", auth: true, body: JSON.stringify(body) });
      return api("/admin/tiers", { method: "POST", auth: true, body: JSON.stringify(body) });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adm-tiers"] });
      qc.invalidateQueries({ queryKey: ["tiers"] });
      setEditing(null);
      toast.push({ type: "ok", text: "已保存" });
    },
    onError: (e: any) => toast.push({ type: "err", text: e.message }),
  });

  const onDel = useMutation({
    mutationFn: (id: number) => api(`/admin/tiers/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adm-tiers"] });
      qc.invalidateQueries({ queryKey: ["tiers"] });
    },
  });

  return (
    <>
      <PageHeader
        title="会员等级"
        subtitle="贵宾 · 白金 · 钻石"
        actions={
          <button className="btn-primary-harmony" onClick={() => setEditing({ ...BLANK })}>
            <Add24Regular className="w-4 h-4" />
            新建等级
          </button>
        }
      />
      <div className="px-6 lg:px-10 py-8">
        <div className="grid lg:grid-cols-3 gap-5">
          {(list.data || []).map((t) => (
            <div key={t.id} className="brand-card p-6 relative">
              <span
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ background: t.accent_color }}
              />
              <div className="flex items-baseline justify-between">
                <h3 className="font-kai text-[26px]">{t.name}</h3>
                <span className="text-[12px] text-[color:var(--color-ink-soft)]">{t.slug}</span>
              </div>
              <div className="num text-[36px] font-semibold mt-2" style={{ color: t.accent_color }}>
                ¥{t.fee.toLocaleString()}
              </div>
              <div className="text-[13px]" style={{ color: t.accent_color }}>
                {t.discount_text}
              </div>
              <pre className="mt-3 text-[13px] text-[color:var(--color-ink-soft)] whitespace-pre-wrap font-sans leading-relaxed">
                {t.benefits_md}
              </pre>
              <div className="mt-4 flex gap-2">
                <button className="btn-secondary-harmony !text-sm" onClick={() => setEditing(t)}>
                  <Edit24Regular className="w-4 h-4" />
                  编辑
                </button>
                <button
                  className="btn-ghost-harmony !text-sm hover:!text-rose-600"
                  onClick={() => confirm(`删除「${t.name}」？`) && onDel.mutate(t.id)}
                >
                  <Delete24Regular className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
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
              <DrawerHeaderTitle>{editing.id ? "编辑等级" : "新建等级"}</DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody>
              <div className="space-y-4 py-3">
                <Field label="名称">
                  <TextInput value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </Field>
                <Field label="slug">
                  <TextInput value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
                </Field>
                <Field label="办卡金额">
                  <NumberInput value={editing.fee} onChange={(e) => setEditing({ ...editing, fee: e.target.value })} />
                </Field>
                <Field label="折扣描述">
                  <TextInput
                    value={editing.discount_text}
                    onChange={(e) => setEditing({ ...editing, discount_text: e.target.value })}
                  />
                </Field>
                <Field label="主色">
                  <input
                    type="color"
                    value={editing.accent_color}
                    onChange={(e) => setEditing({ ...editing, accent_color: e.target.value })}
                    className="w-16 h-9 rounded-lg border border-[color:var(--color-line)]"
                  />
                </Field>
                <Field label="图标">
                  <select
                    value={editing.icon_key || ""}
                    onChange={(e) => setEditing({ ...editing, icon_key: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[color:var(--color-line)]"
                  >
                    {ICON_OPTIONS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="权益清单" hint="Markdown，每行 - 开头">
                  <TextArea
                    rows={6}
                    value={editing.benefits_md}
                    onChange={(e) => setEditing({ ...editing, benefits_md: e.target.value })}
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
