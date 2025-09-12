// utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'; // @supabase/supabase-js ではなく@supabase/ssr を使用
import { Database } from '../../types/supabase'; // 生成された型定義をインポート（後述の型生成を参照）
export function createSupabaseBrowserClient() {
return createBrowserClient<Database>(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// {
// // 必要であればカスタム fetch を設定
// fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => {
// return fetch(input, init);
// }
// }
);
}