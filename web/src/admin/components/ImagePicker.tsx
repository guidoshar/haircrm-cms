import { useState } from "react";
import { uploadFile } from "../../lib/api";
import { ImageAdd24Regular, ArrowUpload24Regular, Dismiss24Regular } from "@fluentui/react-icons";

const CDN = (import.meta as any).env.VITE_CDN_BASE || "/products/cdn";

export default function ImagePicker({
  imageKey,
  onChange,
  label = "图片",
  recommend,
  tag,
}: {
  imageKey?: string | null;
  onChange: (key: string | null) => void;
  label?: string;
  recommend?: string;
  tag?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onPick = async (file: File) => {
    setErr(null);
    setBusy(true);
    try {
      const r = await uploadFile(file, "", tag);
      onChange(r.key);
    } catch (e: any) {
      setErr(e.message || "上传失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="text-[13px] text-[color:var(--color-ink)] font-medium mb-1.5">{label}</div>
      {recommend && (
        <div className="text-[12px] text-[color:var(--color-ink-soft)] mb-2">推荐尺寸 · {recommend}</div>
      )}
      <div className="flex items-center gap-3">
        <div className="w-32 h-20 rounded-lg overflow-hidden bg-[color:var(--color-cream-warm)] border border-[color:var(--color-line)] relative shrink-0">
          {imageKey ? (
            <>
              <img src={`${CDN}/${imageKey}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(null)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 text-[color:var(--color-ink)] flex items-center justify-center hover:bg-white"
                title="移除"
              >
                <Dismiss24Regular className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[color:var(--color-ink-soft)]">
              <ImageAdd24Regular />
            </div>
          )}
        </div>
        <label className="btn-secondary-harmony cursor-pointer text-sm">
          <ArrowUpload24Regular className="w-4 h-4" />
          <span>{busy ? "上传中..." : "上传图片"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPick(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {err && <div className="mt-2 text-[12px] text-rose-600">{err}</div>}
    </div>
  );
}
