import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import AdminClient from "@/components/AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
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

  return (
    <div
      dir="rtl"
      lang="he"
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--white)",
      }}
    >
      <Header />
      <div className="hotam-scroll page-pad" style={{ flex: 1, overflow: "auto", background: "var(--soft-bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto 24px", display: "flex", justifyContent: "flex-end" }}>
          <Link
            href="/export"
            target="_blank"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 22px",
              borderRadius: 999,
              background: "var(--brand-blue)",
              color: "var(--white)",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            ייצוא PDF למחנכות ←
          </Link>
        </div>
        <AdminClient initialPlenary={plenary} initialMaterials={materials} />
      </div>
    </div>
  );
}
