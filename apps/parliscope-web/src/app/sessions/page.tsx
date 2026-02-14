import { prisma } from "@ojpp/db";
import { SessionTimeline } from "@/components/session-timeline";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const sessions = await prisma.dietSession.findMany({
    orderBy: { number: "desc" },
    include: {
      _count: { select: { bills: true } },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1033]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">国会会期</h2>
          <p className="text-[#8b949e]">第200回〜第213回国会のデータ</p>
        </div>
        <SessionTimeline
          sessions={sessions.map((s) => ({
            ...s,
            startDate: s.startDate.toISOString(),
            endDate: s.endDate?.toISOString() ?? null,
          }))}
        />
      </div>
    </div>
  );
}
