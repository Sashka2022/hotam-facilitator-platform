"use client";

export default function PrintButton() {
  return (
    <button
      className="no-print"
      onClick={() => window.print()}
      style={{
        padding: "14px 28px",
        borderRadius: 999,
        border: "none",
        background: "var(--brand-blue)",
        color: "var(--white)",
        fontWeight: 700,
        fontSize: 15,
      }}
    >
      הדפסה / שמירה כ-PDF
    </button>
  );
}
