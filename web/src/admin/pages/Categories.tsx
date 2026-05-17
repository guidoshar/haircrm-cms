import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import PageHeader from "../components/PageHeader";
import { Field, TextInput, NumberInput } from "../components/FieldRow";
import ImagePicker from "../components/ImagePicker";
import { Drawer, DrawerHeader, DrawerHeaderTitle, DrawerBody } from "@fluentui/react-components";
import { Add24Regular, Edit24Regular, Delete24Regular, Save24Regular } from "@fluentui/react-icons";
import { useToast } from "../components/Toast";

const BLANK = {
  name: "",
  slug: "",
  sort_order: 0,
  icon_key: "",
  hero_image_key: "",
  accent_color: "#B8945A",
  tagline: "",
};

export default function AdminCategories() {
  const qc = useQueryClient();
  const toast = useToast();
  const list = useQuery<any[]>({
    queryKey: ["adm-cats"],
    queryFn: () => api("/admin/categories", { auth: true }),
  });

  const [editing, setEditing] = useState<any | null>(null);

  const onSave = useMutation({
    mutationFn: (f: any) => {
      const body = {
        name: f.name,
        slug: f.slug,
        sort_order: Number(f.sort_order) || 0,
        icon_key: f.icon_key || null,
        hero_image_key: f.hero_image_key || null,
        accent_color: f.accent_color || null,
        tagline: f.tagline || null,
      };
      if (f.id) {
        return api(`/admin/categories/${f.id}`, { method: "PATCH", auth: true, body: JSON.stringify(body) });
      }
      return api("/admin/categories", { method: "POST", auth: true, body: JSON.stringify(body) });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adm-cats"] });
      qc.invalidateQueries({ queryKey: ["menu"] });
      setEditing(null);
      toast.push({ type: "ok", text: "已保存" });
    },
    onError: (e: any) => toast.push({ type: "err", text: e.message }),
  });

  const onDelete = useMutation({
    mutationFn: (id: number) => api(`/admin/categories/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adm-cats"] });
      qc.invalidateQueries({ queryKey: ["menu"] });
      toast.push({ type: "ok", text: "已删除" });
    },
  });

  return (
    <>
      <PageHeader
        title="分类管理"
        subtitle="头皮·清 / 调 / 补 / 养 等大类"
        actions={
          <button className="btn-primary-harmony" onClick={() => setEditing({ ...BLANK })}>
            <Add24Regular className="w-4 h-4" />
            新建分类
          </button>
        }
      />
      <div className="px-6 lg:px-10 py-8">
        <div className="brand-card overflow-hidden">
          <table className="w-full text-[14px]">
            <thead className="bg-[color:var(--color-cream-warm)] text-[color:var(--color-ink-soft)]">
              <tr>
                <th className="text-left px-4 py-3 font-medium">名称</th>
                <th className="text-left px-4 py-3 font-medium">slug</th>
                <th className="text-left px-4 py-3 font-medium">说明</th>
                <th className="text-left px-4 py-3 font-medium num">排序</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {(list.data || []).map((c) => (
                <tr key={c.id} className="border-t border-[color:var(--color-line)] hover:bg-[color:var(--color-cream-warm)]/60">
                  <td className="px-4 py-3 font-kai text-[18px]">{c.name}</td>
                  <td className="px-4 py-3 text-[color:var(--color-ink-soft)]">{c.slug}</td>
                  <td className="px-4 py-3 text-[color:var(--color-ink-soft)]">{c.tagline || "—"}</td>
                  <td className="px-4 py-3 num">{c.sort_order}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        className="btn-ghost-harmony !text-sm"
                        onClick={() => setEditing(c)}
                      >
                        <Edit24Regular className="w-4 h-4" />
                      </button>
                      <button
                        className="btn-ghost-harmony !text-sm hover:!text-rose-600"
                        onClick={() => confirm(`删除「${c.name}」？将同时删除其下所有项目。`) && onDelete.mutate(c.id)}
                      >
                        <Delete24Regular className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!list.data || list.data.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[color:var(--color-ink-soft)]">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
              <DrawerHeaderTitle>{editing.id ? "编辑分类" : "新建分类"}</DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody>
              <div className="space-y-4 py-3">
                <Field label="名称">
                  <TextInput value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </Field>
                <Field label="slug" hint="英文小写 / 唯一">
                  <TextInput value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
                </Field>
                <Field label="副标语">
                  <TextInput
                    value={editing.tagline || ""}
                    onChange={(e) => setEditing({ ...editing, tagline: e.target.value })}
                  />
                </Field>
                <Field label="排序">
                  <NumberInput
                    value={editing.sort_order}
                    onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })}
                  />
                </Field>
                <Field label="主色">
                  <input
                    type="color"
                    value={editing.accent_color || "#B8945A"}
                    onChange={(e) => setEditing({ ...editing, accent_color: e.target.value })}
                    className="w-16 h-9 rounded-lg border border-[color:var(--color-line)]"
                  />
                </Field>
                <ImagePicker
                  imageKey={editing.hero_image_key}
                  onChange={(k) => setEditing({ ...editing, hero_image_key: k })}
                  label="分类主图"
                  recommend="1600 × 900 (16:9)"
                  tag="category"
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
