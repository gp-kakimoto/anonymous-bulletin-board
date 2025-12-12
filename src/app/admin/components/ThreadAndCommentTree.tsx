"use client";
import { Thread, Comment } from "@/lib/threads/types";
import NavigateRectangleSticky from "@/app/components/NavigateRectangleSticky";
//import { useState } from "react";
//import CommentInputForm from "./CommentInputForm";
import CommentTree from "./CommentTree";
import { useRouter } from "next/navigation";
import { updateCommentVisibility, updateThreadVisibility } from "@/app/actions";
type Props = {
  thread: Thread | null; // Thread can be null if not selected;
};

const ThreadAndCommentTree = (props: Props) => {
  const router = useRouter();

  const { thread } = props;

  const handleReturnToThreads = () => {
    router.back();
  };

  const handleIshiddenAtReplies = async (
    thread: Thread,
    replies: Comment[]
  ) => {
    for (const reply of replies) {
      const generateFlagofIsHidden =
        !thread.is_hidden === true ? true : reply.is_hidden;
      if (
        await updateCommentVisibility(
          reply.id,
          generateFlagofIsHidden,
          thread.is_hidden,
          reply
        )
      ) {
        console.log("Reply visibility updated successfully");
      } else {
        console.error("Failed to update reply visibility");
      }
      if (reply.replies.length > 0) {
        await handleIshiddenAtReplies(thread, reply.replies || []);
      }
    }
  };

  const handleClickIshidden = async (
    id: number | string, //threadId:number,or commentId:number
    isHidden: boolean,
    thread: Thread,
    comment?: Comment
  ) => {
    console.log("Hidden button clicked");
    try {
      if (
        comment == undefined &&
        (await updateThreadVisibility(Number(id), isHidden))
      ) {
        await handleIshiddenAtReplies(thread, thread?.comments || []);
        console.log("Thread visibility updated successfully");
        //router.refresh();
      } else if (comment == undefined) {
        console.error("Failed to update thread visibility");
      }

      if (
        await updateCommentVisibility(
          String(id),
          isHidden,
          thread.is_hidden,
          comment!
        )
      ) {
        /*       for (let i = 0; i < thread.comments.length; i++) {
          if (thread.comments[i].id === String(id)) {
            //const comment = thread.comments[i];
            await handleIshiddenAtReplies(thread, comment!.replies || []);
            break;
          }
        }*/
        const targetComment = thread.comments.find((c) => c.id === String(id));
        if (targetComment) {
          await handleIshiddenAtReplies(thread, comment!.replies || []);
        }
        console.log("Comment visibility updated successfully");
        //router.refresh();
      } else {
        console.error("Failed to update comment visibility");
      }
      router.refresh();
    } catch (error) {
      console.error(
        "Error updating thread visibility: or updating comment visibility",
        error
      );
    }
    // console.log(`Thread ID: ${id}, New is_hidden: ${isHidden}`);
  };

  return (
    <div className="flex justify-center w-full  m-0 p-0">
      <div className="sticky top-0 flex flex-col mr-1 ml-1">
        <NavigateRectangleSticky
          navigateTitle="return to admin threads"
          justifyStyle="justify-end"
          itemsStyle="items-center"
          bgcolor="bg-purple-800"
          width="w-full"
          onClick={() => {
            handleReturnToThreads();
          }}
        />
      </div>
      <div className=" w-6/10  flex  flex-col items-center  mt-0 mx-0 pt-0 px-0">
        <div className="bg-white rounded-2xl p-4 mb-4 w-full">
          <h2 className="text-sm font-semibold text-left text-green-500 bg-amber-100 rounded-b-lg p-2">
            {thread?.user_name}
          </h2>
          <div className="text-gray-700 text-center bg-amber-200   p-2">
            <p className="flex justify-between">
              {thread?.content}
              <button
                className="text-red-500 border-2 border-gray-300 bg-pink-200 z-max"
                onClick={async () => {
                  if (thread == null) return;
                  {
                    await handleClickIshidden(
                      thread.id,
                      !thread.is_hidden,
                      thread
                    );
                  }

                  router.refresh();
                }}
              >
                {thread?.is_hidden ? "Hidden" : "Visible"}
              </button>
            </p>
          </div>
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
                      <div className="flex justify-between ">
                        <p className="text-gray-600 text-sm">
                          {comment.comment_text}
                        </p>
                        <button
                          className="text-red-500 border-2 border-gray-300 bg-pink-200 z-max"
                          onClick={async () => {
                            if (comment === null) return;
                            else {
                              await handleClickIshidden(
                                comment.id,
                                !comment.is_hidden,
                                thread,
                                comment
                              );
                            }

                            router.refresh();
                          }}
                        >
                          {comment.is_hidden ? "Hidden" : "Visible"}
                        </button>
                      </div>
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-4 bg-white mb-0.5">
                          <CommentTree comment={comment} thread={thread} />
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
