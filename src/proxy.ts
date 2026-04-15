import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  // /owner 以下の認証チェック
  if (!request.nextUrl.pathname.startsWith('/owner')) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase未設定時はスキップ（開発中）
  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url_here') {
    return NextResponse.next();
  }

  // 認証チェックは Supabase 設定後に有効化
  return NextResponse.next();
}

export const config = {
  matcher: ['/owner/:path*'],
};
