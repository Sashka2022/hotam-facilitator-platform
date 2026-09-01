import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { categoryMeta } from "@/lib/categories";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadHeebo(text: string, weight: 400 | 800) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Heebo:wght@${weight}&text=${encodeURIComponent(
      text
    )}`,
    { headers: { "User-Agent": "Mozilla/5.0" } }
  ).then((res) => res.text());

  const match = css.match(/src: url\(([^)]+)\)/);
  if (!match) return null;
  const fontUrl = match[1];
  const fontData = await fetch(fontUrl).then((res) => res.arrayBuffer());
  return fontData;
}

const ICON_PATHS: Record<string, string[]> = {
  presentation: [
    "M3 4h18v12H3z",
    "M8 20h8",
    "M12 16v4",
    "M7 12l3-3 2 2 4-4",
  ],
  video: ["M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", "M10 8.5l6 3.5-6 3.5z"],
  article: ["M6 3h9l3 3v15H6z", "M15 3v4h4", "M9 12h6", "M9 16h6"],
  worksheet: ["M6 4h12v16H6z", "M9 4h6v2H9z", "M9 12l2 2 4-4"],
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const material = await prisma.material.findUnique({
    where: { shareSlug: slug },
  });

  const title = material
    ? material.shareTitle && material.shareTitle.trim()
      ? material.shareTitle.trim()
      : material.title
    : "צידה לדרך";
  const meta = categoryMeta(material?.category ?? "article");
  const label = material ? meta.label : "";

  const [boldFont, regularFont] = await Promise.all([
    loadHeebo(title, 800),
    loadHeebo(label + " אחריות לחינוך בישראל", 400),
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
          background: meta.accent,
          position: "relative",
          direction: "rtl",
        }}
      >
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: 999,
            background: "#FEFEFE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke={meta.accent} strokeWidth={1.6}>
            {(ICON_PATHS[material?.category ?? "article"] || ICON_PATHS.article).map(
              (d, i) => (
                <path key={i} d={d} strokeLinecap="round" strokeLinejoin="round" />
              )
            )}
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            direction: "rtl",
            fontSize: 30,
            color: "rgba(255,255,255,0.9)",
            marginBottom: 20,
          }}
        >
          {label}
        </div>
        <div
          style={{
            display: "flex",
            direction: "rtl",
            fontSize: 56,
            fontWeight: 800,
            color: "#FEFEFE",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            direction: "rtl",
            position: "absolute",
            bottom: 40,
            fontSize: 24,
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
        ...(boldFont
          ? [{ name: "Heebo", data: boldFont, weight: 800 as const, style: "normal" as const }]
          : []),
        ...(regularFont
          ? [{ name: "Heebo", data: regularFont, weight: 400 as const, style: "normal" as const }]
          : []),
      ],
    }
  );
}
