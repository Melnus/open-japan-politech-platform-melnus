import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const diag: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    env: {
      DATABASE_URL: process.env.DATABASE_URL
        ? `${process.env.DATABASE_URL.substring(0, 30)}...`
        : "NOT SET",
      DIRECT_URL: process.env.DIRECT_URL
        ? `${process.env.DIRECT_URL.substring(0, 30)}...`
        : "NOT SET",
      NODE_ENV: process.env.NODE_ENV,
    },
  };

  // Check if Prisma engine binary exists
  try {
    const fs = await import("fs");
    const path = await import("path");

    // Check standard and custom Prisma client locations
    const locations = [
      "node_modules/.prisma/client",
      "node_modules/@prisma/client",
      "../../packages/db/prisma/generated",
      "../../../packages/db/prisma/generated",
    ];
    const engineFiles: Record<string, string[]> = {};
    for (const loc of locations) {
      try {
        const resolved = path.resolve(loc);
        const files = fs.readdirSync(resolved).filter(
          (f: string) => f.includes("engine") || f.includes("libquery") || f.endsWith(".so.node")
        );
        engineFiles[resolved] = files;
      } catch {
        engineFiles[loc] = ["NOT FOUND"];
      }
    }
    diag.engineFiles = engineFiles;
  } catch (e) {
    diag.engineCheck = e instanceof Error ? e.message : String(e);
  }

  // Try to connect to DB
  try {
    const { prisma } = await import("@ojpp/db");
    const count = await prisma.party.count();
    diag.db = { connected: true, partyCount: count };
  } catch (error) {
    diag.db = {
      connected: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error
        ? error.stack?.split("\n").slice(0, 8)
        : undefined,
    };
  }

  return NextResponse.json(diag, { status: diag.db && (diag.db as Record<string, unknown>).connected ? 200 : 500 });
}
