"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AnonymousBulletinBoard = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(`/1`);
  });

  return (
    <main
      style={{
        height: "100vh",
      }}
      className="flex  flex-col items-center justify-between  p-24 mx-auto "
    >
      <h1
        style={{
          height: `calc(100vh * (1 / 5))`,
        }}
        className="text-4xl font-bold mb-20 mx-auto mt-0  w-5/5 z-100"
      >
        Anonymous Bulletin Board
      </h1>
    </main>
  );
};

export default AnonymousBulletinBoard;
