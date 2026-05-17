import { useState, useCallback, createContext, useContext, useEffect } from "react";

type Toast = { id: number; type: "ok" | "err"; text: string };
const Ctx = createContext<{ push: (t: Omit<Toast, "id">) => void }>({ push: () => {} });

export function ToastProvider({ children }: { children: any }) {
  const [list, setList] = useState<Toast[]>([]);
  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setList((xs) => [...xs, { ...t, id }]);
    setTimeout(() => setList((xs) => xs.filter((x) => x.id !== id)), 2400);
  }, []);
  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed top-5 right-5 z-[100] space-y-2">
        {list.map((t) => (
          <div
            key={t.id}
            className={
              "px-4 py-2.5 rounded-lg shadow-lg backdrop-blur text-[14px] " +
              (t.type === "ok"
                ? "bg-[color:var(--color-leaf)]/95 text-white"
                : "bg-rose-600/95 text-white")
            }
          >
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  return useContext(Ctx);
}
