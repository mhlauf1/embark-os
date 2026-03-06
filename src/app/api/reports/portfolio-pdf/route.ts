import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { prisma } from "@/lib/db";
import { PortfolioReport } from "@/lib/pdf/generatePortfolioReport";

export async function GET() {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });

  const generatedAt = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await (renderToBuffer as any)(
    React.createElement(PortfolioReport, { locations, generatedAt })
  );

  const uint8 = new Uint8Array(buffer);
  return new Response(uint8.buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="embark-portfolio-report-${new Date().toISOString().slice(0, 10)}.pdf"`,
    },
  });
}
