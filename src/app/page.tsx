"use client";

import React, { useEffect, useState } from "react";
import MainThreads from "@/app/components/MainThreads";
import ThreadAndCommentTree from "@/app/components/ThreadAndCommentTree";
import { Thread } from "@/lib/threads/types";
import { mockThreadsData } from "@/app/components/test/testData"; // Mock data for testing
//import { mock } from "node:test";
/*
const structuredComments = buildCommentTree(mockFetchedComments);
console.log(JSON.stringify(structuredComments, null, 2));
*/
//const threads = transformSupabaseData(mockThreadsData, mockCommentsData);
//console.log(JSON.stringify(threads, null, 2));

const AnonymousBulletinBoard = () => {
  const [height, setHeight] = useState(0);
  const [mainThreadsIsActive, setMainThreadsIsActive] = useState(true);
  const [threadAndCommentTreeIsActive, setThreadAndCommentTreeIsActive] =
    useState(false);

  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

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
            threads={mockThreadsData}
            height={height}
            setMainThreadsIsActive={setMainThreadsIsActive}
            setThreadAndCommentTreeIsActive={setThreadAndCommentTreeIsActive}
            setSelectedThread={setSelectedThread}
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
