import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api, setToken } from "../lib/api";
import { LockClosed24Regular, PersonCircle24Regular, Sparkle24Filled } from "@fluentui/react-icons";

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
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold)] text-white shadow-[0_8px_18px_rgba(184,148,90,0.35)]">
            <Sparkle24Filled />
          </span>
          <div>
            <h1 className="font-kai text-[26px] text-[color:var(--color-ink)] leading-tight">
              诗碧曼 · 后台
            </h1>
            <p className="text-[12px] tracking-[0.32em] text-[color:var(--color-ink-soft)] uppercase">
              ADMIN CONSOLE
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block">
            <span className="text-[13px] text-[color:var(--color-ink-soft)]">账户</span>
            <div className="mt-1.5 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-[color:var(--color-line)] focus-within:border-[color:var(--color-gold)] transition">
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
            <div className="mt-1.5 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-[color:var(--color-line)] focus-within:border-[color:var(--color-gold)] transition">
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
