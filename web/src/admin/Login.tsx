import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api, setToken } from "../lib/api";
import { LockClosed24Regular, PersonCircle24Regular } from "@fluentui/react-icons";

export default function AdminLogin() {
  const nav = useNavigate();
  const [u, setU] = useState("admin");
  const [p, setP] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: any) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const r = await Api.login(u, p);
      setToken(r.access_token);
      nav("/admin", { replace: true });
    } catch (e: any) {
      setErr(e.message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md brand-card p-8 lg:p-10">
        <div className="flex flex-col items-center text-center">
          <img
            src="/products/logo.png"
            alt="Sipimo"
            className="h-10 w-auto select-none"
            draggable={false}
          />
          <div className="mt-3 pt-3 border-t border-[color:var(--color-line)] w-32 text-center">
            <div className="font-serif-cn text-[14px] tracking-[0.32em] text-[color:var(--color-ink)]">
              诗碧曼 · 后台
            </div>
            <div className="text-[10px] tracking-[0.32em] text-[color:var(--color-ink-mute)] uppercase mt-1">
              ADMIN CONSOLE
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block">
            <span className="text-[13px] text-[color:var(--color-ink-soft)]">账户</span>
            <div className="mt-1.5 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-[color:var(--color-line)] focus-within:border-[color:var(--color-sage-400)] transition">
              <PersonCircle24Regular className="text-[color:var(--color-ink-soft)]" />
              <input
                value={u}
                onChange={(e) => setU(e.target.value)}
                className="flex-1 bg-transparent outline-none"
                autoFocus
              />
            </div>
          </label>
          <label className="block">
            <span className="text-[13px] text-[color:var(--color-ink-soft)]">密码</span>
            <div className="mt-1.5 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-[color:var(--color-line)] focus-within:border-[color:var(--color-sage-400)] transition">
              <LockClosed24Regular className="text-[color:var(--color-ink-soft)]" />
              <input
                type="password"
                value={p}
                onChange={(e) => setP(e.target.value)}
                className="flex-1 bg-transparent outline-none"
              />
            </div>
          </label>

          {err && (
            <div className="text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              {err}
            </div>
          )}

          <button type="submit" className="btn-primary-harmony w-full justify-center" disabled={loading}>
            {loading ? "登录中..." : "登录"}
          </button>
        </form>

        <p className="mt-6 text-[12px] text-center text-[color:var(--color-ink-soft)]">
          仅限授权管理员使用
        </p>
      </div>
    </div>
  );
}
