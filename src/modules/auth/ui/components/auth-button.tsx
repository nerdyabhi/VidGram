import { Button } from "@/components/ui/button";
import { UserCircleIcon } from "lucide-react";
import { UserButton ,SignInButton , SignedIn, SignedOut  } from "@clerk/nextjs";


export const AuthButton = ()=>{
    return (
        <> 

        <SignedIn>
            <UserButton/>
        </SignedIn>
        <SignedOut>
            <SignInButton mode="modal">
                {/* <UserButton/> */}
                <Button variant="outline"
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/2 shadow-none rounded-full"
                >
                    <UserCircleIcon/>
                    Sign in
                </Button>
            </SignInButton>
        </SignedOut>
        </>
    )
}