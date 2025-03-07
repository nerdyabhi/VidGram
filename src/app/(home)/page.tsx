
import { Button } from "@/components/ui/button"
import { trpc, HydrateClient } from "@/trpc/server";
import Image from "next/image";
import { PageClient } from "./Client";
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary'

export default function Home() {
  void trpc.hello.prefetch({ text: "Abhi" });

  return (

    <div className="p-10">
      <HydrateClient>
        <Suspense fallback={<p>Loading...</p>}>
          <ErrorBoundary fallback={<p>Error....</p>}>
            {<PageClient />}
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>

    </div>
    // <div className="flex cursor-pointer text-white hover:border-amber-400 group-hover:text-cyan-300 shadow-2xl shadow-white hover:shadow-amber-300 items-center justify-center h-[100vh] w-full bg-neutral-950">
    //   <h1 className="text-red-white group-hover:border hover:text-black hover:bg-amber-200 border-2 p-4 rounded-xl px-8 text-lg">Hello world</h1>
    //   <Button className="hover:bg-white hover:text-black">Click me</Button>
    //   <Image className="hover:scale-110 drop-shadow-2xl" src="logo.svg" width={50} height={50} alt="image" />
    // </div>
  );
}
