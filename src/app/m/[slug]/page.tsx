import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { categoryMeta, siteUrl } from "@/lib/categories";
import MaterialIcon from "@/components/MaterialIcon";
import ShareBlock from "@/components/ShareBlock";
import type { Metadata } from "next";

async function getMaterial(slug: string) {
  return prisma.material.findUnique({ where: { shareSlug: slug } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const material = await getMaterial(slug);
  if (!material) return {};

  const effectiveShareTitle =
    material.shareTitle && material.shareTitle.trim()
      ? material.shareTitle.trim()
      : material.title;

  return {
    title: `${effectiveShareTitle} · צידה לדרך`,
    description: material.description,
    openGraph: {
      title: effectiveShareTitle,
      description: material.description,
      url: `${siteUrl()}/m/${material.shareSlug}`,
      siteName: "צידה לדרך · חותם",
      locale: "he_IL",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: effectiveShareTitle,
      description: material.description,
    },
  };
}

export default async function MaterialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const material = await getMaterial(slug);
  if (!material) notFound();

  const meta = categoryMeta(material.category);
  const displayUrl = `${siteUrl().replace(/^https?:\/\//, "")}/m/${material.shareSlug}`;
  const shareUrl = `${siteUrl()}/m/${material.shareSlug}`;
  const ogImageUrl = `${siteUrl()}/m/${material.shareSlug}/opengraph-image`;

  return (
    <div
      dir="rtl"
      lang="he"
      style={{
        minHeight: "100vh",
        background: "var(--soft-bg)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div
        className="fade-up"
        style={{
          width: 600,
          maxWidth: "100%",
          background: "var(--white)",
          borderRadius: 28,
          boxShadow: "0 24px 60px -20px rgba(11,20,64,0.3)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            padding: "44px 36px 40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 16,
            background: "var(--gradient)",
          }}
        >
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: 999,
              background: "var(--white)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px -10px rgba(11,20,64,0.3)",
            }}
          >
            <MaterialIcon category={material.category} color="#0048FF" size={56} />
          </div>
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.25)",
              color: "var(--white)",
              fontSize: 13,
              fontWeight: 700,
              padding: "5px 14px",
              borderRadius: 999,
            }}
          >
            {meta.label}
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 28,
              color: "var(--white)",
              lineHeight: 1.3,
              maxWidth: 440,
            }}
          >
            {material.title}
          </div>
        </div>

        <div style={{ padding: 36 }}>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink)", margin: "0 0 28px" }}>
            {material.description}
          </p>

          <a
            href={material.link}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block",
              textAlign: "center",
              padding: 16,
              borderRadius: 999,
              background: "var(--brand-blue)",
              color: "var(--white)",
              fontWeight: 700,
              fontSize: 16,
              marginBottom: material.fileUrl ? 12 : 28,
            }}
          >
            פתיחת החומר המלא
          </a>

          {material.fileUrl && (
            <a
              href={material.fileUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block",
                textAlign: "center",
                padding: 14,
                borderRadius: 999,
                background: "transparent",
                border: "1px solid var(--line)",
                color: "var(--brand-blue)",
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 28,
              }}
            >
              הורדת הקובץ המצורף
            </a>
          )}

          <ShareBlock
            material={{
              ...material,
              createdAt: material.createdAt.toISOString(),
            }}
            shareUrl={shareUrl}
            displayUrl={displayUrl}
            ogImageUrl={ogImageUrl}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              paddingTop: 20,
              borderTop: "1px solid var(--line)",
            }}
          >
            <img
              src="/hotam-logo-hebrew.png"
              alt="חותם"
              style={{ height: 16, width: "auto", opacity: 0.7 }}
            />
            <span style={{ fontSize: 12, color: "#8390B2" }}>אחריות לחינוך בישראל</span>
          </div>
        </div>
      </div>
    </div>
  );
}
