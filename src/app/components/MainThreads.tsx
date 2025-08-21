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
  threads: SupabaseThread[] | null;
  setThreadsData: React.Dispatch<React.SetStateAction<SupabaseThread[] | null>>;
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

  // /n のとき n-1 を threadsIndex　としている
  // threadsIndexが0のときは /1 に遷移する
  // index = threadsIndex +1 -1は
  // index = n-1となり、/n-1に遷移する
  const handleClickLeft = () => {
    if (threadsIndex > 0) {
      const index = threadsIndex + 1 - 1;
      router.push(`/${index}`);
    }
  };
  const handClickRight = async () => {
    const maxId = await getThreadCount();
    console.log(`maxId in handClickRight=${maxId}`);
    if (
      THREADS_PER_PAGE * (threadsIndex + 1) + 1 <=
      (maxId !== null ? maxId : threadsIndex * THREADS_PER_PAGE) // If maxId is null, use threadsIndex * THREADS_PER_PAGE
    ) {
      const index = threadsIndex + 1 + 1;
      router.push(`/${index}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div
        style={{ height: `calc((100vh * 4) / 5)` }}
        className="flex justify-center w-5/5 overflow-auto"
      >
        <div className="sticky top-0 flex flex-col w-2/10 h-full mr-1 ml-1">
          <NavigateRectangleSticky
            navigateTitle="Add New Thread"
            justifyStyle="justify-end"
            itemsStyle="items-center"
            bgcolor="bg-purple-400"
            width="w-5/5"
            onClick={() => {
              setAddNewThreadIsSelected(true);
            }}
          />
        </div>
        <div className="w-6/10 ml-0  h-fit  flex justify-center flex-col items-center mx-0 px-0">
          {addNewThreadIsSelected && (
            <ThreadInputForm
              setAddNewThreadIsSelected={setAddNewThreadIsSelected}
              setThreadsData={setThreadsData} // この行を追記
            />
          )}
          {!addNewThreadIsSelected &&
            threads &&
            threads.map(
              (thread) => (
                //thread.is_hidden ? null : ( // Skip hidden threads
                <div
                  className={`bg-white rounded-2xl z-100 p-4 mb-4 w-full transition-all duration-300 ${
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
              )
              //)
            )}
        </div>
      </div>
      <PageButton onClickLeft={handleClickLeft} onClickRight={handClickRight} />
    </div>
  );
};

export default MainThreads;
