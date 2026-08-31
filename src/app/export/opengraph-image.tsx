import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadHeebo(text: string, weight: 400 | 800) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Heebo:wght@${weight}&text=${encodeURIComponent(text)}`,
    { headers: { "User-Agent": "Mozilla/5.0" } }
  ).then((res) => res.text());

  const match = css.match(/src: url\(([^)]+)\)/);
  if (!match) return null;
  const fontUrl = match[1];
  const fontData = await fetch(fontUrl).then((res) => res.arrayBuffer());
  return fontData;
}

export default async function OgImage() {
  const plenary = await prisma.plenary.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "מליאה חדשה",
      description: "הוסיפו כאן תיאור קצר של המליאה.",
    },
  });
  const materialsCount = await prisma.material.count();

  const [boldFont, regularFont] = await Promise.all([
    loadHeebo(plenary.title, 800),
    loadHeebo(`${materialsCount} חומרים · חותם אחריות לחינוך בישראל`, 400),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0048FF 0%, #41CAC5 100%)",
          position: "relative",
          direction: "rtl",
        }}
      >
        <div
          style={{
            display: "flex",
            direction: "rtl",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.03em",
            color: "rgba(255,255,255,0.85)",
            marginBottom: 26,
          }}
        >
          חומרי הדרכה למנחה
        </div>
        <div
          style={{
            display: "flex",
            direction: "rtl",
            fontSize: 60,
            fontWeight: 800,
            color: "#FEFEFE",
            textAlign: "center",
            maxWidth: 940,
            lineHeight: 1.3,
          }}
        >
          {plenary.title}
        </div>
        <div
          style={{
            display: "flex",
            direction: "rtl",
            fontSize: 26,
            color: "rgba(255,255,255,0.9)",
            marginTop: 30,
            background: "rgba(255,255,255,0.18)",
            padding: "10px 26px",
            borderRadius: 999,
          }}
        >
          {materialsCount} חומרים לשימוש המנחה
        </div>
        <div
          style={{
            display: "flex",
            direction: "rtl",
            position: "absolute",
            bottom: 40,
            fontSize: 22,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          חותם · אחריות לחינוך בישראל
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        ...(boldFont ? [{ name: "Heebo", data: boldFont, weight: 800 as const, style: "normal" as const }] : []),
        ...(regularFont
          ? [{ name: "Heebo", data: regularFont, weight: 400 as const, style: "normal" as const }]
          : []),
      ],
    }
  );
}
