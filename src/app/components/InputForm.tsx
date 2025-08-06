type Props = {
  userName: string | null;
  content: string | null;
  validUserNameMessage: string | null;
  validContentMessage: string | null;
  handleClickCancel: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextAreaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const InputForm = (props: Props) => {
  const {
    userName,
    content,
    validUserNameMessage,
    validContentMessage,
    handleClickCancel,
    handleInputChange,
    handleTextAreaChange,
    handleSubmit,
  } = props;

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
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
        className="w-9/10 m-2 p-2 border border-black rounded text-black"
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
        className="w-9/10 m-2 p-2 border border-black rounded text-black"
        onChange={(e) => {
          handleTextAreaChange(e);
        }}
      />
      <p className="text-sm text-red-500">{validContentMessage}</p>
      <div className="flex">
        <button
          type="button"
          className="m-2 p-2 bg-red-500 text-white rounded"
          onClick={() => handleClickCancel()}
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

export default InputForm;
