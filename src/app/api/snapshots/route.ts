import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { genSlug } from "@/lib/categories";

export async function POST() {
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

  let id = genSlug();
  for (let i = 0; i < 5; i++) {
    const clash = await prisma.mapSnapshot.findUnique({ where: { id } });
    if (!clash) break;
    id = genSlug();
  }

  await prisma.mapSnapshot.create({
    data: {
      id,
      data: {
        plenary: { title: plenary.title, description: plenary.description },
        materials,
      },
    },
  });

  return NextResponse.json({ id }, { status: 201 });
}
