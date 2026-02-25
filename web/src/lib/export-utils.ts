// ---------------------------------------------------------------------------
// PDF / CSV Export Utilities
// ---------------------------------------------------------------------------

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// ── PDF Export ────────────────────────────────────────────────────────────────

/**
 * Capture a DOM element as a PDF and trigger a download.
 *
 * @param element   The HTML element to capture.
 * @param filename  Download file name (without extension).
 * @param options   Optional overrides.
 */
export async function exportElementAsPdf(
  element: HTMLElement,
  filename = "export",
  options?: { orientation?: "portrait" | "landscape"; scale?: number },
): Promise<void> {
  const orientation = options?.orientation ?? "portrait";
  const scale = options?.scale ?? 2;

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // First page
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Additional pages if content overflows
  while (heightLeft > 0) {
    position = -(imgHeight - heightLeft);
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${filename}.pdf`);
}

/**
 * Generate a simple PDF from tabular data.
 *
 * @param title    Report title printed at the top.
 * @param headers  Column headers.
 * @param rows     2-D array of cell values.
 * @param filename Download file name.
 */
export function exportTableAsPdf(
  title: string,
  headers: string[],
  rows: string[][],
  filename = "report",
): void {
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const marginLeft = 14;
  let y = 20;

  // Title
  pdf.setFontSize(16);
  pdf.text(title, marginLeft, y);
  y += 10;

  // Date
  pdf.setFontSize(10);
  pdf.text(`Olusturulma Tarihi: ${new Date().toLocaleDateString("tr-TR")}`, marginLeft, y);
  y += 10;

  // Column widths
  const colWidth = (pdf.internal.pageSize.getWidth() - 2 * marginLeft) / headers.length;

  // Header row
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  headers.forEach((h, i) => {
    pdf.text(h, marginLeft + i * colWidth, y);
  });
  y += 2;
  pdf.setLineWidth(0.3);
  pdf.line(marginLeft, y, pdf.internal.pageSize.getWidth() - marginLeft, y);
  y += 6;

  // Data rows
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  for (const row of rows) {
    if (y > pdf.internal.pageSize.getHeight() - 20) {
      pdf.addPage();
      y = 20;
    }
    row.forEach((cell, i) => {
      pdf.text(String(cell), marginLeft + i * colWidth, y);
    });
    y += 6;
  }

  pdf.save(`${filename}.pdf`);
}

// ── CSV Export ────────────────────────────────────────────────────────────────

/**
 * Convert tabular data to a CSV string.
 */
export function toCsv(headers: string[], rows: string[][]): string {
  const escape = (val: string) => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const lines = [headers.map(escape).join(",")];
  for (const row of rows) {
    lines.push(row.map(escape).join(","));
  }
  return lines.join("\n");
}

/**
 * Trigger a CSV file download.
 */
export function exportCsv(
  headers: string[],
  rows: string[][],
  filename = "export",
): void {
  const csv = toCsv(headers, rows);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ── JSON Export ───────────────────────────────────────────────────────────────

/**
 * Trigger a JSON file download.
 */
export function exportJson(data: unknown, filename = "export"): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.json`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
