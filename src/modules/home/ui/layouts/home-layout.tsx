
import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeNavbar } from "../components/home-navbar";
interface HomeLayoutProps {
    children: React.ReactNode;
}



export const HomeLayout = ({ children }: HomeLayoutProps) => {
    return (
        <SidebarProvider>
            <div className="w-full">
                <HomeNavbar/>
                <div className="bg-blue-400 p-4 text-white shadow-xl">
                    <p>Home Navbar</p>
                </div>
                {children}
            </div>
        </SidebarProvider>
    )
}

