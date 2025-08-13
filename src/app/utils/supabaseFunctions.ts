'use client';

import { createSupabaseBrowserClient } from '@/../../utils/supabase/client'; // 適切なパスに修正


const getMaxThreadId = async (): Promise<number | null> => {
  const supabase = createSupabaseBrowserClient();

  const { count, error } = await supabase
    .from('threads') // テーブル名に置き換える
    .select('*', { count: 'exact' });
  // countを取得するためのクエリ

  if (error) {
    console.error('IDの最大値の取得に失敗しました:', error);
    return null;
  }
  return count;
};

const getThreadFromSupabase = async (threadId:number) =>{
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from('threads')
    .select('*')
    .eq('id', threadId)
    .single(); // 単一のスレッドを取得

  if (error) {
    console.error('スレッドデータ取得に失敗しました:', error);
    return null;
  }
  return data;
}

const getThreadsFromSupabase = async (threadsIndex:number
)=>{
const supabase = createSupabaseBrowserClient();
  // threadsIndexを使用して、データを取得
  const { data, error } = await supabase
    .from('threads')
    .select('*')
    .order('latest_activity_at', { ascending: false }) // latest_activity_atを降順にソート
    .range(0+threadsIndex*10,threadsIndex*10+9);
    
    
    
    if (error) {
      console.error('ID範囲でのデータ取得に失敗しました:', error);
      return null;
    }
    return data;
};




const getCommentsFromSupabase = async (threadId:number
)=>{
const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('thread_id',threadId)
    .order('created_at', { ascending: false }); // idを降順にソート
    

  if (error) {
    console.error('コメントデータ取得に失敗しました:', error);
    return null;
  }
  return data;

 // return null;
};


export { getMaxThreadId,getThreadsFromSupabase,getCommentsFromSupabase,getThreadFromSupabase};
