import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/categories";
import PrintButton from "@/components/PrintButton";
import WhatsAppShareButton from "@/components/WhatsAppShareButton";
import PrintExportStage from "@/components/PrintExportStage";
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
      siteName: "צידה לדרך · חותם",
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
  const materialsRaw = await prisma.material.findMany({ orderBy: { createdAt: "asc" } });
  const materials = materialsRaw.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }));
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

      <div className="page-pad" style={{ margin: "0 auto" }}>
        <PrintExportStage plenary={plenary} materials={materials} />
      </div>
    </div>
  );
}
