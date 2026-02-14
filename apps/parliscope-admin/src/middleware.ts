import { safeEqual } from "@ojpp/api";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Admin アプリの Basic 認証ミドルウェア
 *
 * 環境変数:
 *   ADMIN_USERNAME — 管理者ユーザー名（デフォルト: admin）
 *   ADMIN_PASSWORD — 管理者パスワード（必須。未設定時はアクセス拒否）
 */
export function middleware(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;

  // ADMIN_PASSWORD が未設定 → 本番では全アクセス拒否（安全側に倒す）
  if (!password) {
    if (process.env.NODE_ENV === "development") {
      return NextResponse.next();
    }
    return new NextResponse("Admin access is not configured", { status: 503 });
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      try {
        const decoded = atob(encoded);
        const separator = decoded.indexOf(":");
        if (separator !== -1) {
          const user = decoded.slice(0, separator);
          const pass = decoded.slice(separator + 1);
          const expectedUser = process.env.ADMIN_USERNAME ?? "admin";

          if (safeEqual(user, expectedUser) && safeEqual(pass, password)) {
            return NextResponse.next();
          }
        }
      } catch {
        // 不正な Authorization ヘッダは認証失敗として扱う
      }
    }
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="OJPP Admin", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
