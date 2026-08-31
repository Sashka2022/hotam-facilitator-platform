import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const plenary = await prisma.plenary.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "מליאה חדשה",
      description: "הוסיפו כאן תיאור קצר של המליאה.",
    },
  });
  return NextResponse.json(plenary);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";

  if (!title) {
    return NextResponse.json({ error: "כותרת נדרשת" }, { status: 400 });
  }

  const plenary = await prisma.plenary.upsert({
    where: { id: 1 },
    update: { title, description },
    create: { id: 1, title, description },
  });
  return NextResponse.json(plenary);
}
