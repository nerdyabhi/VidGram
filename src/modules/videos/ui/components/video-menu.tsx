import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ListPlusIcon, MoreVertical, MoreVerticalIcon, ShareIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

interface VideoMenuProps {
    videoId: string;
    variant?: "ghost" | "secondary";
    onRemove?: () => void;
}


export const VideoMenu = ({ videoId, variant, onRemove }: VideoMenuProps) => {
    const onShare = () => {
        const fullUrl = `${process.env.VERCEL_URL || "http://localhost:3000"}/videos/${videoId}`
        navigator.clipboard.writeText(fullUrl);
        toast.success("Link copied to clipboard");
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={variant} size='icon' className="rounded-full cursor-pointer">
                    <MoreVerticalIcon />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" onClick={(e) => onShare()}>
                <DropdownMenuItem>
                    <ShareIcon />
                    Share
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <ListPlusIcon />
                    Add to Playlist
                </DropdownMenuItem>

                {onRemove && <DropdownMenuItem>
                    <Trash2Icon />
                    Remove
                </DropdownMenuItem>}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}