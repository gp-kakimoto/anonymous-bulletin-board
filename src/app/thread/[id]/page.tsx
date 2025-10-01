import {
  getCommentsFromSupabase,
  getThreadFromSupabase,
} from "@/app/utils/supabaseServerFunctions";

import { transformSupabaseData } from "@/lib/threads/tranformSpabaseData";
import { Thread } from "@/lib/threads/types";
import ThreadAndCommentTree from "@/app/components/ThreadAndCommentTree";

const getAndTransformComments = async (
  threadId: number
): Promise<Thread | null> => {
  const threadFromSupabae = await getThreadFromSupabase(threadId);
  const commentsFromSupabase = await getCommentsFromSupabase(threadId);

  if (commentsFromSupabase && threadFromSupabae) {
    return transformSupabaseData(threadFromSupabae, commentsFromSupabase);
  }
  return null;
};

type Params = Promise<{ id: string }>;
const Page = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const threadId = parseInt(id, 10);
  const transformedData = await getAndTransformComments(threadId);

  return (
    <main className="flex  flex-col items-centerjustify-center  mx-auto ">
      <h1 className="text-4xl font-bold  mt-0 mb-5 w-full z-100 text-center">
        Anonymous Bulletin Board
      </h1>
      <ThreadAndCommentTree thread={transformedData} />
    </main>
  );
};

export default Page;
