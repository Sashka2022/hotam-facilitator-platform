"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function useIsNarrow() {
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isNarrow;
}

export default function Header() {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin";
  const isGallery = pathname === "/";
  const isNarrow = useIsNarrow();

  const tabBase: React.CSSProperties = {
    padding: isNarrow ? "8px 12px" : "10px 20px",
    border: "none",
    borderRadius: 999,
    fontWeight: 700,
    fontSize: isNarrow ? 12 : 14,
    transition: "background 220ms cubic-bezier(0.22,1,0.36,1), color 220ms",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10,
        minHeight: 76,
        padding: isNarrow ? "12px 16px" : "0 40px",
        borderBottom: "1px solid var(--line)",
        background: "var(--white)",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: isNarrow ? 10 : 16, minWidth: 0 }}>
        <img
          src="/hotam-logo-hebrew.png"
          alt="חותם"
          style={{ height: isNarrow ? 26 : 34, width: "auto", display: "block", flexShrink: 0 }}
        />
        <img
          src="/rashit-logo.png"
          alt="ראשית - קהילות מחנכות"
          style={{ height: isNarrow ? 26 : 34, width: "auto", display: "block", flexShrink: 0 }}
        />
        <div style={{ width: 1, height: 28, background: "var(--line)", flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: isNarrow ? 15 : 18,
              color: "var(--ink)",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            פלטפורמה למנחה
          </div>
          {!isNarrow && (
            <div
              style={{
                fontWeight: 500,
                fontSize: 13,
                color: "var(--brand-blue)",
                marginTop: 2,
              }}
            >
              חומרי הדרכה מעוצבים למחנכות
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 4,
          background: "var(--soft-bg)",
          padding: 4,
          borderRadius: 999,
          flexShrink: 0,
        }}
      >
        <Link
          href="/admin"
          style={{
            ...tabBase,
            display: "inline-block",
            background: isAdmin ? "var(--brand-blue)" : "transparent",
            color: isAdmin ? "var(--white)" : "var(--brand-blue)",
          }}
        >
          הוספת חומרים
        </Link>
        <Link
          href="/"
          style={{
            ...tabBase,
            display: "inline-block",
            background: isGallery ? "var(--brand-blue)" : "transparent",
            color: isGallery ? "var(--white)" : "var(--brand-blue)",
          }}
        >
          תצוגת מחנכות
        </Link>
      </div>
    </div>
  );
}
