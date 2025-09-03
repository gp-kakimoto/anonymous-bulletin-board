"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AnonymousBulletinBoard = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(`/1`);
  });

  return (
    <main className="flex  flex-col items-center justify-between  p-24 mx-auto ">
      <h1 className="text-4xl font-bold mx-auto mt-0  mb-10 w-full z-100">
        Anonymous Bulletin Board
      </h1>
    </main>
  );
};

export default AnonymousBulletinBoard;
