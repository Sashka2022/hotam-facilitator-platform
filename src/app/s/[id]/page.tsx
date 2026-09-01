import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/categories";
import { Material, Plenary } from "@/types";
import ReadOnlyHeader from "@/components/ReadOnlyHeader";
import GalleryClient from "@/components/GalleryClient";
import type { Metadata } from "next";

type SnapshotData = { plenary: Plenary; materials: Material[] };

async function getSnapshot(id: string) {
  const snapshot = await prisma.mapSnapshot.findUnique({ where: { id } });
  if (!snapshot) return null;
  return snapshot.data as unknown as SnapshotData;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getSnapshot(id);
  if (!data) return {};

  return {
    title: `${data.plenary.title} · צידה לדרך`,
    description: data.plenary.description,
    openGraph: {
      title: data.plenary.title,
      description: data.plenary.description,
      url: `${siteUrl()}/s/${id}`,
      siteName: "צידה לדרך · חותם",
      locale: "he_IL",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data.plenary.title,
      description: data.plenary.description,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function SnapshotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getSnapshot(id);
  if (!data) notFound();

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
      <ReadOnlyHeader />
      <GalleryClient plenary={data.plenary} materials={data.materials} />
    </div>
  );
}
