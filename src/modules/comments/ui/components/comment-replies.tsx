import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { Loader2Icon, CornerDownRightIcon } from 'lucide-react';
import { CommentItem } from "./comment-item";
import { Button } from "@/components/ui/button";
interface CommentRepliesProps {
    parentId: string;
    videoId: string;
}

export const CommentReplies = ({ parentId, videoId }: CommentRepliesProps) => {

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = trpc.comments.getMany.useInfiniteQuery({
        limit: DEFAULT_LIMIT,
        videoId,
        parentId,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })
    return (
        <div className='pl-14'>
            <div className="flex flex-col gap-4 mt-2">
                {isLoading && (
                    <div>
                        <Loader2Icon className='size-6 animate-spin text-muted-fore' />
                    </div>
                )}

                {!isLoading && data?.pages
                    .flatMap((page) =>
                        page.items.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} variant='reply' />
                        ))
                    )
                }

                {hasNextPage && (
                    <Button variant='ghost' size='sm'
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        <CornerDownRightIcon />
                        Show more replies
                    </Button>
                )}
            </div>
        </div>
    )
}