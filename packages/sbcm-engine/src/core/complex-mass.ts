import { ComplexMass } from "../types";

export class WealthVector {
  constructor(public mw: number, public mc: number) {}

  /** 絶対値（経済規模の大きさ） */
  get magnitude(): number {
    return Math.sqrt(this.mw ** 2 + this.mc ** 2);
  }

  /** 位相角 (theta) - システムの脆弱性指標 */
  get phaseAngle(): number {
    return Math.atan2(this.mc, this.mw);
  }

  /** バブル/虚数過剰アラート (theta > 45度) */
  get isFragile(): boolean {
    return this.phaseAngle > Math.PI / 4;
  }
}
