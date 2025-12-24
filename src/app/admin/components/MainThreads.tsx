//　/admin/components/MainThreads.tsx
"use client";
import React from "react";
import { useState } from "react";
import { THREADS_PER_PAGE, THREAD_CONTENT_LENGTH } from "@/lib/threads/types";
import { SupabaseThread } from "@/lib/threads/types";
import NavigateRectangleSticky from "../../components/NavigateRectangleSticky";
import { getThreadCount } from "../../utils/supabaseFunctions";
import { useRouter } from "next/navigation";
import PageButton from "../../components/PageButton";
import { updateThreadVisibility } from "@/app/actions";

type Props = {
  threads: SupabaseThread[];
  threadsIndex: number;
};

const MainThreads = (props: Props) => {
  const { threads, threadsIndex } = props;
  const [isSmall, setIsSmall] = useState(false);
  const [isActiveId, setIsActiveId] = useState<number | null>(null);
  const router = useRouter();
  const handleClick = async (
    event: React.MouseEvent<HTMLDivElement>,
    thread: SupabaseThread,
    id: number
  ) => {
    setIsSmall(!isSmall);
    setIsActiveId(id);
    event.stopPropagation(); // イベントのバブリングを防止
    const threadId = event.currentTarget.dataset.id;
    console.log("Thread clicked:", threadId);
    router.push(`/admin/thread/${threadId}`);
  };

  const handleClickLeft = () => {
    if (threadsIndex > 1) {
      const index = threadsIndex - 1;
      router.push(`/admin/${index}`);
    }
  };

  const handleClickRight = async () => {
    const threadCount = await getThreadCount();
    console.log(`threadCount in handClickRight=${threadCount}`);
    if (
      THREADS_PER_PAGE * threadsIndex + 1 <=
      (threadCount !== null ? threadCount : threadsIndex * THREADS_PER_PAGE)
    ) {
      const index = threadsIndex + 1;
      router.push(`/admin/${index}`);
    }
  };

  const handleClickIshidden = async (threadId: number, isHidden: boolean) => {
    console.log("Hidden button clicked");
    try {
      if (await updateThreadVisibility(threadId, isHidden)) {
        console.log("Thread visibility updated successfully");
        //router.push("/admin/1");
        router.refresh();
      } else {
        console.error("Failed to update thread visibility");
      }
    } catch (error) {
      console.error("Error updating thread visibility:", error);
    }
    console.log(`Thread ID: ${threadId}, New is_hidden: ${isHidden}`);
  };
  return (
    <div className="flex justify-center w-full m-0 p-0">
      <div className="sticky top-0 flex flex-col  mr-1 ml-1">
        <NavigateRectangleSticky
          navigateTitle="Logout Admin"
          justifyStyle="justify-end"
          itemsStyle="items-center"
          bgcolor="bg-purple-400"
          width="w-full"
          onClick={() => {
            router.push(`/admin/logout`);
          }}
        />
      </div>

      <div className="w-6/10 flex flex-col items-center mx-0 px-0">
        {
          <div className="w-full  flex flex-col items-center  mt-0 mx-0 pt-0 px-0">
            {threads.map((thread) => (
              //thread.is_hidden ? null : ( // Skip hidden threads
              <div
                className={`bg-blue-100 rounded-2xl z-100 w-full p-4 mb-4 mx-1 transition-all duration-300 ${
                  isActiveId === thread.id ? "mt-3 mb-7" : ""
                }`}
                key={thread.id}
              >
                <div className="relative">
                  <h2 className="text-sm font-semibold text-left text-green-500">
                    {thread.user_name}
                  </h2>
                  <div
                    className=" flex justify-between items-center"
                    onClick={(e) => {
                      handleClick(e, thread, thread.id);
                    }}
                    data-id={thread.id}
                  >
                    <p className="text-gray-700 text-center">
                      {thread.content.length > THREAD_CONTENT_LENGTH
                        ? thread.content.substring(0, THREAD_CONTENT_LENGTH) +
                          "..."
                        : thread.content}
                    </p>
                    <button
                      className="text-red-500 border-2 border-gray-300 bg-pink-200 z-max"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await handleClickIshidden(thread.id, !thread.is_hidden);
                        router.refresh();
                      }}
                    >
                      {thread.is_hidden ? "Hidden" : "Visible"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="w-full sticky bottom-5 px-1 z-100">
              <PageButton
                onClickLeft={handleClickLeft}
                onClickRight={handleClickRight}
              />
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default MainThreads;
