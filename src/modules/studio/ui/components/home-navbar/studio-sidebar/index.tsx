import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
// import { MainSection } from "./main-section"
import { Separator } from "@/components/ui/separator"
// import { PersonalSection } from "./personal-section"
import { LogOutIcon, VideoIcon } from "lucide-react"
import Link from "next/link"
import { StudioSidebarHeader } from "./studio-sidebar-header"


export const StudioSidebar = () => {
    return (
        <Sidebar className="pt-16 z-40 transition-all duration-200 " collapsible="icon">
            <SidebarContent className="bg-background">
                <Separator />

                {/* Content Button */}
                <SidebarGroup>
                <SidebarMenu>
                    <StudioSidebarHeader />
                    <SidebarMenuItem >
                        <SidebarMenuButton  tooltip={"Exit Studio"} asChild>
                            <Link href="/studio/videos">
                                <VideoIcon className="size-5" />
                                <span className="text-sm">Content</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <Separator />

                    {/* Exit Button */}
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip={"Exit Studio"} asChild>
                            <Link href="/">
                                <LogOutIcon className="size-5" />
                                <span className="text-sm">Exit Studio</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>


                </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}