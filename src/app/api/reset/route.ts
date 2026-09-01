import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  await prisma.$transaction([
    prisma.material.deleteMany(),
    prisma.plenary.upsert({
      where: { id: 1 },
      update: { title: "מליאה חדשה", description: "הוסיפו כאן תיאור קצר של המליאה." },
      create: { id: 1, title: "מליאה חדשה", description: "הוסיפו כאן תיאור קצר של המליאה." },
    }),
  ]);
  return NextResponse.json({ ok: true });
}
