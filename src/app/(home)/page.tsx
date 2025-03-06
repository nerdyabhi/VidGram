import { Button } from "@/components/ui/button"
import { trpc } from "@/trpc/client";
import Image from "next/image";



export default function Home() {
  const { data } = trpc.hello.useQuery({ text: "Hello Abhi !" });
  return (

    <div className="p-10">
      Data is : {data?.greeting}
    </div>
    // <div className="flex cursor-pointer text-white hover:border-amber-400 group-hover:text-cyan-300 shadow-2xl shadow-white hover:shadow-amber-300 items-center justify-center h-[100vh] w-full bg-neutral-950">
    //   <h1 className="text-red-white group-hover:border hover:text-black hover:bg-amber-200 border-2 p-4 rounded-xl px-8 text-lg">Hello world</h1>
    //   <Button className="hover:bg-white hover:text-black">Click me</Button>
    //   <Image className="hover:scale-110 drop-shadow-2xl" src="logo.svg" width={50} height={50} alt="image" />
    // </div>
  );
}
