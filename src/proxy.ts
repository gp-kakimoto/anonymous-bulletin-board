// middleware.ts --> proxy.ts にリネーム
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr"; // @supabase/auth-helpers-nextjs ではなく @supabase/ssr を使用
export async function proxy(request: NextRequest) {
   console.log("Middleware executed for path:", request.nextUrl.pathname); // ログ出力を追加
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Cookieがセットされた場合、必ずresponseオブジェクトにも反映させます
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // Cookieが削除された場合、必ずresponseオブジェクトにも反映させます
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );
  // セッション情報を取得
  
  const {
    data: { user }, // session ではなく user を使用
  } = await supabase.auth.getUser(); // getSession ではなく getUser を使用
  // userが管理者であるかどうかをチェックするロジックを追加
  const isAdmin = user && user.id === process.env.ADMIN_USER_ID;
  console.log("isAdmin:", isAdmin); // ログ出力を追加

  // 管理者ページへのアクセスをチェック
  if (request.nextUrl.pathname.startsWith("/admin/")) {
    //ログアウトページへのアクセスは許可
    if (request.nextUrl.pathname === "/admin/logout") {
      return response; // ログアウトページはそのまま表示
    }
    // ログインページへのアクセスは許可
    if (request.nextUrl.pathname === "/admin/login"
      || request.nextUrl.pathname === "/admin/logout"
    ) {
      // 既に認証済みであれば、管理者スレッド一覧へリダイレクト
      // isAdmin をチェックして認証済みかどうかを判断する
      if (isAdmin && request.nextUrl.pathname === "/admin/login") {
        // session ではなく user をチェック
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/admin/1";
        return NextResponse.redirect(redirectUrl, { headers: response.headers });
      }
      return response; // ログインページ ログアウトページはそのまま表示
    }
    // ログインページ以外の管理者ページで未認証の場合、ログインページへリダイレクト
    // isAdmin をチェックして認証済みかどうかを判断する
    if (!isAdmin) {
      // session ではなく user をチェック
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      return NextResponse.redirect(redirectUrl);
    }
    // TODO: 必要であれば、ここでさらに、user.id などを使って、そのユーザーが「管理者」// ロールを持っているか確認するロジックを追加することも可能。
    // そのためには、Supabase のユーザーメタデータや、カスタムテーブルでロールを管理する必要がある。 [cite: 226]
  }else if (request.nextUrl.pathname === "/admin") {
    if( isAdmin) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/1";
      return NextResponse.redirect(redirectUrl);
    }else if (!isAdmin) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      return NextResponse.redirect(redirectUrl);
    }
  }
  return response;
}
  

// ミドルウェアを適用するパスを定義 [cite: 227]
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include specific paths
     * you want to protect or exclude.
     */
    //"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    '/admin/:path*',
    // またはシンプルに '/admin/:path*'
  ],
};
