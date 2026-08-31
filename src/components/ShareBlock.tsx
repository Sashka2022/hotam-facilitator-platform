import CopyLinkButton from "./CopyLinkButton";
import { Material } from "@/types";

export default function ShareBlock({
  material,
  shareUrl,
  displayUrl,
  ogImageUrl,
}: {
  material: Material;
  shareUrl: string;
  displayUrl: string;
  ogImageUrl: string;
}) {
  const effectiveShareTitle =
    material.shareTitle && material.shareTitle.trim()
      ? material.shareTitle.trim()
      : material.title;

  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: 18,
        padding: 24,
        background: "#F9FAFF",
        marginBottom: 28,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)", marginBottom: 6 }}>
        כותרת השיתוף
      </div>
      <div
        style={{
          fontSize: 14,
          color: "var(--brand-blue)",
          fontWeight: 700,
          marginBottom: 18,
        }}
      >
        {effectiveShareTitle}
      </div>

      <div style={{ fontSize: 11, color: "#8390B2", marginBottom: 6 }}>
        קישור ייחודי לחומר הזה:
      </div>
      <div
        style={{
          background: "var(--white)",
          border: "1px solid var(--line)",
          borderRadius: 10,
          padding: "10px 14px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          color: "var(--brand-blue)",
          marginBottom: 16,
          direction: "ltr",
          textAlign: "left",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {displayUrl}
      </div>

      <CopyLinkButton url={shareUrl} />

      <div style={{ fontSize: 12, color: "#8390B2", marginBottom: 10 }}>
        כך ייראה הקישור כשתשלחו אותו לקבוצת וואטסאפ:
      </div>
      <div
        style={{
          border: "1px solid var(--line)",
          borderRadius: 16,
          overflow: "hidden",
          maxWidth: 280,
          background: "var(--white)",
          boxShadow: "0 1px 2px rgba(11,20,64,0.06)",
        }}
      >
        <img
          src={ogImageUrl}
          alt=""
          style={{ display: "block", width: "100%", height: 140, objectFit: "cover" }}
        />
        <div style={{ padding: "12px 14px", textAlign: "right" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)", lineHeight: 1.35 }}>
            {effectiveShareTitle}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#8390B2",
              marginTop: 4,
              direction: "ltr",
              textAlign: "left",
            }}
          >
            {displayUrl}
          </div>
        </div>
      </div>
    </div>
  );
}
