"use client";

import React, { useEffect, useState, useCallback } from "react";
import MainThreads from "@/app/components/MainThreads";
import ThreadAndCommentTree from "@/app/components/ThreadAndCommentTree";
import { SupabaseThread, Thread } from "@/lib/threads/types";
import { getThreadsFromSupabase } from "./utils/supabaseFunctions";

const AnonymousBulletinBoard = () => {
  const [height, setHeight] = useState(0);
  const [mainThreadsIsActive, setMainThreadsIsActive] = useState(true);
  const [threadAndCommentTreeIsActive, setThreadAndCommentTreeIsActive] =
    useState(false);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [threadsData, setThreadsData] = useState<SupabaseThread[] | null>(null);
  const [threadsIndex, setThreadsIndex] = useState<number>(0);
  const [latestActivityAt, setLatestActivityAt] = useState<string>("");

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

  // ★★★ 一覧に戻る際に呼ばれる最終版の関数 ★★★
  const handleReturnAndRefresh = async () => {
    // 1. インデックスを0にリセット
    if (
      latestActivityAt !== "" &&
      selectedThread !== null &&
      latestActivityAt > selectedThread?.latest_activity_at
    ) {
      setThreadsIndex(0);
    }

    refreshThreads();
  };

  useEffect(() => {
    const updateHeight = () => {
      setHeight(window.innerHeight);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  // 初期表示時とページネーション（index変更）時にスレッドを取得
  useEffect(() => {
    refreshThreads();
  }, [refreshThreads]);

  return (
    <main
      style={{
        height: `${height}px`,
      }}
      className="flex  flex-col items-center justify-between  p-24 mx-auto "
    >
      <h1
        style={{
          height: `${(height * 1) / 5}px`,
        }}
        className="text-4xl font-bold mb-20 mx-auto mt-0  w-5/5 z-100"
      >
        Anonymous Bulletin Board
      </h1>
      <div className="w-full flex justify-center mb-8 mx-auto">
        {mainThreadsIsActive && (
          <MainThreads
            threads={threadsData}
            height={height}
            setMainThreadsIsActive={setMainThreadsIsActive}
            setThreadAndCommentTreeIsActive={setThreadAndCommentTreeIsActive}
            setSelectedThread={setSelectedThread}
            setThreadsIndex={setThreadsIndex}
            setThreadsData={setThreadsData}
            threadsIndex={threadsIndex}
            setLatestActivityAt={setLatestActivityAt}
          />
        )}

        {threadAndCommentTreeIsActive && (
          <ThreadAndCommentTree
            thread={selectedThread}
            height={height}
            setMainThreadsIsActive={setMainThreadsIsActive}
            setThreadAndCommentTreeIsActive={setThreadAndCommentTreeIsActive}
            setSelectedThread={setSelectedThread}
            onReturn={handleReturnAndRefresh}
            setLatestActivityAt={setLatestActivityAt}
          />
        )}
      </div>
    </main>
  );
};

export default AnonymousBulletinBoard;
