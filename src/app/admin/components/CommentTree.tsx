import { Comment } from "@/lib/threads/types";
import { MAX_HIERARCHY_LEVEL } from "@/lib/threads/types";
import { useRouter } from "next/navigation";
import { updateCommentVisibility } from "@/app/actions";
import { Thread } from "@/lib/threads/types";
/**
 * commentTree.tsx
 * @/app/admin/components/CommentTree.tsx
 * admin用のコメントツリーコンポーネント
 * CommentTree component for admin.
 * CommentTree component displays a comment and its replies in a tree structure.
 * It allows users to reply to comments and navigate through nested replies.
 * It is used within the ThreadAndCommentTree component.
 * このコンポーネントは再帰的な実装が行われています。
 * This component has a recursive implementation.
 * Iterating version of this component is under construction.
 * MAX_HIERARCHY_LEVEL is used to control the maximum depth of comment nesting.
 * MAX_HIERARCHY_LEVELはコメントのネストの最大深度を制御するために使用されます。
 * You can adjust this value to control how deep the comment nesting goes.
 **/
type Props = {
  comment: Comment | null; // Comment object to display
  thread: Thread;
};
const CommentTree = (props: Props) => {
  const router = useRouter();
  const { comment, thread } = props;

  const handleClickIshidden = async (
    id: number | string, //threadId:number,or commentId:number
    isHidden: boolean,
    replyComment: Comment
  ) => {
    console.log("Hidden button clicked");
    try {
      if (
        await updateCommentVisibility(
          String(id),
          isHidden,
          thread.is_hidden,
          //comment!
          replyComment
        )
      ) {
        console.log("Comment visibility updated successfully");
        //router.refresh();
      } else {
        console.error("Failed to update comment visibility");
      }
    } catch (error) {
      console.error("Error updating comment visibility:", error);
    }
    console.log(`Comment ID: ${id}, New is_hidden: ${isHidden}`);
  };

  return (
    <div className="bg-white my-1 pt-1 pb-0.5 ml-1 pl-1 mr-0 pr-0 ">
      {
        /* Comment tree structure will be implemented here */
        comment?.replies?.map(
          (reply) => (
            //       reply.is_hidden ? null : (
            <div key={reply.id} className="bg-gray-100 rounded-lg p-2 mb-0.5">
              <h4 className="text-xs font-semibold text-left text-blue-500">
                {reply.user_name}
              </h4>
              <div
                className="ml-2 flex justify-between items-center"
                /*onClick={() => {
                  handleClick(reply.id);
                }}*/
              >
                <p className="text-gray-600 text-sm">{reply.comment_text}</p>
                <button
                  className="text-red-500 border-2 border-gray-300 bg-pink-200 z-max"
                  onClick={async () => {
                    await handleClickIshidden(
                      reply.id,
                      !reply.is_hidden,
                      reply
                    );
                    router.refresh();
                  }}
                >
                  {reply.is_hidden ? "Hidden" : "Visible"}
                </button>
              </div>

              {/* 
                Render nested comments if they exist
                you can control max hierarchy level by editing 
                MAX_HIERARCHY_LEVEL at src/lib/threads/types.ts
            */}

              {reply.replies?.length !== null &&
                reply.hierarchy_level !== null &&
                reply.hierarchy_level <= MAX_HIERARCHY_LEVEL && (
                  <CommentTree comment={reply} thread={thread} />
                )}
            </div>
          )
          //     )
        )
      }
    </div>
  );
};

export default CommentTree;
