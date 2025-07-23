type Props = {
  id?: string; // Optional ID for the comment input form
  threadId: number | null; // Thread ID can be null if not selected
  parentId?: string | null; // Optional parent ID for nested comments
  handleCommentToggleAtThread?: () => void; // Function to toggle comment input visibility
  handleCommentToggleAtChild?: (commentId?: string | null) => void; // Function to toggle child comment input visibility
};

const CommentInputForm = (props: Props) => {
  const {
    id,
    threadId,
    parentId,
    handleCommentToggleAtThread,
    handleCommentToggleAtChild,
  } = props;
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Handle form submission logic here
    console.log(
      "Comment submitted for thread:",
      threadId,
      "with parent ID:",
      parentId
    );
    handleCommentToggleAtThread?.(); // Close the comment input form after submission
    handleCommentToggleAtChild?.(id ? id : null); // Close the child comment input form if applicable
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center p-4 m-2 bg-gray-100 rounded-lg shadow-md"
    >
      <input
        type="text"
        placeholder="Your Name"
        className="w-9/10 m-2 p-2 border border-black rounded font-black"
      />
      <textarea
        placeholder="Add a comment..."
        className="w-9/10 m-2 p-2 border border-black rounded font-black"
      />
      <button type="submit" className="m-2 p-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  );
};

export default CommentInputForm;
