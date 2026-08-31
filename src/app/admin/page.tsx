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
      <div className="hotam-scroll" style={{ flex: 1, overflow: "auto", background: "var(--soft-bg)", padding: 40 }}>
        <AdminClient initialPlenary={plenary} initialMaterials={materials} />
      </div>
    </div>
  );
}
