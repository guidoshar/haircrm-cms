import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import PageHeader from "../components/PageHeader";
import { Field, TextInput, TextArea, Toggle } from "../components/FieldRow";
import { Save24Regular } from "@fluentui/react-icons";
import { useToast } from "../components/Toast";

export default function AdminSite() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data } = useQuery({ queryKey: ["adm-site"], queryFn: () => api("/admin/site", { auth: true }) });
  const [form, setForm] = useState<any>(null);
  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mut = useMutation({
    mutationFn: (payload: any) =>
      api("/admin/site", { method: "PATCH", auth: true, body: JSON.stringify(payload) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adm-site"] });
      qc.invalidateQueries({ queryKey: ["site"] });
      toast.push({ type: "ok", text: "已保存" });
    },
    onError: (e: any) => toast.push({ type: "err", text: e.message }),
  });

  if (!form) return <div className="p-6">加载中...</div>;

  return (
    <>
      <PageHeader
        title="站点配置"
        subtitle="品牌名、Slogan、底部金句、首屏理念文案"
        actions={
          <button className="btn-primary-harmony" onClick={() => mut.mutate(form)} disabled={mut.isPending}>
            <Save24Regular className="w-4 h-4" />
            {mut.isPending ? "保存中..." : "保存"}
          </button>
        }
      />
      <div className="px-6 lg:px-10 py-8 max-w-3xl space-y-5">
        <Field label="品牌名">
          <TextInput value={form.brand_name} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} />
        </Field>
        <Field label="主 Slogan" hint="楷体大字 · 建议 8-14 个汉字">
          <TextInput value={form.slogan_main} onChange={(e) => setForm({ ...form, slogan_main: e.target.value })} />
        </Field>
        <Field label="副 Slogan" hint="一行小字">
          <TextInput value={form.slogan_sub} onChange={(e) => setForm({ ...form, slogan_sub: e.target.value })} />
        </Field>
        <Field label="底部金句" hint="每页底部展示">
          <TextInput value={form.footer_quote} onChange={(e) => setForm({ ...form, footer_quote: e.target.value })} />
        </Field>
        <Field label="联系电话" hint="顶部右上角直拨">
          <TextInput value={form.cta_phone} onChange={(e) => setForm({ ...form, cta_phone: e.target.value })} />
        </Field>
        <Field label="品牌简介" hint="支持 Markdown · 显示在 关于诗碧曼养护中心 页">
          <TextArea
            rows={6}
            value={form.intro_md}
            onChange={(e) => setForm({ ...form, intro_md: e.target.value })}
          />
        </Field>
        <Field label="原理科普" hint="支持 Markdown · 显示在 关于诗碧曼养护中心 页">
          <TextArea
            rows={8}
            value={form.principle_md}
            onChange={(e) => setForm({ ...form, principle_md: e.target.value })}
          />
        </Field>
        <Field label="楷体显示">
          <Toggle
            checked={!!form.kaiti_enabled}
            onChange={(v) => setForm({ ...form, kaiti_enabled: v })}
            label={form.kaiti_enabled ? "已启用" : "已关闭"}
          />
        </Field>
      </div>
    </>
  );
}
