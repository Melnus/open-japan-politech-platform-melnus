import { B_STD, ALPHA_AUTONOMY } from "@ojpp/sbcm-engine";

async function getAudit() {
  // 自分の内部APIを叩く
  const res = await fetch("http://localhost:3008/api/physics-check", { cache: "no-store" }).catch(() => null);
  return res ? res.json() : null;
}

export default async function MoneyGlassRoom() {
  const audit = await getAudit();

  return (
    <div className="min-h-screen bg-[#04040a] p-8 text-white">
      <a href="/" className="text-xs text-amber-500 font-mono">← BACK TO COMMAND CENTER</a>
      
      <div className="mt-8 mb-12">
        <h1 className="text-5xl font-extrabold tracking-tighter">MONEY <span className="text-amber-500">GLASS</span></h1>
        <p className="text-[#8b949e] mt-2 font-mono text-sm">SBCM v4.0 PHYSICAL AUDIT MODE ACTIVE</p>
      </div>

      {audit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-amber-500/30 bg-amber-500/5 p-8 rounded-lg">
            <p className="text-[0.6rem] tracking-[4px] text-amber-500 font-bold">SYSTEM PHASE ANGLE</p>
            <p className="text-6xl font-bold mt-4">{(audit.analysis.phase_angle * (180 / Math.PI)).toFixed(1)}°</p>
            <p className="mt-4 text-sm text-amber-400">{audit.analysis.fragility === "CRITICAL" ? "⚠️ CRITICAL FRAGILITY DETECTED" : "✅ SYSTEM GROUNDED"}</p>
          </div>

          <div className="border border-blue-500/30 bg-blue-500/5 p-8 rounded-lg">
            <p className="text-[0.6rem] tracking-[4px] text-blue-500 font-bold">DISTORTION INDEX</p>
            <p className="text-6xl font-bold mt-4">{audit.analysis.distortion_index.toFixed(2)}</p>
            <p className="mt-4 text-sm text-blue-400">THERMODYNAMIC LEAKAGE: {audit.analysis.is_straw_effect ? "HIGH" : "LOW"}</p>
          </div>
        </div>
      )}

      <div className="mt-12 p-6 border border-white/5 bg-white/5 rounded font-mono text-[0.7rem] text-[#6e7681]">
        <p className="text-emerald-500 mb-2">PROTOCOL: G-CART LOADED</p>
        <p>B_std: {B_STD}</p>
        <p>Alpha: {ALPHA_AUTONOMY}</p>
        <p className="mt-4 animate-pulse">SCANNING REAL-TIME DATA...</p>
      </div>
    </div>
  );
}
