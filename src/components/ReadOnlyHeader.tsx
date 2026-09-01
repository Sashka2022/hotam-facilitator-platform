export default function ReadOnlyHeader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        minHeight: 76,
        padding: "0 40px",
        borderBottom: "1px solid var(--line)",
        background: "var(--white)",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 32, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <img
            src="/hotam-logo-hebrew.png"
            alt="חותם"
            style={{ height: 34, width: "auto", display: "block", flexShrink: 0 }}
          />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flexShrink: 0 }}>
            <img
              src="/rashit-logo.png"
              alt="ראשית - קהילות מחנכות"
              style={{ height: 15, width: "auto", display: "block" }}
            />
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#2E7A7C",
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}
            >
              ראשית קהילת מחנכות
            </span>
          </div>
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: 18,
              color: "var(--ink)",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            צידה לדרך
          </div>
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
        </div>
      </div>
    </div>
  );
}
