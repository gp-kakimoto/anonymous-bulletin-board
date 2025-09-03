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
    const threadCount = await getThreadCount();
    console.log(`threadCount in handClickRight=${threadCount}`);
    if (
      THREADS_PER_PAGE * (threadsIndex + 1) + 1 <=
      (threadCount !== null ? threadCount : threadsIndex * THREADS_PER_PAGE) // If threadCount is null, use threadsIndex * THREADS_PER_PAGE
    ) {
      const index = threadsIndex + 1 + 1;
      router.push(`/${index}`);
    }
  };

  return (
    <div className="flex justify-center w-full m-0 p-0">
      <div className="sticky top-0 flex flex-col  h-full mr-1 ml-1">
        <NavigateRectangleSticky
          navigateTitle="Add New Thread"
          justifyStyle="justify-end"
          itemsStyle="items-center"
          bgcolor="bg-purple-400"
          width="w-full"
          //styles={{
          // navigateTitle: "Add New Thread",
          // justifyStyle: "justify-end",
          // itemsStyle: "items-center",
          // bgcolor: "bg-purple-400",
          // width: "w-full",
          // height: "sticky top-0",
          // }}
          onClick={() => {
            setAddNewThreadIsSelected(true);
          }}
        />
      </div>
      <div className="w-6/10 h-fit  flex flex-col items-center mx-0 px-0">
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
            )
            //)
          )}
        {!addNewThreadIsSelected && (
          <div className="w-full sticky bottom-5 px-1 z-100">
            <PageButton
              onClickLeft={handleClickLeft}
              onClickRight={handClickRight}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainThreads;
