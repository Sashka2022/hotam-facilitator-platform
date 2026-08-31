"use client";

export default function WhatsAppShareButton({
  url,
  plenaryTitle,
}: {
  url: string;
  plenaryTitle: string;
}) {
  const message = `חומרי עזר למליאה "${plenaryTitle}" מחותם — כולל קישורים לכל החומרים:\n${url}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  return (
    <a
      className="no-print"
      href={waUrl}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "14px 24px",
        borderRadius: 999,
        border: "1px solid #25D366",
        background: "transparent",
        color: "#1DA851",
        fontWeight: 700,
        fontSize: 15,
      }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.03c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.61-.6-2.84-1.23-4.7-4.1-4.84-4.29-.14-.19-1.15-1.53-1.15-2.92s.72-2.07.98-2.35c.26-.28.56-.35.75-.35s.37 0 .53.01c.17.01.4-.06.62.48.24.58.81 2 .88 2.14.07.14.11.31.02.5-.09.19-.14.31-.27.47-.14.16-.29.36-.41.48-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.18-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.47.21.53.33.07.12.07.68-.17 1.36z" />
      </svg>
      <span>שליחה בוואטסאפ</span>
    </a>
  );
}
