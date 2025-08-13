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
    <main
      style={{
        height: "100vh",
      }}
      className="flex  flex-col items-center justify-between  p-24 mx-auto "
    >
      <h1
        style={{
          height: `calc(100vh * (1 / 5))`,
        }}
        className="text-4xl font-bold mb-20 mx-auto mt-0  w-5/5 z-100"
      >
        Anonymous Bulletin Board
      </h1>
      <div className="w-full flex justify-center mb-8 mx-auto">
        <MainThreads
          threads={threadsData}
          setThreadsData={setThreadsData}
          threadsIndex={threadsIndex}
        />
      </div>
    </main>
  );
};

export default Page;
