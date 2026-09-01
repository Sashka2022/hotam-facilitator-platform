"use client";

import { useEffect, useState } from "react";
import { Material, Plenary } from "@/types";
import { CATEGORY_OPTIONS, categoryMeta } from "@/lib/categories";
import MaterialIcon from "@/components/MaterialIcon";
import { ShareIcon, UploadIcon, TrashIcon } from "@/components/icons";
import { DRAFT_FORM_KEY, DRAFT_PLENARY_KEY, readDraft, writeDraft, clearDraft } from "@/lib/draftStorage";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid var(--line)",
  borderRadius: 10,
  fontSize: 14,
  color: "var(--ink)",
  marginBottom: 18,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 700,
  color: "var(--ink)",
  marginBottom: 6,
};

const formCardStyle: React.CSSProperties = {
  background: "var(--white)",
  border: "1px solid var(--line)",
  borderRadius: 16,
  padding: 32,
  boxShadow: "0 8px 24px -10px rgba(11,20,64,0.18)",
  flexShrink: 0,
};

export default function AdminClient({
  initialPlenary,
  initialMaterials,
}: {
  initialPlenary: Plenary;
  initialMaterials: Material[];
}) {
  const [plenary, setPlenary] = useState(initialPlenary);
  const [plenarySaved, setPlenarySaved] = useState(false);
  const [materials, setMaterials] = useState(initialMaterials);
  const [form, setForm] = useState({
    title: "",
    shareTitle: "",
    link: "",
    category: "presentation",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [draftRestored, setDraftRestored] = useState(false);

  // Restore any in-progress drafts left behind by an accidental refresh —
  // done in an effect (not the initial state) so the client render always
  // starts from the server-provided values and only swaps in the draft
  // after hydration, avoiding a hydration mismatch.
  useEffect(() => {
    const draftForm = readDraft<typeof form>(DRAFT_FORM_KEY);
    if (draftForm) setForm(draftForm);
    const draftPlenary = readDraft<Plenary>(DRAFT_PLENARY_KEY);
    if (draftPlenary) setPlenary(draftPlenary);
    setDraftRestored(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Back up drafts to sessionStorage while typing — private to this browser
  // tab, cleared automatically when the tab closes or on an explicit reset,
  // so an accidental refresh before submitting doesn't lose the work.
  useEffect(() => {
    if (!draftRestored) return;
    writeDraft(DRAFT_FORM_KEY, form);
  }, [form, draftRestored]);

  useEffect(() => {
    if (!draftRestored) return;
    writeDraft(DRAFT_PLENARY_KEY, plenary);
  }, [plenary, draftRestored]);

  const savePlenary = async () => {
    const res = await fetch("/api/plenary", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plenary),
    });
    if (res.ok) {
      clearDraft(DRAFT_PLENARY_KEY);
      setPlenarySaved(true);
      setTimeout(() => setPlenarySaved(false), 2000);
    }
  };

  const addMaterial = async () => {
    setError("");
    if (!form.title.trim() || !form.link.trim()) {
      setError("שם החומר וקישור לחומר הם שדות חובה");
      return;
    }
    setSubmitting(true);
    try {
      let fileUrl: string | null = null;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          setError(uploadData.error || "העלאת הקובץ נכשלה");
          setSubmitting(false);
          return;
        }
        fileUrl = uploadData.url;
      }

      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, fileUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "הוספת החומר נכשלה");
        setSubmitting(false);
        return;
      }
      setMaterials((prev) => [...prev, data]);
      setForm({ title: "", shareTitle: "", link: "", category: "presentation", description: "" });
      setFile(null);
      clearDraft(DRAFT_FORM_KEY);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMaterial = async (id: number) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    await fetch(`/api/materials/${id}`, { method: "DELETE" });
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 32,
        alignItems: "flex-start",
        maxWidth: 1200,
        margin: "0 auto",
        flexWrap: "wrap",
      }}
    >
      <div style={{ ...formCardStyle, width: 400, maxWidth: "100%" }}>
        <h2 style={{ fontWeight: 800, fontSize: 20, color: "var(--brand-blue)", margin: "0 0 8px" }}>
          עריכת המליאה
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-dim)", lineHeight: 1.5, margin: "0 0 20px" }}>
          הטקסט הזה יופיע בכרטיס המרכזי שמחבר בין כל חומרי המפגש.
        </p>

        <label style={labelStyle}>כותרת המליאה</label>
        <input
          type="text"
          value={plenary.title}
          onChange={(e) => setPlenary((p) => ({ ...p, title: e.target.value }))}
          placeholder="לדוגמה: מליאת טשרניחובסקי"
          style={inputStyle}
        />

        <label style={labelStyle}>תקציר המליאה</label>
        <textarea
          value={plenary.description}
          onChange={(e) => setPlenary((p) => ({ ...p, description: e.target.value }))}
          rows={4}
          placeholder="כמה משפטים על נושא המליאה..."
          style={{ ...inputStyle, resize: "vertical" }}
        />

        <button
          onClick={savePlenary}
          style={{
            width: "100%",
            padding: 12,
            border: "none",
            borderRadius: 10,
            background: "var(--brand-blue)",
            color: "var(--white)",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {plenarySaved ? "נשמר" : "שמירת המליאה"}
        </button>
      </div>

      <div style={{ ...formCardStyle, width: 400, maxWidth: "100%" }}>
        <h2 style={{ fontWeight: 800, fontSize: 22, color: "var(--brand-blue)", margin: "0 0 8px" }}>
          הוספת חומר חדש
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-dim)", lineHeight: 1.5, margin: "0 0 24px" }}>
          הזינו פרטים על החומר, ותוכלו לראות מיד איך הוא ייראה סביב המליאה — ואיך ייראה כשתשתפו אותו.
        </p>

        <label style={labelStyle}>שם החומר</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="לדוגמה: מצגת פתיחה לשנה״ל"
          style={inputStyle}
        />

        <label style={labelStyle}>
          כותרת לשיתוף{" "}
          <span style={{ fontWeight: 400, color: "#8390B2" }}>
            (מה שיוצג כשמשתפים את הקישור — אופציונלי)
          </span>
        </label>
        <input
          type="text"
          value={form.shareTitle}
          onChange={(e) => setForm((f) => ({ ...f, shareTitle: e.target.value }))}
          placeholder="כברירת מחדל: שם החומר"
          style={inputStyle}
        />

        <label style={labelStyle}>קישור לחומר</label>
        <input
          type="url"
          value={form.link}
          onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
          placeholder="https://..."
          style={{ ...inputStyle, direction: "ltr", textAlign: "right" }}
        />

        <label style={labelStyle}>סוג החומר</label>
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          style={{ ...inputStyle, background: "var(--white)" }}
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label style={labelStyle}>תיאור קצר למחנכות</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={3}
          placeholder="כמה מילים על מה זה ולמה זה שימושי..."
          style={{ ...inputStyle, resize: "vertical" }}
        />

        <label
          style={{
            display: "block",
            border: "2px dashed var(--line)",
            borderRadius: 12,
            padding: 20,
            textAlign: "center",
            marginBottom: 20,
            background: "var(--soft-bg)",
            cursor: "pointer",
          }}
        >
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            style={{ display: "none" }}
          />
          <div style={{ width: 26, height: 26, margin: "0 auto 8px", color: "var(--brand-blue)" }}>
            <UploadIcon size={26} />
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-dim)" }}>
            {file ? file.name : "גררו קובץ לכאן או לחצו לבחירה"}
          </div>
          <div style={{ fontSize: 11, color: "#8390B2", marginTop: 4 }}>
            קובץ מצורף אופציונלי (PDF, מצגת, תמונה וכד׳)
          </div>
        </label>

        {error && (
          <div style={{ color: "#c0392b", fontSize: 13, marginBottom: 14 }}>{error}</div>
        )}

        <button
          onClick={addMaterial}
          disabled={submitting}
          style={{
            width: "100%",
            padding: 12,
            border: "none",
            borderRadius: 10,
            background: "var(--brand-blue)",
            color: "var(--white)",
            fontWeight: 700,
            fontSize: 15,
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "מוסיף..." : "הוספה למליאה"}
        </button>
      </div>

      <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
        <h3 style={{ fontWeight: 800, fontSize: 17, color: "var(--ink)", margin: "0 0 16px" }}>
          החומרים שהוספת ({materials.length})
        </h3>
        {materials.map((item) => {
          const meta = categoryMeta(item.category);
          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
                background: "var(--white)",
                border: "1px solid var(--line)",
                borderRadius: 14,
                padding: "14px 20px",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: meta.accent + "26",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MaterialIcon category={item.category} color="#0048FF" size={24} />
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--ink)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-dim)", marginTop: 2 }}>{meta.label}</div>
              </div>
              <a
                href={`/m/${item.shareSlug}`}
                target="_blank"
                rel="noreferrer"
                aria-label="שיתוף"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 999,
                  border: "1px solid var(--line)",
                  background: "var(--white)",
                  color: "var(--brand-blue)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ShareIcon size={17} />
              </a>
              <a
                href={`/m/${item.shareSlug}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "1px solid var(--brand-blue)",
                  background: "transparent",
                  color: "var(--brand-blue)",
                  fontWeight: 700,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                תצוגה מקדימה
              </a>
              <button
                onClick={() => deleteMaterial(item.id)}
                aria-label="מחיקה"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 999,
                  border: "1px solid var(--line)",
                  background: "var(--white)",
                  color: "#c0392b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <TrashIcon size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
