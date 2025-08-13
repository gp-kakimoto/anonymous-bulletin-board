import React from "react";
import { useState } from "react";
import { THREAD_CONTENT_LENGTH } from "@/lib/threads/types";
import { SupabaseThread } from "@/lib/threads/types";
//import { mockCommentsData } from "./test/testData"; // Mock data for testing
import NavigateRectangleSticky from "./NavigateRectangleSticky";
import { ThreadInputForm } from "./ThreadInputForm";
import { getMaxThreadId } from "../utils/supabaseFunctions";
import { useRouter } from "next/navigation";
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
    const maxId = await getMaxThreadId();
    console.log(`maxId in handClickRight=${maxId}`);
    if (
      10 * (threadsIndex + 1) + 1 <=
      (maxId !== null ? maxId : threadsIndex * 10)
    ) {
      const index = threadsIndex + 1 + 1;
      router.push(`/${index}`);
    }
  };

  return (
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

        <div
          className="sticky top-9/10 w-8/10 flex h-fit items-baseline-last justify-end mr-0"
          onClick={() => handleClickLeft()}
        >
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent transform rotate-90 border-t-blue-500"></div>
          <div className="m-0 p-0"> 前へ</div>
        </div>
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
                className={`bg-white rounded-2xl p-4 mb-4 w-full transition-all duration-300 ${
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

      <div
        className="sticky top-9/10  w-1/10  h-fit flex col items-baseline-last justify-end ml-1 mb-0"
        onClick={() => handClickRight()}
      >
        <div className="m-0 p-0"> 次へ</div>
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent transform rotate-270 border-t-blue-500"></div>
      </div>
    </div>
  );
};

export default MainThreads;
