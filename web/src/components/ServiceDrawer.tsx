import { Drawer, DrawerHeader, DrawerHeaderTitle, DrawerBody } from "@fluentui/react-components";
import { Dismiss24Regular, Beaker24Regular, HeartPulse24Regular, Box24Regular, Info24Regular, Clock24Regular } from "@fluentui/react-icons";
import type { Service } from "../lib/types";
import StepsTimeline from "./StepsTimeline";
import PackageList from "./PackageList";
import PriceBlock from "./PriceBlock";
import Markdown from "./Markdown";

export default function ServiceDrawer({
  service,
  open,
  onClose,
}: {
  service: Service | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer
      open={open}
      onOpenChange={(_, d) => !d.open && onClose()}
      position="end"
      size="large"
      className="!w-[min(92vw,640px)]"
      style={{ background: "var(--color-cream-warm)" }}
    >
      <DrawerHeader className="!border-b !border-[color:var(--color-line)]">
        <DrawerHeaderTitle
          action={
            <button onClick={onClose} className="btn-ghost-harmony">
              <Dismiss24Regular />
            </button>
          }
        >
          <span className="font-kai text-[26px] text-[color:var(--color-ink)]">
            {service?.name || ""}
          </span>
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody className="!px-0">
        {service && (
          <div className="px-6 py-5 space-y-7">
            {/* Cover */}
            {service.cover_image_url && (
              <div className="rounded-2xl overflow-hidden border border-[color:var(--color-line)]">
                <img src={service.cover_image_url} alt={service.name} className="w-full aspect-[16/9] object-cover" />
              </div>
            )}

            {/* Summary */}
            <div className="flex items-start gap-3">
              <Info24Regular className="text-[color:var(--color-gold)] mt-1 flex-none" />
              <p className="text-[15px] text-[color:var(--color-ink-soft)] leading-relaxed">
                {service.summary || ""}
              </p>
            </div>

            {/* Price */}
            <section>
              <h4 className="font-kai text-[22px] text-[color:var(--color-ink)] mb-3 flex items-center gap-2">
                <Clock24Regular className="text-[color:var(--color-gold)]" />
                价格 · 时长
                {service.time_min ? (
                  <span className="num text-[14px] text-[color:var(--color-ink-soft)] ml-2">
                    {service.time_min} 分钟
                  </span>
                ) : null}
              </h4>
              <PriceBlock price={service.price} />
            </section>

            {/* Steps */}
            {service.steps && service.steps.length > 0 && (
              <section>
                <StepsTimeline steps={service.steps} totalMin={service.time_min} />
              </section>
            )}

            {/* Principle */}
            {service.principle_md && (
              <section>
                <h4 className="font-kai text-[22px] text-[color:var(--color-ink)] mb-2 flex items-center gap-2">
                  <Beaker24Regular className="text-[color:var(--color-leaf)]" />
                  原理 · 大白话说
                </h4>
                <Markdown>{service.principle_md}</Markdown>
              </section>
            )}

            {/* Products */}
            {service.products_md && (
              <section>
                <h4 className="font-kai text-[22px] text-[color:var(--color-ink)] mb-2 flex items-center gap-2">
                  <Box24Regular className="text-[color:var(--color-gold)]" />
                  我们用什么
                </h4>
                <Markdown>{service.products_md}</Markdown>
              </section>
            )}

            {/* Value */}
            {service.value_md && (
              <section>
                <h4 className="font-kai text-[22px] text-[color:var(--color-ink)] mb-2 flex items-center gap-2">
                  <HeartPulse24Regular className="text-[color:var(--color-rose)]" />
                  适合谁来做
                </h4>
                <Markdown>{service.value_md}</Markdown>
              </section>
            )}

            {/* Packages */}
            {service.packages && service.packages.length > 0 && (
              <section>
                <h4 className="font-kai text-[22px] text-[color:var(--color-ink)] mb-3">
                  课程 · 套餐
                </h4>
                <PackageList packages={service.packages} />
              </section>
            )}

            <div className="brand-divider" />
            <p className="text-center text-[12px] text-[color:var(--color-ink-soft)] tracking-widest">
              诗碧曼产品按全国统一零售价执行 · 不参与办卡折扣
            </p>
          </div>
        )}
      </DrawerBody>
    </Drawer>
  );
}
