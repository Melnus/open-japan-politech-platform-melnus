import { describe, expect, it } from "vitest";

import { serializeBigInt } from "../serialize";

describe("serializeBigInt", () => {
  it("null を返す", () => {
    expect(serializeBigInt(null)).toBeNull();
  });

  it("undefined を返す", () => {
    expect(serializeBigInt(undefined)).toBeUndefined();
  });

  it("BigInt を string に変換する", () => {
    expect(serializeBigInt(BigInt(123456789))).toBe("123456789");
  });

  it("ネストされたオブジェクト内の BigInt を変換する", () => {
    const input = {
      id: 1,
      amount: BigInt(999999999999),
      nested: {
        value: BigInt(42),
        name: "test",
      },
    };
    const result = serializeBigInt(input);
    expect(result).toEqual({
      id: 1,
      amount: "999999999999",
      nested: {
        value: "42",
        name: "test",
      },
    });
  });

  it("配列内の BigInt を変換する", () => {
    const input = [BigInt(1), BigInt(2), BigInt(3)];
    expect(serializeBigInt(input)).toEqual(["1", "2", "3"]);
  });

  it("通常の string はそのまま返す", () => {
    expect(serializeBigInt("hello")).toBe("hello");
  });

  it("通常の number はそのまま返す", () => {
    expect(serializeBigInt(42)).toBe(42);
  });

  it("Date を壊さず保持する", () => {
    const date = new Date("2026-01-01T00:00:00.000Z");
    const result = serializeBigInt({ date, amount: BigInt(1) });

    expect(result).toEqual({
      date,
      amount: "1",
    });
    expect(result.date).toBeInstanceOf(Date);
  });
});
