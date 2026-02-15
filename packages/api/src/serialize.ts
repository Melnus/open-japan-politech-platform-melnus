/**
 * Recursively convert BigInt values to strings in an object for JSON serialization.
 */
export function serializeBigInt<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return String(obj) as unknown as T;
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map(serializeBigInt) as unknown as T;
  if (typeof obj === "object" && isPlainObject(obj)) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = serializeBigInt(value);
    }
    return result as T;
  }
  return obj;
}

function isPlainObject(value: object): boolean {
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
