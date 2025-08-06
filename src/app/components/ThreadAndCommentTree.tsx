import { Thread } from "@/lib/threads/types";
import NavigateRectangleSticky from "./NavigateRectangleSticky";
import { useState } from "react";
import CommentInputForm from "./CommentInputForm";
import CommentTree from "./CommentTree";
//import { useRouter } from "next/navigation";

type Props = {
  thread: Thread | null; // Thread can be null if not selected;
  height: number;
  setMainThreadsIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  setThreadAndCommentTreeIsActive: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setSelectedThread: React.Dispatch<React.SetStateAction<Thread | null>>;
  onReturn: () => void;
  setLatestActivityAt: React.Dispatch<React.SetStateAction<string>>;
};

const ThreadAndCommentTree = (props: Props) => {
  const {
    thread,
    height,
    setMainThreadsIsActive,
    setThreadAndCommentTreeIsActive,
    setSelectedThread,
    onReturn,
    setLatestActivityAt,
  } = props;

  const handleReturnToThreads = () => {
    onReturn();
    setThreadAndCommentTreeIsActive(false);
    setMainThreadsIsActive(true);
  };

  const [isCommentingAtThread, setIsCommentingAtThread] = useState(false);
  const [isCommentingChildId, setIsCommentingChildId] = useState<string | null>(
    null
  );

  const handleCommentToggleAtChild = (commentId?: string | null) => {
    setIsCommentingChildId((prev) =>
      prev === commentId ? null : commentId ?? null
    );
  };

  const handleCommentToggleAtThread = (flag?: boolean) => {
    setIsCommentingAtThread((prev) => (flag !== undefined ? flag : !prev));
  };

  return (
    <div
      style={{ height: `${(height * 4) / 5}px` }}
      className="flex justify-center w-full overflow-auto"
    >
      <NavigateRectangleSticky
        navigateTitle="return to threads"
        justifyStyle="justify-end"
        itemsStyle="items-center"
        bgcolor="bg-purple-800"
        onClick={() => {
          handleReturnToThreads();
        }}
      />

      <div className="w-6/10 ml-1/10 h-fit flex justify-center flex-col items-center mr-0 px-0">
        <div className="bg-white rounded-2xl p-4 mb-4 w-full">
          <h2 className="text-sm font-semibold text-left text-green-500 bg-amber-100 rounded-b-lg p-2">
            {thread?.user_name}
          </h2>
          <p
            className="text-gray-700 text-center bg-amber-200   p-2"
            onClick={() => {
              handleCommentToggleAtChild(null);
              handleCommentToggleAtThread();
            }}
          >
            {thread?.content}
          </p>
          {isCommentingAtThread && thread && (
            <CommentInputForm
              threadId={thread ? thread.id : null}
              thread={thread}
              setSelectedThread={setSelectedThread}
              handleCommentToggleAtThread={handleCommentToggleAtThread}
              hierarchyLevel={1}
              setLatestActivityAt={setLatestActivityAt}
            />
          )}
          {thread?.comments && thread.comments.length > 0 && (
            <div className="mt-4">
              {thread.comments.map(
                (comment) => (
                  //                comment.is_hidden ? null : (
                  <div key={comment.id}>
                    <div className="bg-gray-100 rounded-lg p-2 mb-2">
                      <h3 className="text-xs font-semibold text-left text-blue-500">
                        {comment.user_name}
                      </h3>
                      <p
                        className="text-gray-600 text-sm"
                        onClick={() => {
                          handleCommentToggleAtThread(false);
                          handleCommentToggleAtChild(comment.id);
                        }}
                      >
                        {comment.comment_text}
                      </p>
                      {isCommentingChildId === comment.id && (
                        <CommentInputForm
                          id={comment.id}
                          threadId={thread?.id}
                          thread={thread}
                          setSelectedThread={setSelectedThread}
                          parentId={comment.id}
                          handleCommentToggleAtChild={() =>
                            handleCommentToggleAtChild(comment.id)
                          }
                          hierarchyLevel={2}
                          setLatestActivityAt={setLatestActivityAt}
                        />
                      )}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-4 bg-white mb-0.5">
                          <CommentTree
                            comment={comment}
                            thread={thread}
                            setSelectedThread={setSelectedThread}
                            setIsCommentingAtThread={setIsCommentingAtThread}
                            isCommentingChildId={isCommentingChildId}
                            setIsCommentingChildId={setIsCommentingChildId}
                            handleCommentToggleAtChild={
                              handleCommentToggleAtChild
                            }
                            setLatestActivityAt={setLatestActivityAt}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )
                //              )
              )}
            </div>
          )}
          {/* Render comments here if needed */}
        </div>
      </div>
      <div className="sticky top-9/10  w-1/10  h-fit flex col items-baseline-last justify-end ml-1 mb-0">
        {/* This is dummy div area for centering threads container */}
      </div>
    </div>
  );
};
export default ThreadAndCommentTree;
