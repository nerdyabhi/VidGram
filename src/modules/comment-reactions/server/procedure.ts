import { commentReactions } from "@/db/schema";
import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from 'zod';
import { eq, and } from "drizzle-orm";


export const commentReactionRouter = createTRPCRouter({
    like: protectedProcedure.
        input(z.object({ commentId: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            const { commentId } = input;
            const { id: userId } = ctx.user;

            const [existingCommentReaction] = await db
                .select()
                .from(commentReactions)
                .where(
                    and(
                        eq(commentReactions.commentId, commentId),
                        eq(commentReactions.userId, userId),
                        eq(commentReactions.type, 'like')
                    )
                )

            if (existingCommentReaction) {
                const [deletedViewerReaction] = await db
                    .delete(commentReactions)
                    .where(
                        and(
                            eq(commentReactions.userId, userId),
                            eq(commentReactions.commentId, commentId),
                        )
                    ).returning()

                return deletedViewerReaction;
            }

            const [createdCommentReaction] = await db
                .insert(commentReactions)
                .values({ userId, commentId, type: 'like' })
                .onConflictDoUpdate({
                    target: [commentReactions.userId, commentReactions.commentId],
                    set: {
                        type: 'like'
                    }
                })
                .returning();
            return createdCommentReaction
        }),

    dislike: protectedProcedure.
        input(z.object({ commentId: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            const { commentId } = input;
            const { id: userId } = ctx.user;

            const [existingCommentReaction] = await db
                .select()
                .from(commentReactions)
                .where(
                    and(
                        eq(commentReactions.commentId, commentId),
                        eq(commentReactions.userId, userId),
                        eq(commentReactions.type, 'dislike')
                    )
                )

            if (existingCommentReaction) {
                const [deletedViewerReaction] = await db
                    .delete(commentReactions)
                    .where(
                        and(
                            eq(commentReactions.userId, userId),
                            eq(commentReactions.commentId, commentId),
                        )
                    ).returning()

                return deletedViewerReaction;
            }

            const [createdVideoReaction] = await db
                .insert(commentReactions)
                .values({ userId, commentId, type: 'dislike' })
                .onConflictDoUpdate({
                    target: [commentReactions.userId, commentReactions.commentId],
                    set: {
                        type: 'dislike'
                    }
                })
                .returning();
            return createdVideoReaction;
        })

})