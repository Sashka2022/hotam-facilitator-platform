"use client";

import { useState } from "react";
import { ShareIcon } from "@/components/icons";

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function ShareMapButton({ isNarrow }: { isNarrow: boolean }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function handleShare() {
    setLoading(true);
    // how long the toast a fallback link or an error needs to stay up so
    // it can actually be read, vs. a quick "copied!" confirmation
    let displayMs = 2500;
    try {
      const res = await fetch("/api/snapshots", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "יצירת קישור השיתוף נכשלה");

      const url = `${window.location.origin}/s/${data.id}`;
      const copied = await copyToClipboard(url);
      setToast(copied ? "קישור השיתוף הועתק ללוח!" : url);
      if (!copied) displayMs = 6000;
    } catch {
      setToast("יצירת קישור השיתוף נכשלה, נסו שוב");
      displayMs = 4000;
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), displayMs);
    }
  }

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        onClick={handleShare}
        disabled={loading}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: isNarrow ? "8px 12px" : "10px 18px",
          border: "1px solid var(--brand-blue)",
          borderRadius: 999,
          background: "transparent",
          color: "var(--brand-blue)",
          fontWeight: 700,
          fontSize: isNarrow ? 12 : 14,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "default" : "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {loading ? (
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              border: "2px solid var(--brand-blue)",
              borderTopColor: "transparent",
              animation: "pdfSpin 700ms linear infinite",
              flexShrink: 0,
            }}
          />
        ) : (
          <ShareIcon size={isNarrow ? 14 : 16} />
        )}
        {isNarrow ? "שיתוף" : loading ? "יוצר קישור..." : "שיתוף מפה"}
      </button>

      {toast && (
        <div
          role="status"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--ink)",
            color: "var(--white)",
            fontSize: 13,
            fontWeight: 700,
            padding: "10px 16px",
            borderRadius: 12,
            boxShadow: "0 12px 28px -10px rgba(11,20,64,0.4)",
            whiteSpace: "nowrap",
            zIndex: 20,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
