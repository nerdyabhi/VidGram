"use client"

import { UserAvatar } from "@/components/user-avatar";
import { CommentGetManyOutput } from "../../types";
import Link from "next/link";
import { eachMonthOfInterval, formatDistanceToNow } from "date-fns";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MessageSquareIcon, MoreVerticalIcon, ThumbsDownIcon, ThumbsUpIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { cn } from "@/lib/utils";
interface CommentItemProps {
    comment: CommentGetManyOutput['items'][number];
}

export const CommentItem = ({ comment }: CommentItemProps) => {


    const clerk = useClerk();
    const { userId } = useAuth();
    const utils = trpc.useUtils();

    const remove = trpc.comments.remove.useMutation({
        onSuccess: () => {
            toast.success("Succesfully Deleted the comment");
            utils.comments.getMany.invalidate({ videoId: comment.videoId })
        },
        onError: (error) => {
            toast.error("Something Went Wrong");
            if (error?.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            }
        }
    })
    const like = trpc.commentReactions.like.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({ videoId: comment.videoId });
        },
        onError: (error) => {
            toast.error("Failed to like comment");
            if (error?.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            }
        }
    });

    const dislike = trpc.commentReactions.dislike.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({ videoId: comment.videoId });
        },
        onError: (error) => {
            toast.error("Failed to dislike comment");
            if (error?.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            }
        }
    });

    console.log(comment);


    return (
        <div className="p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex gap-3">
                <Link
                    href={`/users/${comment.user.id}`}
                    className="flex-shrink-0 hover:opacity-80 transition-opacity"
                >
                    <UserAvatar
                        size='lg'
                        imageUrl={comment.user.imageUrl}
                        name={comment.user.name}
                    />
                </Link>

                <div className="flex-1 min-w-0">
                    <Link
                        href={`/users/${comment.userId}`}
                        className="hover:underline"
                    >
                        <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-sm truncate">
                                {comment.user.name}
                            </span>
                            <span className="text-xs text-gray-500">
                                {formatDistanceToNow(comment.createdAt, {
                                    addSuffix: true,
                                })}
                            </span>
                        </div>
                    </Link>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap break-words">
                        {comment.value}
                    </p>

                    {/* comment Reaction */}
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                            {/* Like Button */}

                            <Button
                                disabled={like.isPending}
                                variant={'ghost'}
                                size='icon'
                                className=" cursor-pointer flex items-center gap-1 h-8 px-2"
                                onClick={() => like.mutate({ commentId: comment.id })}
                            >
                                <ThumbsUpIcon className={
                                    cn(comment.viewerReaction === 'like' && 'fill-black',
                                        'h-4 w-4')
                                } />
                                <span className="text-xs text-muted-foreground">
                                    {comment.likeCount}
                                </span>
                            </Button>

                            {/* Dislike Button */}
                            <Button
                                disabled={dislike.isPending}
                                variant={'ghost'}
                                size='icon'
                                className=" cursor-pointer flex items-center gap-1 h-8 px-2"
                                onClick={() => dislike.mutate({ commentId: comment.id })}
                            >
                                <ThumbsDownIcon className={
                                    cn(comment.viewerReaction === "dislike" && 'fill-black',
                                        'h-4 w-4')
                                } />
                                <span className="text-xs text-muted-foreground">
                                    {comment.dislikeCount}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant='ghost' size='icon' className='size-8 cursor-pointer'>
                            <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="cursor-pointer font-semibold  " onClick={() => { }}>
                            <MessageSquareIcon size='4' /> Reply
                        </DropdownMenuItem>

                        {userId === comment.user.clerkId && (
                            <DropdownMenuItem className="cursor-pointer font-semibold text-red-500" onClick={() => { remove.mutate({ id: comment.id }) }}>
                                <Trash2Icon size='4' className='text-red-500' /> Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                {remove.isPending && <h1>Deleting comment...</h1>}
            </div>
        </div>

    );
}
