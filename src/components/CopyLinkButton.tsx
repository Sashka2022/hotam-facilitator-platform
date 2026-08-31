"use client";

import { useState } from "react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // clipboard unavailable — no-op, button label stays informative
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      style={{
        width: "100%",
        padding: 13,
        borderRadius: 10,
        border: "none",
        background: "var(--brand-blue)",
        color: "var(--white)",
        fontWeight: 700,
        fontSize: 14,
        marginBottom: 22,
      }}
    >
      {copied ? "הקישור הועתק" : "העתקת קישור לשיתוף"}
    </button>
  );
}
