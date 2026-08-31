export default function AdminLockedPage() {
  return (
    <div
      dir="rtl"
      lang="he"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--soft-bg)",
        padding: 24,
      }}
    >
      <div
        style={{
          width: 420,
          maxWidth: "100%",
          background: "var(--white)",
          borderRadius: 24,
          boxShadow: "0 24px 60px -20px rgba(11,20,64,0.3)",
          padding: 36,
          textAlign: "center",
        }}
      >
        <img
          src="/hotam-logo-hebrew.png"
          alt="חותם"
          style={{ height: 28, width: "auto", marginBottom: 20 }}
        />
        <div style={{ fontWeight: 800, fontSize: 20, color: "var(--ink)", marginBottom: 10 }}>
          אזור זה מיועד למנחים בלבד
        </div>
        <p style={{ fontSize: 14, color: "var(--ink-dim)", lineHeight: 1.6, marginBottom: 24 }}>
          כדי לערוך חומרים יש להיכנס דרך הקישור הקבוע שנשלח אליכם. אם אין ברשותכם קישור, פנו למי
          שהקים את הפלטפורמה.
        </p>
        <form action="/admin" method="get" style={{ display: "flex", gap: 8 }}>
          <input
            name="key"
            type="password"
            placeholder="הדבקת קוד גישה"
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid var(--line)",
              fontSize: 14,
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 20px",
              borderRadius: 12,
              border: "none",
              background: "var(--brand-blue)",
              color: "var(--white)",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            כניסה
          </button>
        </form>
      </div>
    </div>
  );
}
