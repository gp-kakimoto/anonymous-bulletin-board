"use client";

import React, { useEffect, useState } from "react";
import MainThreads from "@/app/components/MainThreads";
import ThreadAndCommentTree from "@/app/components/ThreadAndCommentTree";
import { SupabaseThread, Thread } from "@/lib/threads/types";
import { mockThreadsData } from "@/app/components/test/testData"; // Mock data for testing
import { getThreadsFromSupabase } from "./utils/supabaseFunctions";

const AnonymousBulletinBoard = () => {
  const [height, setHeight] = useState(0);
  const [mainThreadsIsActive, setMainThreadsIsActive] = useState(true);
  const [threadAndCommentTreeIsActive, setThreadAndCommentTreeIsActive] =
    useState(false);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [threadsData, setThreadsData] = useState<SupabaseThread[] | null>(null);
  const [threadsIndex, setThreadsIndex] = useState<number>(0);
  useEffect(() => {
    const updateHeight = () => {
      setHeight(window.innerHeight);
    };

    // 初期ロード時に高さを設定
    updateHeight();

    // リサイズ時に高さを更新
    window.addEventListener("resize", updateHeight);

    // コンポーネントがアンマウントされる際にイベントリスナーを削除
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    const fetchThreads = async () => {
      const data = await getThreadsFromSupabase(threadsIndex);
      if (data === null) {
        console.log("fetchThreads Error");
        return;
      }
      setThreadsData(data);
    };
    fetchThreads();
  }, [threadsIndex]);

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
            threads={threadsData ? threadsData : mockThreadsData}
            height={height}
            setMainThreadsIsActive={setMainThreadsIsActive}
            setThreadAndCommentTreeIsActive={setThreadAndCommentTreeIsActive}
            setSelectedThread={setSelectedThread}
            setThreadsIndex={setThreadsIndex}
            setThreadsData={setThreadsData}
            threadsIndex={threadsIndex}
          />
        )}

        {threadAndCommentTreeIsActive && (
          <ThreadAndCommentTree
            thread={selectedThread} // Assuming we want to show the first thread
            height={height}
            setMainThreadsIsActive={setMainThreadsIsActive}
            setThreadAndCommentTreeIsActive={setThreadAndCommentTreeIsActive}
          />
        )}
      </div>
    </main>
  );
};

export default AnonymousBulletinBoard;
