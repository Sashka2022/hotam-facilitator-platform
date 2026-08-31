import { Category } from "@/lib/categories";

export default function MaterialIcon({
  category,
  color = "#0048FF",
  size = 28,
}: {
  category: Category | string;
  color?: string;
  size?: number;
}) {
  const common = {
    viewBox: "0 0 24 24",
    width: "100%",
    height: "100%",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  let icon: React.ReactNode = null;
  if (category === "presentation") {
    icon = (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8" />
        <path d="M12 16v4" />
        <path d="M7 12l3-3 2 2 4-4" />
      </svg>
    );
  } else if (category === "video") {
    icon = (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M10 8.5l6 3.5-6 3.5z" />
      </svg>
    );
  } else if (category === "worksheet") {
    icon = (
      <svg {...common}>
        <rect x="6" y="4" width="12" height="16" rx="2" />
        <path d="M9 4h6v2H9z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  } else {
    icon = (
      <svg {...common}>
        <path d="M6 3h9l3 3v15H6z" />
        <path d="M15 3v4h4" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </svg>
    );
  }

  return (
    <div style={{ width: size, height: size, color, display: "block" }}>
      {icon}
    </div>
  );
}
