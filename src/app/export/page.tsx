import { prisma } from "@/lib/prisma";
import { categoryMeta, siteUrl } from "@/lib/categories";
import MaterialIcon from "@/components/MaterialIcon";
import PrintButton from "@/components/PrintButton";
import WhatsAppShareButton from "@/components/WhatsAppShareButton";
import Link from "next/link";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { ADMIN_COOKIE } from "@/proxy";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const plenary = await prisma.plenary.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "מליאה חדשה",
      description: "הוסיפו כאן תיאור קצר של המליאה.",
    },
  });

  return {
    title: `${plenary.title} · חותם`,
    description: plenary.description,
    openGraph: {
      title: plenary.title,
      description: plenary.description,
      url: `${siteUrl()}/export`,
      siteName: "פלטפורמה למנחה · חותם",
      locale: "he_IL",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: plenary.title,
      description: plenary.description,
    },
  };
}

export default async function ExportPage() {
  const plenary = await prisma.plenary.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "מליאה חדשה",
      description: "הוסיפו כאן תיאור קצר של המליאה.",
    },
  });
  const materials = await prisma.material.findMany({ orderBy: { createdAt: "asc" } });
  const key = process.env.ADMIN_ACCESS_KEY;
  const cookieStore = await cookies();
  const isFacilitator = !key || cookieStore.get(ADMIN_COOKIE)?.value === key;

  return (
    <div dir="rtl" lang="he" style={{ background: "var(--soft-bg)", minHeight: "100vh" }}>
      <div
        className="no-print bar-pad"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          background: "var(--white)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {isFacilitator ? (
          <Link href="/admin" style={{ color: "var(--brand-blue)", fontWeight: 700, fontSize: 14 }}>
            ← חזרה לניהול
          </Link>
        ) : (
          <span />
        )}
        <div style={{ display: "flex", gap: 12 }}>
          <WhatsAppShareButton url={`${siteUrl()}/export`} plenaryTitle={plenary.title} />
          <PrintButton />
        </div>
      </div>

      <div
        className="page-pad"
        style={{
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <img src="/hotam-logo-hebrew.png" alt="חותם" style={{ height: 30, width: "auto" }} />
        </div>

        <div
          className="print-color"
          style={{
            background: "var(--gradient)",
            borderRadius: 28,
            padding: "40px 36px",
            color: "var(--white)",
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.03em", opacity: 0.9, marginBottom: 10 }}>
            מליאה
          </div>
          <div style={{ fontWeight: 800, fontSize: 30, lineHeight: 1.3, marginBottom: 14 }}>{plenary.title}</div>
          <div style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.97, maxWidth: 520, margin: "0 auto" }}>
            {plenary.description}
          </div>
        </div>

        <h2 style={{ fontWeight: 800, fontSize: 18, color: "var(--ink)", margin: "0 0 18px" }}>
          חומרי עזר למנחה ({materials.length})
        </h2>

        {materials.map((item) => {
          const meta = categoryMeta(item.category);
          return (
            <div
              key={item.id}
              className="material-card"
              style={{
                display: "flex",
                gap: 18,
                background: "var(--white)",
                border: "1px solid var(--line)",
                borderRadius: 18,
                padding: "22px 24px",
                marginBottom: 16,
              }}
            >
              <div
                className="print-color"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: meta.accent + "26",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MaterialIcon category={item.category} color="#0048FF" size={28} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  className="print-color"
                  style={{
                    display: "inline-block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--brand-blue)",
                    background: meta.accent + "1f",
                    padding: "2px 10px",
                    borderRadius: 999,
                    marginBottom: 8,
                  }}
                >
                  {meta.label}
                </div>
                <div style={{ fontWeight: 800, fontSize: 17, color: "var(--ink)", marginBottom: 6 }}>
                  {item.title}
                </div>
                <p style={{ fontSize: 14, color: "var(--ink-dim)", lineHeight: 1.6, margin: "0 0 10px" }}>
                  {item.description}
                </p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontWeight: 700, fontSize: 14, color: "var(--brand-blue)" }}
                >
                  פתיחת החומר ←
                </a>
                <div
                  style={{
                    fontSize: 11,
                    color: "#8390B2",
                    marginTop: 4,
                    direction: "ltr",
                    textAlign: "right",
                    wordBreak: "break-all",
                  }}
                >
                  {item.link}
                </div>
                {item.fileUrl && (
                  <div style={{ marginTop: 6 }}>
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontWeight: 700, fontSize: 13, color: "var(--brand-blue)" }}
                    >
                      קובץ מצורף ←
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            paddingTop: 24,
            marginTop: 8,
            borderTop: "1px solid var(--line)",
          }}
        >
          <span style={{ fontSize: 12, color: "#8390B2" }}>חותם · אחריות לחינוך בישראל</span>
        </div>
      </div>
    </div>
  );
}
