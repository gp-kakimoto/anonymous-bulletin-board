import {
  getCommentsFromSupabase,
  getThreadFromSupabase,
} from "@/app/utils/supabaseServerFunctions";

import { transformSupabaseData } from "@/lib/threads/transformSupabaseData";
import { Thread } from "@/lib/threads/types";
import ThreadAndCommentTree from "@/app/components/ThreadAndCommentTree";

const getAndTransformComments = async (
  threadId: number
): Promise<Thread | null> => {
  const threadFromSupabase = await getThreadFromSupabase(threadId);
  const commentsFromSupabase = await getCommentsFromSupabase(threadId);

  if (commentsFromSupabase && threadFromSupabase) {
    return transformSupabaseData(threadFromSupabase, commentsFromSupabase);
  }
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
      <ThreadAndCommentTree thread={transformedData} />
    </main>
  );
};

export default Page;
