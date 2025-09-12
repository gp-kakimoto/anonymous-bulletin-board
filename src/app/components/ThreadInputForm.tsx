import { postThread } from "../actions";
import { useState } from "react";
import { validUserName, validContent } from "@/lib/functionsForValidation";
import { getThreadsFromSupabase } from "../utils/supabaseFunctions"; // この行を追記
import { SupabaseThread } from "@/lib/threads/types";
import InputForm from "./InputForm";
import { useRouter } from "next/navigation";
type Props = {
  setThreadsData: React.Dispatch<React.SetStateAction<SupabaseThread[]>>;
  setAddNewThreadIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
};
const ThreadInputForm = (props: Props) => {
  const { setThreadsData, setAddNewThreadIsSelected } = props;
  const [userName, setUserName] = useState<string | null>("");
  const [validUserNameMessage, setValidUserNameMessage] = useState<
    string | null
  >("ユーザ名は必須です。");
  const [content, setContent] = useState<string | null>("");
  const [validContentMessage, setValidContentMessage] = useState<string | null>(
    "コメントは必須です。"
  );
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await postThread(new FormData(e.currentTarget));

    if (response?.error) {
      console.error(response.error);
      alert(`エラー: ${response.error}`); // Display error to the user
    } else {
      // Success case
      setAddNewThreadIsSelected(false);

      const updatedThreads = await getThreadsFromSupabase(1);
      if (updatedThreads) {
        setThreadsData(updatedThreads);
      }

      setUserName("");
      setContent("");
      setValidUserNameMessage("ユーザ名は必須です。");
      setValidContentMessage("コメントは必須です。");
      router.push(`/1`); // Navigate to the first page after posting
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    setValidUserNameMessage(validUserName(e.target.value));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setValidContentMessage(validContent(e.target.value));
  };

  const handleClickCancel = () => {
    setAddNewThreadIsSelected(false);
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

export { ThreadInputForm };
