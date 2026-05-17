import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Api } from "../lib/api";
import type { SiteConfig } from "../lib/types";
import SectionTitle from "../components/SectionTitle";
import Markdown from "../components/Markdown";
import {
  LeafOne24Regular as Leaf24Regular,
  HandRight24Regular,
  Beaker24Regular,
  Heart24Regular,
} from "@fluentui/react-icons";

export default function About() {
  const { data: site } = useQuery<SiteConfig>({ queryKey: ["site"], queryFn: Api.site });
  return (
    <div className="max-w-[1100px] mx-auto px-6 lg:px-12 pt-10 lg:pt-14">
      <SectionTitle
        eyebrow="OUR PHILOSOPHY"
        title="关于诗碧曼"
        subtitle="草本精华 · 缕缕用心 · 让你持久年轻 —— 这是我们对每一位发友的承诺。"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-10 brand-card p-8 lg:p-10"
      >
        <h3 className="font-serif-cn text-[26px] tracking-[0.06em] text-[color:var(--color-ink)] flex items-center gap-3">
          <Heart24Regular className="text-[color:var(--color-rose)]" />
          我们的来意
        </h3>
        <div className="mt-3 text-[15.5px] leading-loose">
          <Markdown>
            {site?.intro_md ||
              "我们做的事很简单：用草本配方与古法手法，让你的头皮先放松、再被认真照料。\n没有夸张承诺，只在每一寸发缝、每一次按压里把『用心』写下来。"}
          </Markdown>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-6 brand-card p-8 lg:p-10"
      >
        <h3 className="font-serif-cn text-[26px] tracking-[0.06em] text-[color:var(--color-ink)] flex items-center gap-3">
          <Beaker24Regular className="text-[color:var(--color-sage-500)]" />
          原理 · 大白话说
        </h3>
        <div className="mt-3 text-[15.5px] leading-loose">
          <Markdown>{site?.principle_md || ""}</Markdown>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5 mt-6">
        {[
          { i: <Leaf24Regular />, t: "草本配方", b: "姜、玫瑰、艾草、人参等天然原料按需调配。" },
          { i: <HandRight24Regular />, t: "古法手法", b: "经络辨证施护，结合中医视角观察头皮、耳后淋巴、颈椎。" },
          { i: <Beaker24Regular />, t: "数字检测", b: "护理前 + 复检 + 月度回访，让『变化』可被记录。" },
        ].map((c, i) => (
          <div key={i} className="brand-card p-6">
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-white bg-gradient-to-br from-[color:var(--color-sage-400)] to-[color:var(--color-sage-600)]">
              {c.i}
            </span>
            <h4 className="font-serif-cn mt-3 text-[20px] tracking-wide">{c.t}</h4>
            <p className="text-[14px] text-[color:var(--color-ink-soft)] mt-1.5 leading-relaxed">{c.b}</p>
          </div>
        ))}
      </div>

      <div className="brand-stamp mt-14" />
      <p className="text-center font-kai text-[24px] text-[color:var(--color-ink)] leading-relaxed">
        请尽情享受城市中的小憩时刻 —— 让头发恢复活力。
      </p>
    </div>
  );
}
