"use client";
import { useRouter } from "next/navigation";
import Button from "./_components/Button";

function Page() {
  const router = useRouter();
  function moveBack() {
    router.back();
  }

  return (
    <div className="h-screen bg-[var(--color-grey-50)] flex items-center justify-center p-[4.8rem]">
      <div className="bg-[var(--color-grey-0)] border border-[var(--color-grey-100)] rounded-[var(--border-radius-md)] p-[4.8rem] flex-grow-0 flex-shrink basis-[96rem] items-center ">
        <h1 className="mb-[3.2rem]">
          The page you are looking for could not be found 😢
        </h1>
        <Button type="primary" onClick={moveBack}>
          &larr; Go back
        </Button>
      </div>
    </div>
  );
}

export default Page;
