import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { genSlug } from "@/lib/categories";

export async function GET() {
  const materials = await prisma.material.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(materials);
}

const VALID_CATEGORIES = ["presentation", "video", "article", "worksheet"];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const link = typeof body.link === "string" ? body.link.trim() : "";
  const shareTitle =
    typeof body.shareTitle === "string" ? body.shareTitle.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const category = VALID_CATEGORIES.includes(body.category)
    ? body.category
    : "presentation";
  const fileUrl = typeof body.fileUrl === "string" && body.fileUrl ? body.fileUrl : null;

  if (!title || !link) {
    return NextResponse.json(
      { error: "שם החומר וקישור לחומר הם שדות חובה" },
      { status: 400 }
    );
  }

  let shareSlug = genSlug();
  for (let i = 0; i < 5; i++) {
    const clash = await prisma.material.findUnique({ where: { shareSlug } });
    if (!clash) break;
    shareSlug = genSlug();
  }

  const material = await prisma.material.create({
    data: { title, shareTitle, link, category, description, fileUrl, shareSlug },
  });

  return NextResponse.json(material, { status: 201 });
}
