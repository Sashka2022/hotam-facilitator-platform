import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
  }
  await prisma.material.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
