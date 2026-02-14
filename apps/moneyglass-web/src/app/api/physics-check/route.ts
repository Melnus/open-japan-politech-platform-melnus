import { analyzeFlowContinuity, WealthVector } from "@ojpp/sbcm-engine";
import { prisma } from "@ojpp/db";
import { NextResponse } from "next/server";

export async function GET() {
  // 1. データベースから最新の統計を取得（MoneyGlassの既存データ）
  const stats = await prisma.fundReport.aggregate({
    _sum: { totalIncome: true, totalExpenditure: true }
  });

  const income = Number(stats._sum.totalIncome || 0);
  const expenditure = Number(stats._sum.totalExpenditure || 0);

  // 2. あなたのSBCMエンジンで物理解析を実行
  
  // 複素質量の計算 (Mw + iMc)
  const vector = new WealthVector(income, 500000000); // 5億を仮の虚数質量(Mc)とする
  
  // 行政水力学による「ストロー現象」の診断
  const diagnostic = analyzeFlowContinuity({
    inflow: income,
    outflow: expenditure,
    production: 1000000000, // 仮の生産量 (sigma)
    maintenance: 800000000, // 仮の維持コスト (delta)
    population: 72176       // 標準ブロック人口 (B_std)
  });

  // 3. 物理法則による「判定」を出力
  return NextResponse.json({
    engine_version: "v4.0-Relativistic",
    status: "OPERATIONAL",
    analysis: {
      magnitude: vector.magnitude, // 経済規模の絶対値
      fragility: vector.isFragile ? "CRITICAL" : "STABLE", // 脆弱性
      phase_angle: vector.phaseAngle, // 位相角 (theta)
      is_straw_effect: diagnostic.isStrawEffect, // ストロー現象が発生しているか
      distortion_index: diagnostic.distortion // 歪み指数
    },
    message: diagnostic.isStrawEffect 
      ? "ALERT: High Positive Divergence Detected. System approaching Heat Death." 
      : "System grounded. Flux impedance matched."
  });
}
