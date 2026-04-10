import { createSupabaseServerClient } from "../../../utils/supabase/server";
import { SupabaseThread, THREADS_PER_PAGE } from "@/lib/threads/types";
const getThreadsFromSupabase = async (threadsIndex:number
)=>{
const supabase = await createSupabaseServerClient();
  // threadsIndexを使用して、データを取得
  console.time('getThreadsFromSupabase');
  const { data, error } = await supabase
    .from('threads')
    .select('*')
    .order('latest_activity_at', { ascending: false }) // latest_activity_atを降順にソート
    .range(0+(threadsIndex-1)*THREADS_PER_PAGE,(threadsIndex)*THREADS_PER_PAGE-1);
  console.timeEnd('getThreadsFromSupabase');
    
    if (error) {
      console.error('ID範囲でのデータ取得に失敗しました:', error);
      return null;
    }
    return data;
};

const getThreadAndCommentsFromSupabase = async (threadId:number) => {
  const supabase = await createSupabaseServerClient();
  console.time('getThreadAndCommentsFromSupabase');
const { data, error } = await supabase
    .from('threads')
    .select(`
      id, user_name, content, ip_address, updated_at, created_at, is_hidden, latest_activity_at,
      comments (*) 
    `)
    .eq('id', threadId)
    .order('created_at', { foreignTable: 'comments', ascending: true })
    .single();
  console.timeEnd('getThreadAndCommentsFromSupabase');
  if(error){
    console.error('スレッドデータ取得に失敗しました:', error);
    return null;
  }
  return data;
};

  


const getThreadFromSupabase = async (threadId:number): Promise<SupabaseThread| null> =>{
  const supabase = await createSupabaseServerClient();
console.time('getThreadFromSupabase');
  const { data, error } = await supabase
    .from('threads')
    .select('*')
   // .select('id, user_name, content, is_hidden,created_at, updated_at') // 必要なカラムのみを選択
    .eq('id', threadId)
    .single(); // 単一のスレッドを取得
console.timeEnd('getThreadFromSupabase');

  if (error) {
    console.error('スレッドデータ取得に失敗しました:', error);
    return null;
  }
  return data;
}


const getCommentsFromSupabase = async (threadId:number
)=>{
const supabase = await createSupabaseServerClient();
console.time('getCommentsFromSupabase');
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('thread_id',threadId)
    .order('created_at', { ascending: false }); // idを降順にソート
    
console.timeEnd('getCommentsFromSupabase');
  if (error) {
    console.error('コメントデータ取得に失敗しました:', error);
    return null;
  }
  return data;
};



export {getThreadFromSupabase,getThreadsFromSupabase,getCommentsFromSupabase,getThreadAndCommentsFromSupabase};