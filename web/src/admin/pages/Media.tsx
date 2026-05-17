import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, uploadFile } from "../../lib/api";
import PageHeader from "../components/PageHeader";
import { ArrowUpload24Regular, Delete24Regular, Copy24Regular } from "@fluentui/react-icons";
import { useToast } from "../components/Toast";

export default function AdminMedia() {
  const qc = useQueryClient();
  const toast = useToast();
  const list = useQuery<any[]>({ queryKey: ["adm-media"], queryFn: () => api("/admin/media", { auth: true }) });
  const [uploading, setUploading] = useState(false);

  const onUpload = async (files: FileList) => {
    setUploading(true);
    try {
      for (const f of Array.from(files)) {
        await uploadFile(f, "", "library");
      }
      qc.invalidateQueries({ queryKey: ["adm-media"] });
      toast.push({ type: "ok", text: `上传完成 (${files.length})` });
    } catch (e: any) {
      toast.push({ type: "err", text: e.message });
    } finally {
      setUploading(false);
    }
  };

  const onDel = useMutation({
    mutationFn: (id: number) => api(`/admin/media/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adm-media"] }),
  });

  return (
    <>
      <PageHeader
        title="图片库"
        subtitle="所有上传的素材都会自动转 webp 并生成缩略图"
        actions={
          <label className="btn-primary-harmony cursor-pointer">
            <ArrowUpload24Regular className="w-4 h-4" />
            <span>{uploading ? "上传中..." : "上传图片"}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) onUpload(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        }
      />
      <div className="px-6 lg:px-10 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {(list.data || []).map((m) => (
            <div key={m.id} className="brand-card overflow-hidden group">
              <div className="aspect-square bg-[color:var(--color-sepia-soft)]">
                <img src={m.thumb_url || m.url} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="num text-[12px] text-[color:var(--color-ink-soft)]">
                  {m.width}×{m.height} · {(m.bytes / 1024).toFixed(0)}KB
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <button
                    className="btn-ghost-harmony !text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(m.key);
                      toast.push({ type: "ok", text: "key 已复制" });
                    }}
                  >
                    <Copy24Regular className="w-3.5 h-3.5" />
                    key
                  </button>
                  <button
                    className="btn-ghost-harmony !text-xs hover:!text-rose-600 ml-auto"
                    onClick={() => confirm("删除此图片？") && onDel.mutate(m.id)}
                  >
                    <Delete24Regular className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
