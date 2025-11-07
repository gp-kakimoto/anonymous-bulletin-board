import type { Thread } from "@/lib/threads/types";
import type { Comment } from "@/lib/threads/types";
import type { SupabaseThread } from "@/lib/threads/types";
import type { SupabaseComment } from "@/lib/threads/types";
import { MAX_HIERARCHY_LEVEL } from "@/lib/threads/types";
/**
 * Transforms flat thread and comment data into a hierarchical list structure.
 *
 * @param threadsData Raw thread data from Supabase.
 * @param commentsData Raw comment data from Supabase.
 * @returns An array of Thread objects with nested comments.
 */

function transformSupabaseData(
  threadData: SupabaseThread,
  commentsData:SupabaseComment[]
): Thread {
  const threadsMap = new Map<number, Thread>();

  // Initialize threads with basic data and an empty comments array
  //threadData.forEach((thread) => { 
    threadsMap.set(threadData.id, {
      ...threadData,
      comments: [], // Initialize comments array
    });
  //});

  // Create a map for quick access to comments by their ID
  const commentsMap = new Map<string, Comment>();
  commentsData.forEach((comment) => {
    commentsMap.set(comment.id, {
      ...comment,
      replies: [], // Initialize replies array for potential grandchildren
    });
  });
  
  // Populate the hierarchical structure
  commentsData.forEach((commentData) => {
    const comment = commentsMap.get(commentData.id);
    if (!comment) return;

    if (comment.hierarchy_level === 1) {
      // This is a child comment
      const parentThread = threadsMap.get(comment.thread_id);
      if (parentThread) {
        parentThread.comments?.push(comment);
      }
    } else if (comment.hierarchy_level !== null  && comment.hierarchy_level <= MAX_HIERARCHY_LEVEL && comment.parent_id) {
      // This is a grandchild comment
      const parentComment = commentsMap.get(comment.parent_id);
      if (parentComment && parentComment.replies) {
        parentComment.replies.push(comment);
      }
    }
  });
  

  return Array.from(threadsMap.values())[0];
}

export { transformSupabaseData };