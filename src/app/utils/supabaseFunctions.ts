'use client';

import { createSupabaseBrowserClient } from '@/../../utils/supabase/client'; // 適切なパスに修正
//import { TablesInsert } from '@/../../types/supabase'; // 生成された型定義をインポート

const getMaxThreadId = async (): Promise<number | null> => {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase
    .from('threads') // テーブル名に置き換える
    .select('id') // idカラムのみを選択
    .order('id', { ascending: false }) // idを降順にソート
    .limit(1) // 最初の1件だけ取得
    .single(); // 単一の行を期待

  if (error) {
    console.error('IDの最大値の取得に失敗しました:', error);
    return null;
  }

  // dataがnullの場合もあるためチェック
  if (data && data.id) {
    return data.id;
  }
  return null;
};

const getThreadsFromSupabase = async (threadsIndex:number
)=>{
const supabase = createSupabaseBrowserClient();
  const maxId = await getMaxThreadId();
  if(maxId !==null){
    //const tmp = maxId < (10+threadsIndex*10)?maxId:(10+threadsIndex*10);
    const tmp = maxId - threadsIndex*10>0? maxId-threadsIndex*10:maxId;
    const tmp2 = tmp -10>0 ? tmp -10+1 : 1;
  const { data, error } = await supabase
    .from('threads')
    .select('*')
    .order('id', { ascending: false }) // idを降順にソート
    .gte('id', tmp2) // IDが1以上
    .lte('id', tmp); // IDが10以下
    

  if (error) {
    console.error('ID範囲でのデータ取得に失敗しました:', error);
    return null;
  }
  return data;
}
  return null;
};

export { getMaxThreadId,getThreadsFromSupabase};

/*

const createNewComment= async(
  threadId: number,
  parentId: string | null, // 親コメントがない場合はnull
  hierarchyLevel: number, // スレッドからの階層レベル (子コメントは1, 孫コメントは2)
  userName: string,
  commentText: string,
  ipAddress: string
) => {
  const supabase = createSupabaseBrowserClient();

  // サニタイズとバリデーション (補足8の要件に基づく)
  // ユーザー名
  if (!userName.trim()) {
    return { error: 'ユーザー名は必須です。' };
  }
  if (userName.length > 20) {
    return { error: 'ユーザー名は20文字以内である必要があります。' };
  }
  const prohibitedUserNames = ["admin", "管理者", "運営"];
  if (prohibitedUserNames.some(name => userName.toLowerCase() === name)) {
    return { error: 'そのユーザー名は使用できません。' };
  }
  // コメント本文
  if (!commentText.trim()) {
    return { error: 'コメント内容は必須です。' };
  }
  if (commentText.length > 1000) {
    return { error: 'コメント内容は1000文字以内である必要があります。' };
  }

  // 階層の制限チェック (ひ孫コメントはつけられないため、hierarchy_levelは最大2) [cite: 7]
  if (hierarchyLevel > 2) {
    return { error: 'これ以上深い階層のコメントは投稿できません。' };
  }

  const newComment: TablesInsert<'comments'> = {
    thread_id: threadId,
    parent_id: parentId,
    hierarchy_level: hierarchyLevel,
    user_name: userName,
    comment_text: commentText,
    ip_address: ipAddress, // IPアドレスはサーバーサイドで取得し、安全に渡すことを推奨
    is_hidden: false, // デフォルトで表示
  };

  const { data, error } = await supabase
    .from('comments')
    .insert(newComment)
    .select(); // 挿入されたデータを返します

  if (error) {
    console.error('コメント作成中にエラーが発生しました:', error);
    return { error: error.message };
  }

  return { data: data[0] }; // 挿入されたコメント情報を返す
}

export {createNewComment};
*/
