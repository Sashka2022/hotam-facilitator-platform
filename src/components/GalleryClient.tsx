"use client";

import { useEffect, useMemo, useState } from "react";
import { Material, Plenary } from "@/types";
import { categoryMeta, siteUrl } from "@/lib/categories";
import MaterialIcon from "@/components/MaterialIcon";
import { ShareIcon, CloseIcon, ChevronDownIcon } from "@/components/icons";
import ShareBlock from "@/components/ShareBlock";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

export default function GalleryClient({
  plenary,
  materials,
}: {
  plenary: Plenary;
  materials: Material[];
}) {
  const isMobile = useIsMobile();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [shareExpanded, setShareExpanded] = useState(false);

  const total = materials.length;
  const stageCx = 450,
    stageCy = 350,
    orbitR = 280;

  const positioned = useMemo(
    () =>
      materials.map((m, i) => {
        const theta = total > 0 ? (i * 2 * Math.PI) / total : 0;
        const dx = Math.round(orbitR * Math.sin(theta));
        const dy = Math.round(-orbitR * Math.cos(theta));
        return { ...m, satX: stageCx + dx, satY: stageCy + dy };
      }),
    [materials, total]
  );

  const detailItem = materials.find((m) => m.id === detailId) || null;

  const openDetail = (id: number) => {
    setDetailId(id);
    setShareExpanded(false);
  };
  const openShare = (id: number, e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    setDetailId(id);
    setShareExpanded(true);
  };
  const closeDetail = () => {
    setDetailId(null);
    setShareExpanded(false);
  };

  return (
    <div
      className="hotam-scroll"
      style={{
        flex: 1,
        overflow: "auto",
        background: "var(--soft-bg)",
        padding: isMobile ? "24px 16px" : "40px",
      }}
    >
      {isMobile ? (
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div
            className="plenary-mobile"
            tabIndex={0}
            role="group"
            aria-label={plenary.title}
            style={{
              background: "var(--brand-blue)",
              color: "var(--white)",
              borderRadius: 28,
              padding: "32px 28px",
              boxShadow: "0 20px 50px -20px rgba(0,72,255,0.45)",
              marginBottom: 24,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.03em", opacity: 0.85, marginBottom: 10 }}>
              מליאה
            </div>
            <div style={{ fontWeight: 800, fontSize: 22, lineHeight: 1.3, marginBottom: 12 }}>
              {plenary.title}
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.95 }}>{plenary.description}</div>
          </div>

          {materials.map((item) => {
            const meta = categoryMeta(item.category);
            const isActive = activeId === item.id;
            return (
              <div
                key={item.id}
                style={{
                  position: "relative",
                  background: "var(--white)",
                  border: "1px solid var(--line)",
                  borderRadius: 16,
                  marginBottom: 12,
                  overflow: "hidden",
                }}
              >
                <button
                  className="accordion-toggle"
                  onClick={() => setActiveId(isActive ? null : item.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 56px 14px 18px",
                    border: "none",
                    background: "transparent",
                    textAlign: "right",
                    minHeight: 64,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: meta.accent + "26",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <MaterialIcon category={item.category} color="#0048FF" size={26} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-dim)", marginTop: 2 }}>{meta.label}</div>
                  </div>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      color: "#8390B2",
                      flexShrink: 0,
                      transform: isActive ? "rotate(180deg)" : undefined,
                      transition: "transform 200ms",
                    }}
                  >
                    <ChevronDownIcon size={20} />
                  </div>
                </button>
                <button
                  onClick={(e) => openShare(item.id, e)}
                  aria-label="שיתוף"
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    border: "none",
                    background: "var(--soft-bg)",
                    color: "var(--brand-blue)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShareIcon size={16} />
                </button>
                {isActive && (
                  <div style={{ padding: "14px 18px 20px", borderTop: "1px solid var(--line)", marginTop: 2 }}>
                    <p style={{ fontSize: 14, color: "var(--ink-dim)", lineHeight: 1.55, margin: "0 0 14px" }}>
                      {item.description}
                    </p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "block",
                        textAlign: "center",
                        padding: 12,
                        borderRadius: 10,
                        background: "var(--brand-blue)",
                        color: "var(--white)",
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      לצפייה בחומר
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ position: "relative", width: 900, height: 700, maxWidth: "100%", margin: "20px auto" }}>
          <svg
            viewBox="0 0 900 700"
            width={900}
            height={700}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            {positioned.map((item) => (
              <line
                key={item.id}
                className="hub-line"
                x1={450}
                y1={350}
                x2={item.satX}
                y2={item.satY}
                stroke="var(--line)"
                strokeWidth={2}
              />
            ))}
          </svg>

          <div
            className="hub-center"
            tabIndex={0}
            role="group"
            aria-label={plenary.title}
            style={{
              position: "absolute",
              left: 450,
              top: 350,
              width: 320,
              padding: "32px 30px",
              borderRadius: 44,
              background: "var(--brand-blue)",
              color: "var(--white)",
              boxShadow: "0 30px 70px -20px rgba(0,72,255,0.45)",
              textAlign: "center",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.03em", opacity: 0.85, marginBottom: 10 }}>
              מליאה
            </div>
            <div style={{ fontWeight: 800, fontSize: 21, lineHeight: 1.3, marginBottom: 12 }}>{plenary.title}</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.95 }}>{plenary.description}</div>
          </div>

          {positioned.map((item, i) => {
            const meta = categoryMeta(item.category);
            const isActive = activeId === item.id;
            const btnWidth = isActive ? 200 : 108;
            return (
              <div
                key={item.id}
                className="satellite-wrap"
                style={{
                  position: "absolute",
                  left: item.satX,
                  top: item.satY,
                  animationDelay: `${260 + i * 90}ms`,
                }}
              >
                <button
                  className="satellite-btn"
                  onClick={() => openDetail(item.id)}
                  onMouseEnter={() => setActiveId(item.id)}
                  onMouseLeave={() => setActiveId((a) => (a === item.id ? null : a))}
                  onFocus={() => setActiveId(item.id)}
                  onBlur={() => setActiveId((a) => (a === item.id ? null : a))}
                  style={{
                    display: "block",
                    border: "none",
                    cursor: "pointer",
                    padding: "18px 14px",
                    textAlign: "center",
                    background: "var(--white)",
                    borderRadius: 24,
                    width: btnWidth,
                    transition:
                      "width 260ms cubic-bezier(0.22,1,0.36,1), box-shadow 220ms",
                    boxShadow: isActive
                      ? "0 16px 34px -10px rgba(11,20,64,0.3)"
                      : "0 6px 18px -8px rgba(11,20,64,0.18)",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: meta.accent + "26",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 8px",
                    }}
                  >
                    <MaterialIcon category={item.category} color="#0048FF" size={30} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "var(--ink)", lineHeight: 1.3 }}>
                    {item.title}
                  </div>
                  {isActive && (
                    <>
                      <div style={{ fontSize: 12, color: "var(--ink-dim)", lineHeight: 1.5, marginTop: 8 }}>
                        {item.description}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--brand-blue)", fontWeight: 700, marginTop: 8 }}>
                        לצפייה בחומר ←
                      </div>
                    </>
                  )}
                </button>
                <button
                  onClick={(e) => openShare(item.id, e)}
                  aria-label="שיתוף"
                  style={{
                    position: "absolute",
                    top: -6,
                    left: -6,
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    border: "1px solid var(--line)",
                    background: "var(--white)",
                    color: "var(--brand-blue)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShareIcon size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {detailItem && (
        <div
          onClick={closeDetail}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(11,20,64,0.5)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            zIndex: 50,
            padding: "40px 24px",
            overflow: "auto",
          }}
        >
          <div
            className="hotam-scroll"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 600,
              maxWidth: "100%",
              maxHeight: "100%",
              overflow: "auto",
              background: "var(--white)",
              borderRadius: 28,
              boxShadow: "0 24px 60px -20px rgba(11,20,64,0.3)",
            }}
          >
            <div
              style={{
                position: "relative",
                padding: "44px 36px 40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 16,
                background: "var(--gradient)",
              }}
            >
              <button
                className="icon-btn-light"
                onClick={closeDetail}
                aria-label="סגירה"
                style={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  width: 38,
                  height: 38,
                  borderRadius: 999,
                  border: "none",
                  background: "rgba(255,255,255,0.25)",
                  color: "var(--white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CloseIcon size={17} />
              </button>
              <div
                style={{
                  width: 104,
                  height: 104,
                  borderRadius: 999,
                  background: "var(--white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px -10px rgba(11,20,64,0.3)",
                }}
              >
                <MaterialIcon category={detailItem.category} color="#0048FF" size={56} />
              </div>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.25)",
                  color: "var(--white)",
                  fontSize: 13,
                  fontWeight: 700,
                  padding: "5px 14px",
                  borderRadius: 999,
                }}
              >
                {categoryMeta(detailItem.category).label}
              </div>
              <div style={{ fontWeight: 800, fontSize: 28, color: "var(--white)", lineHeight: 1.3, maxWidth: 440 }}>
                {detailItem.title}
              </div>
            </div>

            <div style={{ padding: 36 }}>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink)", margin: "0 0 28px" }}>
                {detailItem.description}
              </p>

              <a
                href={detailItem.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: 16,
                  borderRadius: 999,
                  background: "var(--brand-blue)",
                  color: "var(--white)",
                  fontWeight: 700,
                  fontSize: 16,
                  marginBottom: 12,
                }}
              >
                פתיחת החומר המלא
              </a>
              <button
                onClick={() => setShareExpanded((s) => !s)}
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: 14,
                  borderRadius: 999,
                  background: "transparent",
                  border: "1px solid var(--line)",
                  color: "var(--brand-blue)",
                  fontWeight: 700,
                  fontSize: 15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginBottom: 28,
                }}
              >
                <ShareIcon size={17} />
                <span>שיתוף החומר</span>
              </button>

              {shareExpanded && (
                <ShareBlock
                  material={detailItem}
                  shareUrl={`${siteUrl()}/m/${detailItem.shareSlug}`}
                  displayUrl={`${siteUrl().replace(/^https?:\/\//, "")}/m/${detailItem.shareSlug}`}
                  ogImageUrl={`${siteUrl()}/m/${detailItem.shareSlug}/opengraph-image`}
                />
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  paddingTop: 20,
                  borderTop: "1px solid var(--line)",
                }}
              >
                <img src="/hotam-logo-hebrew.png" alt="חותם" style={{ height: 16, width: "auto", opacity: 0.7 }} />
                <img src="/rashit-logo.png" alt="ראשית - קהילות מחנכות" style={{ height: 7, width: "auto", opacity: 0.7 }} />
                <span style={{ fontSize: 12, color: "#8390B2" }}>אחריות לחינוך בישראל</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
