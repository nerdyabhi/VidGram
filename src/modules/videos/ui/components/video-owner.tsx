"use client"
import Link from "next/link";
import { VideoGetOneOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { UseSubscription } from "@/modules/subscriptions/hooks/use-subscription";

interface VideoOwnerProps {
    user: VideoGetOneOutput['user'];
    videoId: string;
}

export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {

    const { userId } = useAuth();
    const { isPending, onClick } = UseSubscription({
        userId: user.id,
        isSubscribed: user.viewerSubscribed,
        fromVideoId: videoId,
    })


    return (
        <div className="flex items-ceter sm:items-start justify-between sm:justify-start gap-3">
            <Link href={`/users/${user.id}`}>
                <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar size='lg' imageUrl={user.imageUrl} name={user.name} />
                    <div className="flex flex-col gap-1 min-w-0">
                        <UserInfo size='lg' name={user.name} />
                        <div className="text-sm text-muted-foreground line-clamp-1">
                            {user.subscriberCount}  {user.subscriberCount > 1 ? 'Subscribers' : 'Subscriber'}
                        </div>
                    </div>
                </div>
            </Link>
            {userId === user.clerkId ? (
                <Button variant={'secondary'} className="rounded-full">
                    <Link href={`/studio/videos/${videoId}`}>
                        Edit Video
                    </Link>
                </Button>
            ) : <SubscriptionButton onClick={onClick} disabled={isPending} isSubscribed={user.viewerSubscribed} />}

        </div>
    )
}


