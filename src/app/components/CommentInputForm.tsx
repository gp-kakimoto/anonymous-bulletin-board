import { validUserName, validContent } from "@/lib/functionsForValidation";
import { useEffect, useState } from "react";
import InputForm from "./InputForm";
import { postComment } from "../actions";
import { getCommentsFromSupabase } from "../utils/supabaseFunctions";
import { transformSupabaseData } from "@/lib/threads/tranformSpabaseData";
import { Thread } from "@/lib/threads/types";
//import { useRouter } from "next/navigation";
type Props = {
  id?: string; // Optional ID for the comment input form
  threadId: number | null; // Thread ID can be null if not selected
  parentId?: string | null; // Optional parent ID for nested comments
  hierarchyLevel: number;
  thread: Thread;
  handleCommentToggleAtThread?: () => void; // Function to toggle comment input visibility
  handleCommentToggleAtChild?: (commentId?: string | null) => void; // Function to toggle child comment input visibility
  setSelectedThread: React.Dispatch<React.SetStateAction<Thread | null>>;
  setLatestActivityAt: React.Dispatch<React.SetStateAction<string>>;
};

const CommentInputForm = (props: Props) => {
  const {
    id,
    threadId,
    parentId,
    hierarchyLevel,
    thread,
    handleCommentToggleAtThread,
    handleCommentToggleAtChild,
    setSelectedThread,
    setLatestActivityAt,
  } = props;
  //const router = useRouter();
  const [userName, setUserName] = useState<string | null>("");
  const [validUserNameMessage, setValidUserNameMessage] = useState<
    string | null
  >("ユーザ名は必須です。");

  const [content, setContent] = useState<string | null>("");
  const [validContentMessage, setValidContentMessage] = useState<string | null>(
    "コメントは必須です。"
  );

  useEffect(() => {
    setLatestActivityAt(thread.latest_activity_at);
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`parentID==${parentId}`);
    console.log(`id==${id}`);

    const response = await postComment(
      new FormData(e.currentTarget),
      threadId,
      id,
      hierarchyLevel
    );
    if (response?.error) {
      console.error(response.error);
      alert(`エラー： ${response.error}`);
    } else {
      // Handle form submission logic here
      console.log(
        "Comment submitted for thread:",
        threadId,
        "with parent ID:",
        parentId
      );

      const commentsFromSupabase = await getCommentsFromSupabase(
        Number(threadId)
      );
      //      );
      if (commentsFromSupabase !== null) {
        setSelectedThread(transformSupabaseData(thread, commentsFromSupabase));
      }
      if (response !== null && response?.data) {
        setLatestActivityAt(response?.data[0].created_at);
      }
      setUserName("");
      setContent("");
      setValidUserNameMessage("ユーザ名は必須です。");
      setValidContentMessage("コメントは必須です。");
      handleCommentToggleAtThread?.(); // Close the comment input form after submission
      handleCommentToggleAtChild?.(id ? id : null); // Close the child comment input form if applicable
      // router.refresh();
    }
  };

  const handleClickCancel = () => {
    handleCommentToggleAtThread?.(); // Close the comment
    handleCommentToggleAtChild?.(id ? id : null); // Close the child comment input form if applicable
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    setValidUserNameMessage(validUserName(e.target.value));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setValidContentMessage(validContent(e.target.value));
  };

  return (
    <InputForm
      userName={userName}
      content={content}
      validUserNameMessage={validUserNameMessage}
      validContentMessage={validContentMessage}
      handleClickCancel={() => {
        handleClickCancel();
      }}
      handleInputChange={(e) => {
        handleInputChange(e);
      }}
      handleTextAreaChange={(e) => {
        handleTextAreaChange(e);
      }}
      handleSubmit={(e) => {
        handleSubmit(e);
      }}
    />
  );
};

export default CommentInputForm;
