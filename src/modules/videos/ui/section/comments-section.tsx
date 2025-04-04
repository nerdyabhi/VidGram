"use client"

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { CommentForm } from "@/modules/comments/ui/components/comment-form";
import { CommentItem } from "@/modules/comments/ui/components/comment-item";
import { trpc } from "@/trpc/client"
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Skeleton } from "@/components/ui/skeleton"

interface CommentsSectionProps {
    videoId: string;
}



export const CommentsSection = ({ videoId }: CommentsSectionProps) => {
    return (
        <Suspense fallback={<CommentSkelton />}>
            <ErrorBoundary fallback={<p>Error..</p>}>
                <CommentsSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    )
}


export const CommentSkelton = () => {
    return (
        <div className="mt-6 space-y-4">
            {/* Comments count and form skeleton */}
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full" />

            {/* Comment items skeleton */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                    {/* Avatar skeleton */}
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                        {/* Username skeleton */}
                        <Skeleton className="h-4 w-32" />
                        {/* Comment text skeleton */}
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>
            ))}
        </div>
    )
}

const CommentsSectionSuspense = ({ videoId }: CommentsSectionProps) => {
    const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery({
        videoId,
        limit: DEFAULT_LIMIT
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })
    return (
        <div className="mt-6">
            <div className="flex flex-col gap-6">
                <h1>{comments.pages[0].items[0].totalCount} Comments</h1>
                <CommentForm videoId={videoId} />
                {comments.pages.flatMap((page) => page.items).map(comment => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}

                <InfiniteScroll
                    hasNextPage={query.hasNextPage}
                    isFetchingNextPage={query.isFetchingNextPage}
                    fetchNextPage={query.fetchNextPage}
                />

            </div>
        </div >
    )
}


