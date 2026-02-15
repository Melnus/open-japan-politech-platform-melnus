import { prisma } from "@ojpp/db";
import { WealthVector, analyzeFlowContinuity } from "@ojpp/sbcm-engine";
import { NextResponse } from "next/server";

export async function GET() {
  const stats = await prisma.fundReport.aggregate({
    _sum: { totalIncome: true, totalExpenditure: true }
  });

  const income = Number(stats._sum.totalIncome || 0);
  const expenditure = Number(stats._sum.totalExpenditure || 0);

  const vector = new WealthVector(income, 500000000);
  
  const diagnostic = analyzeFlowContinuity({
    inflow: income,
    outflow: expenditure,
    production: 1000000000,
    maintenance: 800000000,
    population: 72176
  });

  return NextResponse.json({
    engine_version: "v4.0-Relativistic",
    status: "OPERATIONAL",
    analysis: {
      magnitude: vector.magnitude,
      fragility: vector.isFragile ? "CRITICAL" : "STABLE",
      phase_angle: vector.phaseAngle,
      is_straw_effect: diagnostic.isStrawEffect,
      distortion_index: diagnostic.distortion
    },
    message: diagnostic.isStrawEffect 
      ? "ALERT: High Positive Divergence Detected. System approaching Heat Death." 
      : "System grounded. Flux impedance matched."
  });
}
