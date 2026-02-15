import { describe, expect, it } from "vitest";
import { ApiError, handleApiError } from "../error";

describe("handleApiError", () => {
  it("ApiError をそのまま返す", async () => {
    const response = handleApiError(ApiError.badRequest("invalid"));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "invalid" });
  });

  it("Prisma のバリデーションエラーを 400 に変換する", async () => {
    const response = handleApiError({
      name: "PrismaClientValidationError",
      message: "Invalid field value",
    });
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid request parameters" });
  });

  it("Prisma の known request validation code を 400 に変換する", async () => {
    const response = handleApiError({
      name: "PrismaClientKnownRequestError",
      code: "P2009",
    });
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid request parameters" });
  });
});
