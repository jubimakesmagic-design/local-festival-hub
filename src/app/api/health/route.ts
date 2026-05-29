import { db, databaseUrl } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();

  try {
    await db.$queryRaw`SELECT 1`;

    return Response.json({
      ok: true,
      database: "connected",
      databaseUrl: databaseUrl.startsWith("file:") ? "sqlite:file" : "configured",
      latencyMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[HealthCheck] Database connection failed:", error);

    return Response.json(
      {
        ok: false,
        database: "unreachable",
        latencyMs: Date.now() - startedAt,
        checkedAt: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
