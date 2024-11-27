"use client";

import Button from "./_components/Button";

// Show error from frontend
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.log(error);
  return (
    <main className="flex h-screen justify-center items-center flex-col gap-6 mt-8">
      <h1 className="text-[3rem] font-semibold">Something went wrong!</h1>
      <p className="text-[1.8rem]">Please try again later.</p>

      <Button onClick={reset} type="primary">
        Try again!
      </Button>
    </main>
  );
}
