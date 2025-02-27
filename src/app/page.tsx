import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex cursor-pointer text-white hover:border-amber-400 group-hover:text-cyan-300 shadow-2xl shadow-white hover:shadow-amber-300 items-center justify-center h-[100vh] w-full bg-neutral-950">
      <h1 className="text-red-white group-hover:border hover:text-black hover:bg-amber-200 border-2 p-4 rounded-xl px-8 text-lg">Hello world</h1>
      <Button className="hover:bg-white hover:text-black">Click me</Button>

    </div>
  );
}
