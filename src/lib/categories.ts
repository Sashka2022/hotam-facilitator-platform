export type Category = "presentation" | "video" | "article" | "worksheet";

export const CATEGORY_META: Record<Category, { label: string; accent: string }> = {
  presentation: { label: "מצגת", accent: "#41CAC5" },
  video: { label: "סרטון", accent: "#0DB4F4" },
  article: { label: "מאמר", accent: "#6536EA" },
  worksheet: { label: "פעילות", accent: "#2680F1" },
};

export const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "presentation", label: "מצגת" },
  { value: "video", label: "סרטון" },
  { value: "article", label: "מאמר" },
  { value: "worksheet", label: "פעילות / דף עבודה" },
];

export function categoryMeta(category: string) {
  return CATEGORY_META[category as Category] ?? CATEGORY_META.article;
}

export function genSlug(): string {
  return Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 4);
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
