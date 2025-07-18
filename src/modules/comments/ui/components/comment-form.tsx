"use client"

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { commentInsertSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { useClerk, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface CommentFormProps {
    videoId: string;
    variant?: "comment" | "reply";
    parentId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const CommentForm = ({ videoId, parentId, onCancel, variant = "comment" }: CommentFormProps) => {
    const utils = trpc.useUtils();
    const clerk = useClerk();
    const { user } = useUser();

    const create = trpc.comments.create.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({ videoId });
            form.reset();
            toast.success("Comment added");
        },
        onError: (error) => {
            toast.error("Something went wrong..")
            console.log("Error ", error.message);

            if (error.data?.code == 'UNAUTHORIZED') {
                clerk.openSignIn();
            }
        }
    });

    const form = useForm<Omit<z.infer<typeof commentInsertSchema>, "userId">>({
        resolver: zodResolver(commentInsertSchema.omit({ userId: true })),
        defaultValues: {
            videoId,
            value: "",
            parentId,
        }
    })
    const handleSubmit = (values: Omit<z.infer<typeof commentInsertSchema>, "userId">) => {
        create.mutate({ ...values, parentId });
        form.reset();
    };

    const handleCancel = () => {
        form.reset();
        onCancel?.();
    }
    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex gap-4 group"
            >
                <UserAvatar size='lg' imageUrl={user?.imageUrl || '/placeholder.svg'} name={user?.username || "User"} />

                <div className="flex-1">
                    <FormField
                        name='value'
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder={
                                            variant === "reply" ?
                                                "Reply to this Comment"
                                                : "Add a comment.."
                                        }
                                        className="resize-none bg-transparent overflow-hidden min-h-0"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="justify-end gap-2 mt-2">
                        {onCancel && (
                            <Button className="cursor-pointer" variant="ghost" type="button" onClick={() => handleCancel()}>
                                Cancel
                            </Button>
                        )}
                        <Button
                            className={`${create.isPending ? 'cursor-progress' : 'cursor-pointer'}`}
                            type='submit'
                            disabled={create.isPending}
                            size='sm'
                        >
                            {variant === "comment"
                                ? (create.isPending ? 'Commenting...' : 'Comment')
                                : (create.isPending ? 'Replying...' : 'Reply')}
                        </Button>
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}