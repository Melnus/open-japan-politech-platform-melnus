import type { NextRequest } from "next/server";
import { ApiError } from "./error";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function parsePagination(
  request: NextRequest,
  defaults: { page?: number; limit?: number } = {},
): PaginationParams {
  const url = new URL(request.url);
  const rawPage = url.searchParams.get("page");
  const rawLimit = url.searchParams.get("limit");

  const page = parsePositiveInteger(rawPage, "page") ?? defaults.page ?? 1;
  const limit = parsePositiveInteger(rawLimit, "limit") ?? defaults.limit ?? 20;

  const normalizedPage = Math.max(1, page);
  const normalizedLimit = Math.min(100, Math.max(1, limit));

  if (!Number.isSafeInteger(normalizedPage) || !Number.isSafeInteger(normalizedLimit)) {
    throw ApiError.badRequest("Invalid pagination parameters");
  }

  const skip = (normalizedPage - 1) * normalizedLimit;
  if (!Number.isSafeInteger(skip)) {
    throw ApiError.badRequest("Pagination parameters are too large");
  }
  return { page: normalizedPage, limit: normalizedLimit, skip };
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams,
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
}

function parsePositiveInteger(raw: string | null, name: string): number | undefined {
  if (raw === null || raw === "") return undefined;
  if (!/^\d+$/.test(raw)) {
    throw ApiError.badRequest(`${name} must be a positive integer`);
  }
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw ApiError.badRequest(`${name} must be a positive integer`);
  }
  return parsed;
}
