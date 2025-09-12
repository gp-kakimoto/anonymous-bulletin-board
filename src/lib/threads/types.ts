import type { Tables } from "@/../../types/supabase";

type SupabaseThread = Tables<"threads">;
type SupabaseComment = Tables<"comments">;

/**
 * SupabaseThread型にcommentsプロパティを追加した型
 */
type Thread = SupabaseThread & { comments: Comment[] };
type Comment = SupabaseComment & { replies: Comment[] };

export type { Thread, Comment,SupabaseThread,SupabaseComment };
export const MAX_HIERARCHY_LEVEL = 2; // Maximum hierarchy level for comments コメントの階層の深さを決定する変数
// You can adjust this value to control how deep the comment nesting can go.
export const THREAD_CONTENT_LENGTH = 25;

export const THREADS_PER_PAGE = 10; // Number of threads displayed per page