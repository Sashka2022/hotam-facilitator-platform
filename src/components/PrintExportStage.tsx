"use client";

import { useEffect, useRef } from "react";
import { Material, Plenary } from "@/types";
import { categoryMeta } from "@/lib/categories";
import MaterialIcon from "@/components/MaterialIcon";

const PAGE_MARGIN_MM = 12;
const MM_TO_PX = 96 / 25.4;
const USABLE_HEIGHT_PX = (297 - PAGE_MARGIN_MM * 2) * MM_TO_PX;
const USABLE_WIDTH_PX = (210 - PAGE_MARGIN_MM * 2) * MM_TO_PX;

export default function PrintExportStage({
  plenary,
  materials,
}: {
  plenary: Plenary;
  materials: Material[];
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function fitToPage() {
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;
      inner.style.transform = "none";
      const naturalHeight = inner.scrollHeight;
      const scale = Math.min(1, USABLE_HEIGHT_PX / naturalHeight);
      inner.style.transform = `scale(${scale})`;
      inner.style.transformOrigin = "top center";
      // Scaling down leaves the outer box at its pre-scale height (transform
      // doesn't affect layout), which would still trigger a page break under
      // print pagination. Pin the outer box to the scaled height so the
      // printed page only ever reserves the space actually painted.
      outer.style.height = `${naturalHeight * scale}px`;
    }
    function resetScale() {
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;
      inner.style.transform = "none";
      outer.style.height = "auto";
    }
    window.addEventListener("beforeprint", fitToPage);
    window.addEventListener("afterprint", resetScale);
    return () => {
      window.removeEventListener("beforeprint", fitToPage);
      window.removeEventListener("afterprint", resetScale);
    };
  }, [materials.length]);

  return (
    <div
      ref={outerRef}
      style={{ width: "100%", maxWidth: USABLE_WIDTH_PX, margin: "0 auto", overflow: "hidden" }}
    >
      <div ref={innerRef} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <img src="/hotam-logo-hebrew.png" alt="חותם" style={{ height: 28, width: "auto" }} />
          <img src="/rashit-logo.png" alt="ראשית - קהילות מחנכות" style={{ height: 12, width: "auto" }} />
        </div>

        <div
          className="print-color"
          style={{
            background: "var(--gradient)",
            borderRadius: 24,
            padding: "26px 30px",
            color: "var(--white)",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.03em", opacity: 0.9, marginBottom: 8 }}>
            מליאה
          </div>
          <div style={{ fontWeight: 800, fontSize: 22, lineHeight: 1.3, marginBottom: 10 }}>{plenary.title}</div>
          <div style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.97, maxWidth: 480, margin: "0 auto" }}>
            {plenary.description}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {materials.map((item) => {
            const meta = categoryMeta(item.category);
            return (
              <div
                key={item.id}
                className="material-card"
                style={{
                  display: "flex",
                  gap: 12,
                  background: "var(--white)",
                  border: "1px solid var(--line)",
                  borderRadius: 16,
                  padding: "14px 16px",
                }}
              >
                <div
                  className="print-color"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: meta.accent + "26",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <MaterialIcon category={item.category} color="#0048FF" size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="print-color"
                    style={{
                      display: "inline-block",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--brand-blue)",
                      background: meta.accent + "1f",
                      padding: "1px 8px",
                      borderRadius: 999,
                      marginBottom: 5,
                    }}
                  >
                    {meta.label}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "var(--ink)", marginBottom: 3, lineHeight: 1.3 }}>
                    {item.title}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--ink-dim)", lineHeight: 1.4, margin: "0 0 6px" }}>
                    {item.description}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontWeight: 700, fontSize: 11, color: "var(--brand-blue)" }}
                  >
                    לצפייה בחומר ←
                  </a>
                  {item.fileUrl && (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: "block", fontWeight: 700, fontSize: 11, color: "var(--brand-blue)", marginTop: 3 }}
                    >
                      קובץ מצורף ←
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 12,
            borderTop: "1px solid var(--line)",
          }}
        >
          <span style={{ fontSize: 11, color: "#8390B2" }}>חותם · אחריות לחינוך בישראל</span>
        </div>
      </div>
    </div>
  );
}
