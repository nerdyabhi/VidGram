import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { MainSection } from "./main-section"
import { Separator } from "@/components/ui/separator"
import { PersonalSection } from "./personal-section"



export const HomeSideBar = () => {
    return (
        <Sidebar className="pt-16 z-40 border-none mt-10  ">
            <SidebarContent className="bg-background">
                <MainSection />
                <Separator />
                <PersonalSection />

            </SidebarContent>
        </Sidebar>
    )
}