/**
 * インピーダンス整合のチェック
 */
export function checkImpedanceMatching(
  distance: number,
  budgetInjected: number,
  localCapacity: number
) {
  // インダクタンス L は距離の二乗に比例
  const L = Math.pow(distance, 2);
  
  // 容量を超えた分は「弾性力」として跳ね返される（逆起電力）
  const overshoot = Math.max(0, budgetInjected - localCapacity);
  const backEMF = L * overshoot;

  return {
    matched: backEMF < localCapacity * 0.1, // 許容誤差10%
    backEMF,
    // 推奨注入量 (点滴灌漑)
    recommendedInjection: localCapacity, 
  };
}
