//"use client";

//import { useState } from "react";
//import { cookies } from "next/headers";
import { redirect } from "next/navigation";
//import type { Database } from "../../../../types/supabase";
import { Logout } from "../components/Logout";
import { createSupabaseServerClient } from "../../../../utils/supabase/server";
//import { cookies } from "next/headers";

const AdminLogoutPage = async () => {
  //const router = useRouter();
  //const supabase = createSupabaseBrowserClient<Database>({ cookies }); // クライアントを初期化
  const supabase = await createSupabaseServerClient(); // クライアントを初期化
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("No user logged in, redirecting to login page.");
    redirect("/admin/login");
  }
  return <Logout />;
};

export default AdminLogoutPage;
