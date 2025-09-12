import React from "react";
import { useState } from "react";
import { THREADS_PER_PAGE, THREAD_CONTENT_LENGTH } from "@/lib/threads/types";
import { SupabaseThread } from "@/lib/threads/types";
//import { mockCommentsData } from "./test/testData"; // Mock data for testing
import NavigateRectangleSticky from "./NavigateRectangleSticky";
import { ThreadInputForm } from "./ThreadInputForm";
import { getThreadCount } from "../utils/supabaseFunctions";
import { useRouter } from "next/navigation";
import PageButton from "./PageButton";
type Props = {
  threads: SupabaseThread[];
  setThreadsData: React.Dispatch<React.SetStateAction<SupabaseThread[]>>;
  threadsIndex: number;
};

const MainThreads = (props: Props) => {
  const { threads, setThreadsData, threadsIndex } = props;
  const [isSmall, setIsSmall] = useState(false);
  const [isActiveId, setIsActiveId] = useState<number | null>(null);
  const [addNewThreadIsSelected, setAddNewThreadIsSelected] = useState(false);
  const router = useRouter();
  const handleClick = async (
    event: React.MouseEvent<HTMLDivElement>,
    thread: SupabaseThread,
    id: number
  ) => {
    setIsSmall(!isSmall);
    setIsActiveId(id);
    const threadId = event.currentTarget.dataset.id;
    console.log("Thread clicked:", threadId);
    router.push(`/thread/${threadId}`);
  };

  const handleClickLeft = () => {
    if (threadsIndex > 1) {
      const index = threadsIndex - 1;
      router.push(`/${index}`);
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
      router.push(`/${index}`);
    }
  };

  return (
    <div className="flex justify-center w-full m-0 p-0">
      <div className="sticky top-0 flex flex-col  mr-1 ml-1">
        <NavigateRectangleSticky
          navigateTitle="Add New Thread"
          justifyStyle="justify-end"
          itemsStyle="items-center"
          bgcolor="bg-purple-400"
          width="w-full"
          onClick={() => {
            setAddNewThreadIsSelected(true);
          }}
        />
      </div>
      <div className="w-6/10 flex flex-col items-center mx-0 px-0">
        {addNewThreadIsSelected && (
          <ThreadInputForm
            setAddNewThreadIsSelected={setAddNewThreadIsSelected}
            setThreadsData={setThreadsData} // この行を追記
          />
        )}
        {!addNewThreadIsSelected && (
          <div className="w-full  flex flex-col items-center  mt-0 mx-0 pt-0 px-0">
            {threads.map((thread) => (
              //thread.is_hidden ? null : ( // Skip hidden threads
              <div
                className={`bg-blue-100 rounded-2xl z-100 w-full p-4 mb-4 mx-1 transition-all duration-300 ${
                  isActiveId === thread.id ? "mt-3 mb-7" : ""
                }`}
                key={thread.id}
                onClick={(e) => handleClick(e, thread, thread.id)}
                data-id={thread.id}
              >
                <div>
                  <h2 className="text-sm font-semibold text-left text-green-500">
                    {thread.user_name}
                  </h2>
                  <p className="text-gray-700 text-center">
                    {thread.content.length > THREAD_CONTENT_LENGTH
                      ? thread.content.substring(0, THREAD_CONTENT_LENGTH) +
                        "..."
                      : thread.content}
                  </p>
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
        )}
      </div>
    </div>
  );
};

export default MainThreads;
