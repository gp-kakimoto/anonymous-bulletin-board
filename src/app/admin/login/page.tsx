// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "../../../../utils/supabase/client";
import { useRouter } from "next/navigation";

const AdminLoginPage = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createSupabaseBrowserClient(); // クライアントを初期化

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      // ログイン成功語、管理画面のスレッド一覧へ繊維
      router.push("/admin/1");

      router.refresh(); // 認証状態の変更を強制的に再フェッチ
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          匿名掲示板管理画面
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="loginId"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Login id
            </label>
            <input
              type="text"
              id="loginId"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-black"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-black"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
