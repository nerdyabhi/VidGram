import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"

export const HomeNavbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50">
            <div className="flex items-center gap-4 w-full">
                <SidebarTrigger />
                <Link href="/">
                    <div className="flex items-center gap-2">
                        <Image src="/logo.svg" alt="logo" width={32} height={32} />
                        <p className="text-xl font-semibold tracking-tight">VidGram</p>
                    </div>
                </Link>
            </div>
        </nav>
    )
}
