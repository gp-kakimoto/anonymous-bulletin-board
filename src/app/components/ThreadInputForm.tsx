import { postThread } from "../actions";
import { useState } from "react";
import { validUserName, validContent } from "@/lib/functionsForValidation";
import { getThreadsFromSupabase } from "../utils/supabaseFunctions"; // この行を追記
//import { useRouter } from "next/navigation";
import { SupabaseThread } from "@/lib/threads/types";
type Props = {
  threadsIndex: number;
  setThreadsIndex: React.Dispatch<React.SetStateAction<number>>;
  setThreadsData: React.Dispatch<React.SetStateAction<SupabaseThread[] | null>>;
  setAddNewThreadIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
};
const ThreadInputForm = (props: Props) => {
  const {
    //threadsIndex,
    setThreadsIndex,
    setThreadsData,
    setAddNewThreadIsSelected,
  } = props;
  const [userName, setUserName] = useState<string | null>("");
  const [validUserNameMessage, setValidUserNameMessage] = useState<
    string | null
  >("ユーザ名は必須です。");
  const [content, setContent] = useState<string | null>("");
  const [validContentMessage, setValidContentMessage] = useState<string | null>(
    "コメントは必須です。"
  );
  //const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await postThread(new FormData(event.currentTarget));

    if (response?.error) {
      console.error(response.error);
      alert(`エラー: ${response.error}`); // Display error to the user
    } else {
      // Success case
      setAddNewThreadIsSelected(false);
      const updatedThreads = await getThreadsFromSupabase(0);
      if (updatedThreads) {
        setThreadsData(updatedThreads);
      }
      setThreadsIndex(0);
      setUserName("");
      setContent("");
      setValidUserNameMessage("ユーザ名は必須です。");
      setValidContentMessage("コメントは必須です。");
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

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center p-4 m-2 bg-gray-100 rounded-lg shadow-md"
    >
      <label
        htmlFor="userName"
        className="w-9/10 text-left font-bold text-black"
      >
        名前
      </label>
      <input
        id="userName"
        name="userName"
        type="text"
        placeholder="Your Name"
        value={userName ? userName : ""}
        className="w-9/10 m-2 p-2 border border-black rounded font-black text-black"
        onChange={(e) => {
          handleInputChange(e);
        }}
      />
      <p className="text-sm text-red-500">{validUserNameMessage}</p>
      <label
        htmlFor="content"
        className="w-9/10 text-left font-bold text-black"
      >
        コメント
      </label>
      <textarea
        id="content"
        name="content"
        value={content ? content : ""}
        placeholder="Add a comment..."
        className="w-9/10 m-2 p-2 border border-black rounded font-black text-black"
        onChange={(e) => {
          handleTextAreaChange(e);
        }}
      />
      <p className="text-sm text-red-500">{validContentMessage}</p>
      <div className="flex">
        <button
          type="button"
          className="m-2 p-2 bg-red-500 text-white rounded"
          onClick={() => {
            setAddNewThreadIsSelected(false);
          }}
        >
          Cansel
        </button>
        <button
          type="submit"
          className="m-2 p-2 bg-blue-500 text-white rounded"
          disabled={!(userName && content)}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export { ThreadInputForm };
