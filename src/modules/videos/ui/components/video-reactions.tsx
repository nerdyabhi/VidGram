import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Separator } from "@radix-ui/react-separator";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"

import { VideoGetOneOutput } from "../../types";
import { useClerk } from "@clerk/nextjs";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";


interface VideoReactionsProps {
    videoId: string;
    likes: number;
    dislikes: number;
    viewerReaction: VideoGetOneOutput['viewerReaction'];
}

export const VideoReactions = ({ videoId, likes, dislikes, viewerReaction }: VideoReactionsProps) => {
    const clerk = useClerk();
    const utils = trpc.useUtils();

    const like = trpc.videoReactions.like.useMutation({

        onSuccess: () => {
            utils.vidoes.getOne.invalidate({ id: videoId });
            // Todo : invalidate liked playlist
        },
        onError: (error) => {
            toast.error("Something went wrong");
            if (error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            }
        }
    })

    const dislike = trpc.videoReactions.dislike.useMutation({
        onSuccess: () => {
            utils.vidoes.getOne.invalidate({ id: videoId });
            // Todo : invalidate liked playlist
        },
        onError: (error) => {
            toast.error("Something went wrong");
            if (error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            }
        }
    })

    return (
        <div className="flex items-center flex-none">
            <Button
                disabled={like.isPending || dislike.isPending}
                onClick={() => {
                    like.mutate({ videoId });
                }}
                variant={'secondary'}
                className="rounded-l-full cursor-pointer rounded-r-none gap-2 pr-4">
                <ThumbsUpIcon className={cn('size-5', viewerReaction !== 'like' && "fill-black")} />
                {likes}
            </Button>

            <Separator orientation="vertical" className="h-7" />
            <Button
                onClick={() => {
                    dislike.mutate({ videoId });
                }}
                disabled={like.isPending || dislike.isPending}
                variant={'secondary'} className="rounded-l-none cursor-pointer rounded-r-full pl-3 pr-4">
                <ThumbsDownIcon className={cn('size-5', viewerReaction === 'dislike' && "fill-black")} />
                {dislikes}
            </Button>
        </div>
    )
}