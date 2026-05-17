const API_BASE = (import.meta as any).env.VITE_API_BASE || "/products/api";

type Options = RequestInit & { auth?: boolean };

function getToken(): string | null {
  return localStorage.getItem("siyman_admin_token");
}

export async function api<T = any>(path: string, opts: Options = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as any),
  };
  if (opts.auth) {
    const t = getToken();
    if (t) headers["Authorization"] = `Bearer ${t}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const j = await res.json();
      if (j?.detail) msg = j.detail;
    } catch {}
    if (res.status === 401 && opts.auth) {
      localStorage.removeItem("siyman_admin_token");
      if (location.pathname.startsWith("/admin")) location.href = "/admin/login";
    }
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as any;
  return (await res.json()) as T;
}

export async function uploadFile(file: File, alt = "", tag?: string) {
  const t = getToken();
  const fd = new FormData();
  fd.append("file", file);
  fd.append("alt", alt);
  if (tag) fd.append("tag", tag);
  const res = await fetch(`${API_BASE}/admin/media/upload`, {
    method: "POST",
    headers: t ? { Authorization: `Bearer ${t}` } : undefined,
    body: fd,
  });
  if (!res.ok) {
    let msg = "上传失败";
    try {
      const j = await res.json();
      if (j?.detail) msg = j.detail;
    } catch {}
    throw new Error(msg);
  }
  return await res.json();
}

export const Api = {
  // public
  site: () => api("/site"),
  menu: () => api<any[]>("/menu"),
  tiers: () => api<any[]>("/tiers"),
  stores: () => api<any[]>("/stores"),
  banners: (position = "home") => api<any[]>(`/banners?position=${position}`),
  // auth
  login: (username: string, password: string) =>
    api<{ access_token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  me: () => api("/auth/me", { auth: true }),
  changePassword: (old_password: string, new_password: string) =>
    api("/auth/change-password", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ old_password, new_password }),
    }),
};

export const setToken = (t: string) => localStorage.setItem("siyman_admin_token", t);
export const clearToken = () => localStorage.removeItem("siyman_admin_token");
export const hasToken = () => !!getToken();
