import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import PageHeader from "../components/PageHeader";
import { Field, TextInput, NumberInput, TextArea, Toggle } from "../components/FieldRow";
import ImagePicker from "../components/ImagePicker";
import { Drawer, DrawerHeader, DrawerHeaderTitle, DrawerBody } from "@fluentui/react-components";
import { Add24Regular, Edit24Regular, Delete24Regular, Save24Regular, Star24Filled } from "@fluentui/react-icons";
import { useToast } from "../components/Toast";

const BLANK = {
  name: "",
  slug: "",
  is_flagship: false,
  address: "",
  phone: "",
  hours: "10:00 - 22:00",
  intro_md: "",
  image_key: "",
  gallery: [],
  map_url: "",
  sort_order: 0,
  is_active: true,
};

export default function AdminStores() {
  const qc = useQueryClient();
  const toast = useToast();
  const list = useQuery<any[]>({ queryKey: ["adm-stores"], queryFn: () => api("/admin/stores", { auth: true }) });
  const [editing, setEditing] = useState<any | null>(null);

  const onSave = useMutation({
    mutationFn: (f: any) => {
      const body = {
        name: f.name,
        slug: f.slug,
        is_flagship: !!f.is_flagship,
        address: f.address,
        phone: f.phone,
        hours: f.hours,
        intro_md: f.intro_md,
        image_key: f.image_key || null,
        gallery: f.gallery || [],
        map_url: f.map_url || null,
        sort_order: Number(f.sort_order) || 0,
        is_active: !!f.is_active,
      };
      if (f.id) return api(`/admin/stores/${f.id}`, { method: "PATCH", auth: true, body: JSON.stringify(body) });
      return api("/admin/stores", { method: "POST", auth: true, body: JSON.stringify(body) });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adm-stores"] });
      qc.invalidateQueries({ queryKey: ["stores"] });
      setEditing(null);
      toast.push({ type: "ok", text: "已保存" });
    },
    onError: (e: any) => toast.push({ type: "err", text: e.message }),
  });

  const onDel = useMutation({
    mutationFn: (id: number) => api(`/admin/stores/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adm-stores"] });
      qc.invalidateQueries({ queryKey: ["stores"] });
    },
  });

  return (
    <>
      <PageHeader
        title="门店"
        actions={
          <button className="btn-primary-harmony" onClick={() => setEditing({ ...BLANK })}>
            <Add24Regular className="w-4 h-4" />
            新建门店
          </button>
        }
      />
      <div className="px-6 lg:px-10 py-8 grid md:grid-cols-2 gap-5">
        {(list.data || []).map((s) => (
          <div key={s.id} className="brand-card overflow-hidden">
            <div className="aspect-[16/9] bg-[color:var(--color-sepia-soft)]">
              {s.image_url && <img src={s.image_url} className="w-full h-full object-cover" />}
            </div>
            <div className="p-5">
              <div className="flex items-baseline justify-between">
                <h3 className="font-kai text-[24px] flex items-center gap-2">
                  {s.is_flagship && <Star24Filled className="text-[color:var(--color-gold)] w-5 h-5" />}
                  {s.name}
                </h3>
                <span className="text-[12px] text-[color:var(--color-ink-soft)]">{s.slug}</span>
              </div>
              <div className="text-[13px] text-[color:var(--color-ink-soft)] mt-1">{s.address || "—"}</div>
              <div className="num text-[12px] text-[color:var(--color-ink-soft)]">
                {s.phone || "—"} · {s.hours}
              </div>
              <div className="mt-3 flex gap-2">
                <button className="btn-secondary-harmony !text-sm" onClick={() => setEditing(s)}>
                  <Edit24Regular className="w-4 h-4" />
                  编辑
                </button>
                <button
                  className="btn-ghost-harmony !text-sm hover:!text-rose-600"
                  onClick={() => confirm(`删除「${s.name}」？`) && onDel.mutate(s.id)}
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
        className="!w-[min(92vw,640px)]"
        style={{ background: "var(--color-cream-warm)" }}
      >
        {editing && (
          <>
            <DrawerHeader className="!border-b !border-[color:var(--color-line)]">
              <DrawerHeaderTitle>{editing.id ? "编辑门店" : "新建门店"}</DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody>
              <div className="space-y-4 py-3">
                <Field label="名称">
                  <TextInput value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </Field>
                <Field label="slug">
                  <TextInput value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
                </Field>
                <Field label="地址">
                  <TextInput value={editing.address} onChange={(e) => setEditing({ ...editing, address: e.target.value })} />
                </Field>
                <Field label="电话">
                  <TextInput value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
                </Field>
                <Field label="营业时间">
                  <TextInput value={editing.hours} onChange={(e) => setEditing({ ...editing, hours: e.target.value })} />
                </Field>
                <Field label="简介" hint="支持 Markdown">
                  <TextArea
                    rows={4}
                    value={editing.intro_md}
                    onChange={(e) => setEditing({ ...editing, intro_md: e.target.value })}
                  />
                </Field>
                <ImagePicker
                  imageKey={editing.image_key}
                  onChange={(k) => setEditing({ ...editing, image_key: k })}
                  label="门店主图"
                  recommend="1600 × 900 (16:9)"
                  tag="store"
                />
                <Field label="排序">
                  <NumberInput
                    value={editing.sort_order}
                    onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })}
                  />
                </Field>
                <Toggle
                  checked={!!editing.is_flagship}
                  onChange={(v) => setEditing({ ...editing, is_flagship: v })}
                  label="旗舰店"
                />
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
