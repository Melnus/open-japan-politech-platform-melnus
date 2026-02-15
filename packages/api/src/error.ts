import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  static badRequest(message = "Bad request") {
    return new ApiError(400, message);
  }

  static notFound(message = "Not found") {
    return new ApiError(404, message);
  }

  static internal(message = "Internal server error") {
    return new ApiError(500, message);
  }
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }

  if (isPrismaValidationError(error)) {
    return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
  }

  console.error("Unhandled API error:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

function isPrismaValidationError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const maybeError = error as { name?: unknown; code?: unknown };
  const name = typeof maybeError.name === "string" ? maybeError.name : "";
  const code = typeof maybeError.code === "string" ? maybeError.code : "";

  if (name === "PrismaClientValidationError") {
    return true;
  }

  if (name === "PrismaClientKnownRequestError") {
    return code === "P2009" || code === "P2019" || code === "P2023";
  }

  return false;
}
