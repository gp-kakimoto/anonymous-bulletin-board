"use client";
import {
  getCommentsFromSupabase,
  getThreadFromSupabase,
} from "@/app/utils/supabaseFunctions";
import { transformSupabaseData } from "@/lib/threads/tranformSpabaseData";
import { useEffect, useState } from "react";
import { Thread } from "@/lib/threads/types";
import { useParams } from "next/navigation";
import ThreadAndCommentTree from "@/app/components/ThreadAndCommentTree";

const getAndTransformComments = async (
  threadId: number,
  setTransformedData: React.Dispatch<React.SetStateAction<Thread | null>>
) => {
  // Assuming you want to get the first page of threads
  const threadFromSupabae = await getThreadFromSupabase(threadId);
  const commentsFromSupabase = await getCommentsFromSupabase(Number(threadId));

  if (commentsFromSupabase && threadFromSupabae) {
    setTransformedData(
      transformSupabaseData(threadFromSupabae, commentsFromSupabase)
    );
  }
};
const Page = () => {
  const params = useParams();
  const [transformedData, setTransformedData] = useState<Thread | null>(null);

  useEffect(() => {
    const { id } = params;
    const threadId = parseInt(id as string, 10);
    getAndTransformComments(threadId, setTransformedData);
  }, [params, setTransformedData]);

  return (
    <main className="flex  flex-col items-centerjustify-center  mx-auto ">
      <h1 className="text-4xl font-bold  mt-0 mb-5 w-full z-100 text-center">
        Anonymous Bulletin Board
      </h1>
      <ThreadAndCommentTree
        thread={transformedData}
        // height={window.innerHeight}
      />
    </main>
  );
};

export default Page;
