import { REAL_GOVERNANCE_DATA } from "@/lib/real-blocks";
import { B_STD, WealthVector, analyzeFlowContinuity } from "@ojpp/sbcm-engine";

export default function MesoScanner() {
  // 47都道府県のデータを取得
  const blocks = REAL_GOVERNANCE_DATA;

  return (
    <div className="min-h-screen bg-[#04040a] p-4 sm:p-8 text-[#f0f0f5] font-sans">
      <div className="mx-auto max-w-6xl">
        {/* ナビゲーション */}
        <div className="flex justify-between items-center mb-8">
          <a href="/" className="mono text-[0.6rem] tracking-[3px] text-emerald-500/60 hover:text-emerald-500 transition-colors">
            {"← BACK TO COMMAND CENTER"}
          </a>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span className="mono text-[0.5rem] font-bold text-emerald-400 uppercase">Telemetry: Live (FY2023)</span>
          </div>
        </div>
        
        {/* ヘッダー */}
        <div className="mb-12 border-l-4 border-emerald-500 pl-6">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter italic uppercase">
            Meso <span className="text-emerald-500">Scanner</span>
          </h1>
          <p className="mono text-[0.7rem] tracking-[4px] text-emerald-500/40 mt-2">
            NATIONWIDE CIRCUIT DEBUGGER // 47 PREFECTURES DETECTED
          </p>
        </div>

        {/* スキャンリスト */}
        <div className="grid grid-cols-1 gap-px bg-white/5 border border-white/10 shadow-2xl">
          {blocks.map((block) => {
            // --- SBCM 物理演算実行 ---
            const mw = Number(block.productionSigma);
            const mc = mw * 0.41; // 虚数質量係数（論文の日本平均モデルより算出）
            
            const vector = new WealthVector(mw, mc);
            const diagnostic = analyzeFlowContinuity({
              inflow: mw + Number(block.inflowFlux),
              outflow: Number(block.maintenanceDelta),
              production: mw,
              maintenance: Number(block.maintenanceDelta),
              population: block.population
            });

            const theta = (vector.phaseAngle * (180 / Math.PI)).toFixed(1);
            const D = diagnostic.distortion.toFixed(2);
            const isCritical = Number(D) > 1.2 || diagnostic.isStrawEffect;

            return (
              <div key={block.code} className="bg-[#0a0a0f] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-emerald-500/[0.03] transition-all border-b border-white/5 last:border-b-0">
                {/* 自治体識別子 */}
                <div className="min-w-[180px]">
                  <p className="mono text-[0.5rem] text-emerald-500/40 mb-1">JP_BLOCK_{block.code}</p>
                  <h3 className="text-xl font-bold tracking-tight text-white">{block.name}</h3>
                  <p className="text-[0.6rem] text-white/20 mt-1 mono">POP: {block.population.toLocaleString()}</p>
                </div>

                {/* 物理パラメータ */}
                <div className="grid grid-cols-2 flex-1 gap-4 sm:gap-12">
                  <div className="border-l border-white/5 pl-4">
                    <p className="mono text-[0.5rem] text-amber-500/60 uppercase">Phase Angle (θ)</p>
                    <p className="kpi-value text-2xl font-bold text-white">{theta}°</p>
                  </div>
                  <div className="border-l border-white/5 pl-4">
                    <p className="mono text-[0.5rem] text-blue-500/60 uppercase">Distortion (D)</p>
                    <p className="kpi-value text-2xl font-bold text-white">{D}</p>
                  </div>
                </div>

                {/* 回路ステータス */}
                <div className="md:w-48">
                  <p className="mono text-[0.5rem] text-white/20 mb-2 uppercase">Circuit Entropy</p>
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, (1/diagnostic.distortion)*100)}%` }}
                    />
                  </div>
                </div>

                {/* 最終判決 */}
                <div className="md:text-right min-w-[120px]">
                   <p className="mono text-[0.5rem] text-white/20 uppercase">Audit Result</p>
                   <p className={`text-xs font-bold tracking-tighter ${isCritical ? 'text-red-500' : 'text-emerald-400'}`}>
                     {isCritical ? '🚨 HEAT DEATH RISK' : '✅ STABLE'}
                   </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* フッターデバッグ情報 */}
        <div className="mt-12 py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="mono text-[0.6rem] text-[var(--text-ghost)]">
            SBCM_ENGINE_STATE: 47_BLOCKS_SYNCED // TOTAL_MW_GROUNDED
          </p>
          <div className="flex gap-4">
            <span className="mono text-[0.6rem] text-amber-500/40">Mw: REAL_TAX_REVENUE</span>
            <span className="mono text-[0.6rem] text-blue-500/40">δ: MANDATORY_EXPENSE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
