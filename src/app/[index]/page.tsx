import React from "react";
import MainThreads from "@/app/components/MainThreads";
import { SupabaseThread } from "@/lib/threads/types";
import { getThreadsFromSupabase } from "../utils/supabaseServerFunctions";

type Params = { index: string };
const Page = async ({ params }: { params: Params }) => {
  const { index } = await params;
  const threadsIndex = Number(index || 1); // Default to 1 if not provided
  const threadsData: SupabaseThread[] | null = await getThreadsFromSupabase(
    threadsIndex
  );

  if (threadsData === null) {
    console.log("fetchThreads Error in page.tsx");
    return (
      <main className="flex  flex-col items-centerjustify-center  mx-auto ">
        <h1 className="text-4xl font-bold mt-0 mb-5 w-full z-100 text-center">
          Anonymous Bulletin Board
        </h1>
        <p>スレッドの取得に失敗しました。時間をおいて再度お試しください。</p>
      </main>
    );
  }

  return (
    <main className="flex  flex-col items-centerjustify-center  mx-auto ">
      <h1 className="text-4xl font-bold mt-0 mb-5 w-full z-100 text-center">
        Anonymous Bulletin Board
      </h1>

      <MainThreads threads={threadsData} threadsIndex={threadsIndex} />
    </main>
  );
};

export default Page;
