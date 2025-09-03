"use client";

import React, { useEffect, useState, useCallback } from "react";
import MainThreads from "@/app/components/MainThreads";
import { SupabaseThread } from "@/lib/threads/types";
import { getThreadsFromSupabase } from "../utils/supabaseFunctions";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const [threadsData, setThreadsData] = useState<SupabaseThread[] | null>(null);
  const threadsIndex = Number(params.index) - 1 || 0; // Default to 0 if not provided
  // スレッドデータをインデックスに基づいて再取得する関数
  const refreshThreads = useCallback(async () => {
    console.log("Refreshing threads with index:", threadsIndex);
    const data = await getThreadsFromSupabase(threadsIndex);
    if (data === null) {
      console.log("fetchThreads Error");
      return;
    }
    setThreadsData(data);
  }, [threadsIndex]);

  // 初期表示時とページネーション（index変更）時にスレッドを取得
  useEffect(() => {
    refreshThreads();
  }, [refreshThreads]);

  return (
    <main className="flex  flex-col items-centerjustify-center  mx-auto ">
      <h1 className="text-4xl font-bold mt-0 mb-5 w-full z-100 text-center">
        Anonymous Bulletin Board
      </h1>

      <MainThreads
        threads={threadsData}
        setThreadsData={setThreadsData}
        threadsIndex={threadsIndex}
      />
    </main>
  );
};

export default Page;
