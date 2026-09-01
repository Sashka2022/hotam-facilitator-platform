"use client";

import { useState } from "react";
import { DownloadIcon } from "@/components/icons";

const MAP_STAGE_ID = "hotam-map-stage";
const HIDE_ON_PDF_SELECTOR = "#header-actions";

export default function ExportPdfButton({ isNarrow }: { isNarrow: boolean }) {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    const stage = document.getElementById(MAP_STAGE_ID);
    if (!stage) return;

    setExporting(true);
    const hiddenEls = document.querySelectorAll<HTMLElement>(HIDE_ON_PDF_SELECTOR);

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      // Freeze entrance animations into their settled end-state first, so the
      // capture never lands mid-animation (e.g. satellites still at opacity 0
      // if exporting right after the page loads), and so the hotspot
      // measurements below match what actually gets drawn into the image.
      stage.classList.add("pdf-capturing");
      hiddenEls.forEach((el) => el.classList.add("hide-on-pdf"));

      // Let the freeze (and any pending layout/paint) actually land, and make
      // sure fonts/icons are loaded — otherwise a capture fired immediately
      // after the class toggle can grab a stale or half-rendered frame.
      await document.fonts.ready;
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      // Pin the exact pixel box to capture. Left to its own defaults,
      // html2canvas infers this from the current viewport/scroll position,
      // which crops the image if the page has scrolled or the window has
      // resized since load. offsetWidth/offsetHeight (not
      // getBoundingClientRect) so this matches the stage's own 900x700
      // layout box regardless of any ancestor CSS scale (e.g. the mobile
      // preview transform), which is the same coordinate space the hotspot
      // fractions below are measured in.
      const stageWidth = stage.offsetWidth;
      const stageHeight = stage.offsetHeight;

      const stageRect = stage.getBoundingClientRect();
      const linkEls = stage.querySelectorAll<HTMLElement>("[data-pdf-link]");
      const hotspots = Array.from(linkEls).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          url: el.getAttribute("data-pdf-link") || "",
          xFrac: (r.left - stageRect.left) / stageRect.width,
          yFrac: (r.top - stageRect.top) / stageRect.height,
          wFrac: r.width / stageRect.width,
          hFrac: r.height / stageRect.height,
        };
      });

      const canvas = await html2canvas(stage, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
        width: stageWidth,
        height: stageHeight,
      });
      stage.classList.remove("pdf-capturing");
      hiddenEls.forEach((el) => el.classList.remove("hide-on-pdf"));

      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const margin = 12;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;

      const imgRatio = canvas.width / canvas.height;
      const boxRatio = availableWidth / availableHeight;
      let drawWidth: number, drawHeight: number;
      if (imgRatio > boxRatio) {
        drawWidth = availableWidth;
        drawHeight = drawWidth / imgRatio;
      } else {
        drawHeight = availableHeight;
        drawWidth = drawHeight * imgRatio;
      }
      const offsetX = margin + (availableWidth - drawWidth) / 2;
      const offsetY = margin + (availableHeight - drawHeight) / 2;

      pdf.addImage(canvas.toDataURL("image/png"), "PNG", offsetX, offsetY, drawWidth, drawHeight);

      hotspots.forEach((h) => {
        if (!h.url) return;
        pdf.link(
          offsetX + h.xFrac * drawWidth,
          offsetY + h.yFrac * drawHeight,
          h.wFrac * drawWidth,
          h.hFrac * drawHeight,
          { url: h.url }
        );
      });

      const title = stage.getAttribute("data-plenary-title") || "מפת-חומרים";
      pdf.save(`${title}.pdf`);
    } finally {
      stage.classList.remove("pdf-capturing");
      hiddenEls.forEach((el) => el.classList.remove("hide-on-pdf"));
      setExporting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={exporting}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: isNarrow ? "8px 12px" : "10px 18px",
        border: "1px solid var(--brand-blue)",
        borderRadius: 999,
        background: "transparent",
        color: "var(--brand-blue)",
        fontWeight: 700,
        fontSize: isNarrow ? 12 : 14,
        opacity: exporting ? 0.7 : 1,
        cursor: exporting ? "default" : "pointer",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {exporting ? (
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: "2px solid var(--brand-blue)",
            borderTopColor: "transparent",
            animation: "pdfSpin 700ms linear infinite",
            flexShrink: 0,
          }}
        />
      ) : (
        <DownloadIcon size={isNarrow ? 14 : 16} />
      )}
      {isNarrow ? "PDF" : exporting ? "מייצא..." : "ייצוא ל-PDF"}
    </button>
  );
}
