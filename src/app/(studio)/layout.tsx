import { StudioLayout } from "@/modules/studio/ui/layouts/studio-layout";
import { TRPCProvider } from "@/trpc/client";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <TRPCProvider>
            <StudioLayout>
                {children}
            </StudioLayout>
        </TRPCProvider>

    )
}

export default Layout