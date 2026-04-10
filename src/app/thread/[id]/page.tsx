import {
  // getCommentsFromSupabase,
  // getThreadFromSupabase,
  getThreadAndCommentsFromSupabase,
} from "@/app/utils/supabaseServerFunctions";

import { transformSupabaseData } from "@/lib/threads/transformSupabaseData";
import { Thread } from "@/lib/threads/types";
import ThreadAndCommentTree from "@/app/components/ThreadAndCommentTree";

const getAndTransformComments = async (
  threadId: number,
): Promise<Thread | null> => {
  //const threadFromSupabase = await getThreadFromSupabase(threadId);
  //const commentsFromSupabase = await getCommentsFromSupabase(threadId);

  const threadAndComments = await getThreadAndCommentsFromSupabase(threadId);
  //  console.log(threadAndComments);
  if (threadAndComments) {
    //  console.log("Thread and Comments from Supabase:", threadAndComments);
    return transformSupabaseData(
      {
        id: threadAndComments.id,
        user_name: threadAndComments.user_name,
        content: threadAndComments.content,
        created_at: threadAndComments.created_at,
        updated_at: threadAndComments.updated_at,
        is_hidden: threadAndComments.is_hidden,
        latest_activity_at: threadAndComments.latest_activity_at,
        ip_address: threadAndComments.ip_address,
      },
      threadAndComments.comments,
    );
  } else {
    console.log("Failed to fetch thread and comments from Supabase.");
  }

  /*if (commentsFromSupabase && threadFromSupabase) {
    return transformSupabaseData(threadFromSupabase, commentsFromSupabase);
  }*/
  return null;
};

type Params = { id: string };
const Page = async ({ params }: { params: Promise<Params> }) => {
  const { id } = await params;
  const threadId = parseInt(id, 10);
  const transformedData = await getAndTransformComments(threadId);

  return (
    <main className="flex  flex-col items-center justify-center  mx-auto ">
      <h1 className="text-4xl font-bold  mt-0 mb-5 w-full z-10 text-center">
        Anonymous Bulletin Board
      </h1>
      {transformedData ? (
        <ThreadAndCommentTree thread={transformedData} />
      ) : (
        <p className="text-red-500">Thread not found.</p>
      )}
    </main>
  );
};

export default Page;
