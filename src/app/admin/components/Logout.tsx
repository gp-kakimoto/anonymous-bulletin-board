"use client";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../../../utils/supabase/client";
import { FormEvent } from "react";

//送信
const onSubmitHandler = async (
  e: FormEvent<HTMLFormElement>,
  router: ReturnType<typeof useRouter>
) => {
  e.preventDefault();

  const supabase = createSupabaseBrowserClient(); // クライアントを初期化
  try {
    const { error } = await supabase.auth.signOut();

    if (!!error) {
      console.error("Error signing out:", error.message);
      return;
    }
    router.push("/1");
  } catch (error: unknown) {
    console.error("Error signing out:", error);
    return;
  } finally {
    router.refresh(); // 認証状態の変更を強制的に再フェッチ
  }
};
const Logout = () => {
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        onSubmitHandler(e, router);
      }}
    >
      <button
        type="submit"
        className="w-full rounded-md bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
      >
        ログアウト
      </button>
    </form>
  );
};
export { Logout };
