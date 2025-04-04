"use client"

import { UserAvatar } from "@/components/user-avatar";
import { CommentGetManyOutput } from "../../types";
import Link from "next/link";
import { eachMonthOfInterval, formatDistanceToNow } from "date-fns";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MessageSquareIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
interface CommentItemProps {
    comment: CommentGetManyOutput[number];
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

    console.log(userId);
    console.log(comment)

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
