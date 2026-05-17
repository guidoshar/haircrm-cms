import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Markdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`prose-mini text-[color:var(--color-ink-soft)] leading-relaxed ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children || ""}</ReactMarkdown>
    </div>
  );
}
