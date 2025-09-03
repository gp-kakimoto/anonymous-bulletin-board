import { Thread } from "@/lib/threads/types";
import NavigateRectangleSticky from "./NavigateRectangleSticky";
import { useState } from "react";
import CommentInputForm from "./CommentInputForm";
import CommentTree from "./CommentTree";
import { useRouter } from "next/navigation";

type Props = {
  thread: Thread | null; // Thread can be null if not selected;
  //height: number;
};

const ThreadAndCommentTree = (props: Props) => {
  const router = useRouter();

  const { thread } = props;

  const [latestActivityAt, setLatestActivityAt] = useState<string>("");
  const handleReturnToThreads = () => {
    if (thread !== null && latestActivityAt !== "") {
      setLatestActivityAt("");
      router.push(`/1`); // Refresh the page to get the latest threads
    } else {
      router.back();
    }
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
    <div className="flex justify-center w-full  m-0 p-0">
      <div className="sticky top-0 flex flex-col  h-full mr-1 ml-1">
        <NavigateRectangleSticky
          navigateTitle="return to threads"
          justifyStyle="justify-end"
          itemsStyle="items-center"
          bgcolor="bg-purple-800"
          width="w-full"
          onClick={() => {
            handleReturnToThreads();
          }}
        />
      </div>
      <div className=" w-6/10 h-fit flex  flex-col items-center  mt-0 mx-0 pt-0 px-0">
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
    </div>
  );
};
export default ThreadAndCommentTree;
