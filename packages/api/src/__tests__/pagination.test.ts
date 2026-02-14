import type { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { ApiError } from "../error";
import { buildPaginatedResponse, parsePagination } from "../pagination";

describe("buildPaginatedResponse", () => {
  it("正しいページネーション構造を返す", () => {
    const data = [{ id: 1 }, { id: 2 }];
    const params = { page: 1, limit: 10, skip: 0 };
    const result = buildPaginatedResponse(data, 50, params);

    expect(result).toEqual({
      data: [{ id: 1 }, { id: 2 }],
      pagination: {
        page: 1,
        limit: 10,
        total: 50,
        totalPages: 5,
      },
    });
  });

  it("totalPages の計算が正しい（切り上げ）", () => {
    const data = [{ id: 1 }];
    const params = { page: 1, limit: 10, skip: 0 };
    const result = buildPaginatedResponse(data, 15, params);

    expect(result.pagination.totalPages).toBe(2);
  });

  it("空データの場合", () => {
    const params = { page: 1, limit: 20, skip: 0 };
    const result = buildPaginatedResponse([], 0, params);

    expect(result.data).toEqual([]);
    expect(result.pagination.total).toBe(0);
    expect(result.pagination.totalPages).toBe(0);
  });
});

describe("parsePagination", () => {
  it("デフォルト値を返す", () => {
    const request = { url: "https://example.com/api/items" } as NextRequest;
    const result = parsePagination(request);
    expect(result).toEqual({ page: 1, limit: 20, skip: 0 });
  });

  it("有効なページング値を返す", () => {
    const request = {
      url: "https://example.com/api/items?page=2&limit=10",
    } as NextRequest;
    const result = parsePagination(request);
    expect(result).toEqual({ page: 2, limit: 10, skip: 10 });
  });

  it("小数は 400 エラー", () => {
    const request = {
      url: "https://example.com/api/items?page=1.5&limit=10",
    } as NextRequest;
    expect(() => parsePagination(request)).toThrowError(ApiError);
  });

  it("文字列は 400 エラー", () => {
    const request = {
      url: "https://example.com/api/items?page=abc&limit=10",
    } as NextRequest;
    expect(() => parsePagination(request)).toThrowError(ApiError);
  });
});
