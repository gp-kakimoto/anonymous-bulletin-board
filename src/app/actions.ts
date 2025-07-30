"use server";
import { createSupabaseServerClient } from "../../utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import DOMPurify from "isomorphic-dompurify";

// threadとcommentを書き込むためのファンクションたち
// commentに関するファンクションは現在作成中

//import { MAXHIERARCHYLEVEL } from "@/lib/threads/types";
/*
interface PostCommentPayload {
  userName: string;
  content: string;
  threadId: number;
  parentId?: string; // Optional for top-level comments [cite: 14]
  hierarchyLevel: number;
}
*/
interface PostThreadPayload {
  userName: string;
  content: string;
}


const validateFunctionForNameAndContent = (
  userName: FormDataEntryValue | null,
  content: FormDataEntryValue | null
) => {
  // ユーザー名のバリデーション
  if (typeof userName !== "string" || userName.trim().length === 0) {
    throw new Error("ユーザー名は必須です。");
  }
  if (userName.length > 20) {
    // [cite: 25]
    throw new Error("ユーザー名は 20 文字以内にしてください。");
  }
  // 予約語の禁止(例)
  const forbiddenUserNames = ["admin", "管理者", "運営","管理人","管理"];
  if (forbiddenUserNames.includes(userName.toLowerCase())) {
    throw new Error("そのユーザー名は使用できません。");
  }
  // コメント本文のバリデーション
  if (typeof content !== "string" || content.trim().length === 0) {
    throw new Error("コメントは必須です。");
  }
  if (content.length > 1000) {
    throw new Error("コメントは 1000 文字以内にしてください。");
  }
};

const validateThreadInput = (data: FormData): PostThreadPayload => {
  const userName = data.get("userName");
  const content = data.get("content");

  try {
    validateFunctionForNameAndContent(userName, content);
  } catch (Error: unknown) {
    throw Error;
  }

  return {
    userName: userName as string,
    content: content as string,
  };
};
/*
const validateCommentInput = (data: FormData): PostCommentPayload => {
  const userName = data.get("userName");
  const content = data.get("content");
  const threadId = data.get("threadId");
  const parentId = data.get("parentId");
  const hierarchyLevel = data.get("hierarchyLevel");
  // ユーザー名のバリデーション
  if (typeof userName !== "string" || userName.trim().length === 0) {
    throw new Error("ユーザー名は必須です。");
  }
  if (userName.length > 20) {
    // [cite: 25]
    throw new Error("ユーザー名は 20 文字以内にしてください。");
  }
  // 予約語の禁止(例)
  const forbiddenUserNames = ["admin", "管理者", "運営","管理人","管理"];
  if (forbiddenUserNames.includes(userName.toLowerCase())) {
    throw new Error("そのユーザー名は使用できません。");
  }
  // コメント本文のバリデーション
  if (typeof content !== "string" || content.trim().length === 0) {
    throw new Error("コメントは必須です。");
  }
  if (content.length > 1000) {
    throw new Error("コメントは 1000 文字以内にしてください。");
  }

  const parsedThreadId = parseInt(threadId as string, 10);
  if (isNaN(parsedThreadId)) {
    throw new Error("スレッドIDが不正です。");
  }
  // 階層レベルのバリデーション
  const parsedHierarchyLevel = parseInt(hierarchyLevel as string, 10);
  if (
    isNaN(parsedHierarchyLevel) ||
    (parentId && parsedHierarchyLevel >= MAXHIERARCHYLEVEL) ||
    (!parentId && parsedHierarchyLevel !== 1)
  ) {
    throw new Error("階層レベルが不正です。");
  }
  return {
    userName: userName,
    content: content,
    parentId: parentId ? String(parentId) : undefined,
    threadId: parsedThreadId,
    hierarchyLevel: parsedHierarchyLevel,
  };
};
*/

const postThread = async (formData: FormData) => {
  try {
    const { userName, content } = validateThreadInput(formData);
    const sanitizedUserName = DOMPurify.sanitize(userName);
    const sanitizedContent = DOMPurify.sanitize(content);
    const cookieStore = await cookies();

    const supabase = await createSupabaseServerClient();
    //IP　アドレスの取得
    const forwardedForHeader = cookieStore
      .getAll()
      .find((header) => header.name === "x-forwrded-for");
    const forwardedFor = forwardedForHeader?.value;
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : "127.0.0.1"; //Vercel などデプロイ環境考慮
    // データベースへのINSERT 処理
    const { error } = await supabase.from("threads").insert({
      user_name: sanitizedUserName,
      content: sanitizedContent,
      ip_address: ipAddress,
      is_hidden: false,
    });
    if (error) {
      console.error("スレッド投稿エラー:", error);
      throw new Error("スレッドの投稿に失敗しました。");
    }
    // 投稿後、該当スレッドページを再検証して UI を更新
    revalidatePath(`/`);
    return { success: true};
  } catch (e: unknown) {

    let errorMessage = "不明なエラーが発生しました。";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    return { error: errorMessage }; // クライアントにエラーを返す
  }
};
/*
const postComment = async (formData: FormData) => {
  try {
    const { userName, content, parentId, hierarchyLevel, threadId } =
      validateCommentInput(formData);
    // サニタイズ
    const sanitizedUserName = DOMPurify.sanitize(userName);
    const sanitizedContent = DOMPurify.sanitize(content);
    const cookieStore = await cookies();

    const supabase = await createSupabaseServerClient();
    // IP アドレスの取得
    const forwardedForHeader = cookieStore
      .getAll()
      .find((header) => header.name === "x-forwarded-for");
    const forwardedFor = forwardedForHeader?.value;
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : "127.0.0.1"; //Vercel などデプロイ環境考慮
    // データベースへの INSERT 処理
    const { error } = await supabase.from("comments").insert({
      user_name: sanitizedUserName,
      comment_text: sanitizedContent,
      parent_id: parentId, // NULL 許容
      hierarchy_level: hierarchyLevel,
      ip_address: ipAddress,
      thread_id: threadId,
      // thread_id: ... (スレッド ID はフォームから渡すか、パスパラメータから取得)
    });
    if (error) {
      console.error("コメント投稿エラー:", error);
      throw new Error("コメントの投稿に失敗しました。");
    }
    // 投稿後、該当スレッドページを再検証して UI を更新
    revalidatePath(`${formData.get("threadId")}`); // threadId も formData から取得するなどする
  } catch (e: unknown) {
    let errorMessage = "不明なエラーが発生しました。";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    return { error: errorMessage }; // クライアントにエラーを返す
  }
};
*/
//export { postComment, postThread };
export {  postThread };
