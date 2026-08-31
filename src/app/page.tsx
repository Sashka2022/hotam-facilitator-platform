import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import GalleryClient from "@/components/GalleryClient";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--white)",
        overflow: "hidden",
      }}
    >
      <Header />
      <GalleryClient plenary={plenary} materials={materials} />
    </div>
  );
}
