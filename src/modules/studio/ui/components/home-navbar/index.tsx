import { SidebarTrigger } from "@/components/ui/sidebar"
import { SearchInput } from "./search-input"
import { AuthButton } from "@/modules/auth/ui/components/auth-button"
import Link from "next/link"
import Image from "next/image"
import { StudioUploadModal } from "../studio-upload-modal"


export const StudioNavbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50 w-full">
            <div className="flex items-center gap-4 w-full">
                <SidebarTrigger />

                <Link href="/">
                    <div className="flex items-center gap-2">
                        <Image src="/logo.svg" alt="logo" width={32} height={32} />
                        <p className="text-xl font-semibold tracking-tight">VidGram</p>
                    </div>
                </Link>
            </div>

            {/* Search Input */}
            <div className="flex-1  flex justify-center items-center max-w-[720px] mx-10">
                <SearchInput/>
            </div>

            <div className="flex-shrink-0 items-center flex gap-4">
            <StudioUploadModal/>
                <AuthButton/>
            </div>
        </nav>
    )
}
