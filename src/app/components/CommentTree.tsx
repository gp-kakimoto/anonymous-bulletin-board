import { Comment } from "@/lib/threads/types";
import { MAXHIERARCHYLEVEL } from "@/lib/threads/types";
import CommentInputForm from "./CommentInputForm";
/**
 * CommentTree component displays a comment and its replies in a tree structure.
 * It allows users to reply to comments and navigate through nested replies.
 * It is used within the ThreadAndCommentTree component.
 * このコンポーネントは再帰的な実装が行われています。
 * This component has a recursive implementation.
 * Iterating version of this component is under construction.
 * MAXHIERARCHYLEVEL is used to control the maximum depth of comment nesting.
 * MAXHIERARCHYLEVELはコメントのネストの最大深度を制御するために使用されます。
 * You can adjust this value to control how deep the comment nesting goes.
 **/
type Props = {
  comment: Comment | null; // Comment object to display
  setIsCommentingAtThread: React.Dispatch<React.SetStateAction<boolean>>;
  isCommentingChildId: string | null;
  setIsCommentingChildId: (id: string | null) => void;
  handleCommentToggleAtChild: (id: string | null) => void;
};
const CommentTree = (props: Props) => {
  const {
    comment,
    setIsCommentingAtThread,
    isCommentingChildId,
    setIsCommentingChildId,
    handleCommentToggleAtChild,
  } = props;

  const handleClick = (id: string | null) => {
    setIsCommentingAtThread(false);
    if (id === isCommentingChildId && isCommentingChildId !== null) {
      setIsCommentingChildId(null);
    } else {
      setIsCommentingChildId(id);
    }
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
                className="ml-2"
                onClick={() => {
                  handleClick(reply.id);
                }}
              >
                <p className="text-gray-600 text-sm">{reply.comment_text}</p>
              </div>
              {/* Render comment input form for replying to this comment */}
              {reply.hierarchy_level !== null &&
                reply.hierarchy_level < MAXHIERARCHYLEVEL &&
                isCommentingChildId === reply.id && (
                  <CommentInputForm
                    id={reply.id}
                    threadId={reply.thread_id}
                    parentId={comment.id}
                    handleCommentToggleAtChild={() =>
                      handleCommentToggleAtChild(reply.id)
                    }
                  />
                )}
              {/* 
                Render nested comments if they exist
                you can control max hierarchy level by editing 
                MAXHIERARCHYLEVEL at src/lib/threads/types.ts
            */}

              {reply.replies?.length !== null &&
                reply.hierarchy_level !== null &&
                reply.hierarchy_level <= MAXHIERARCHYLEVEL && (
                  <CommentTree
                    comment={reply}
                    setIsCommentingAtThread={setIsCommentingAtThread}
                    isCommentingChildId={isCommentingChildId}
                    setIsCommentingChildId={setIsCommentingChildId}
                    handleCommentToggleAtChild={() =>
                      handleCommentToggleAtChild(isCommentingChildId)
                    }
                  />
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
