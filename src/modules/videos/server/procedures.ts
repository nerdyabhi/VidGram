import { db } from "@/db";
import { users, videos, videoUpdateSchema, videoViews, videoReactions, subscriptions } from "@/db/schema";
import { z } from "zod";
// import { DEFAULT_LIMIT } from "@/constants";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { mux } from "@/lib/mux";
import { and, eq, getTableColumns, inArray, isNotNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
// import { VideoViews } from "@mux/mux-node/resources/data/video-views.mjs";

export const videosRouter = createTRPCRouter({

    getOne: baseProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const { clerkUserId } = ctx;

            let userId;
            const [user] = await db
                .select()
                .from(users)
                .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []))

            if (user) {
                userId = user.id;
            }

            const viewerReactions = db.$with('viewer_reactions').as(
                db.select({
                    videoId: videoReactions.videoId,
                    type: videoReactions.type,
                }).from(videoReactions)
                    .where(inArray(videoReactions.userId, userId ? [userId] : []))
            )

            const viewerSubscriptions = db.$with("viewer_subscriptions").as(
                db.select()
                    .from(subscriptions)
                    .where(inArray(subscriptions.viewerId, userId ? [userId] : []))
            )


            const [existingVideo] = await db
                .with(viewerReactions, viewerSubscriptions)
                .select({
                    ...getTableColumns(videos),
                    user: {
                        ...getTableColumns(users),
                        viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean),
                        subscriberCount: db.$count(subscriptions, eq(subscriptions.creatorId, users.id))

                    },
                    viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
                    likeCount: db.$count(videoReactions,
                        and(
                            eq(videoReactions.videoId, videos.id),
                            eq(videoReactions.type, 'like'),
                        )),

                    dislikeCount: db.$count(videoReactions,
                        and(
                            eq(videoReactions.videoId, videos.id),
                            eq(videoReactions.type, 'dislike'),
                        )
                    ),
                    viewerReaction: viewerReactions.type


                })
                .from(videos)
                .innerJoin(users, eq(videos.userId, users.id))
                .leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
                .leftJoin(viewerSubscriptions, eq(viewerSubscriptions.creatorId, users.id))
                .where(eq(videos.id, input.id))
            // .groupBy(
            //     videos.id,
            //     users.id,
            //     viewerReactions.type,
            // )

            if (!existingVideo) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return existingVideo;
        }),

    restoreThumbnail: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const [existingVideo] = await db
                .select()
                .from(videos)
                .where(and(
                    eq(videos.id, input.id),
                    eq(videos.userId, userId)
                ));

            if (!existingVideo || !existingVideo.muxPlaybackId) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            if (existingVideo.thumbnailKey) {
                const utapi = new UTApi();
                await utapi.deleteFiles(existingVideo.thumbnailKey);
            }


            const thumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;

            const [updatedVideo] = await db
                .update(videos)
                .set({ thumbnailUrl })
                .where(and(
                    eq(videos.id, input.id),
                    eq(videos.userId, userId),
                )).returning();

            return { updatedVideo };

        }),
    create: protectedProcedure.mutation(async ({ ctx }) => {
        const { id: userId } = ctx.user;

        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: userId,
                playback_policy: ["public"],
                input: [
                    {
                        generated_subtitles: [
                            {
                                language_code: "en",
                                name: "English",
                            }
                        ]
                    }
                ]
            },
            cors_origin: "*" // Set to production url later,
        })

        const [video] = await db
            .insert(videos)
            .values({
                userId,
                title: "Untitled",
                muxStatus: "waiting",
                muxUploadId: upload.id,
            }).returning();

        return {
            video,
            url: upload.url
        }
    }),

    update: protectedProcedure
        .input(videoUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;

            if (!input.id) {
                throw new TRPCError({ code: 'BAD_REQUEST' })
            }

            const [updatedVideo] = await db
                .update(videos)
                .set({
                    title: input.title,
                    description: input.description,
                    categoryId: input.categoryId,
                    visibility: input.visibility,
                    updatedAt: new Date()
                }
                ).where(and(
                    eq(videos.id, input.id),
                    eq(videos.userId, userId),
                ))
                .returning();

            if (!updatedVideo) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            return updatedVideo;

        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;

            const [removedVideo] = await db
                .delete(videos).
                where(and(
                    eq(videos.id, input.id),
                    eq(videos.userId, userId),
                )).returning();

            if (!removedVideo) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }

            return removedVideo;

        })
})