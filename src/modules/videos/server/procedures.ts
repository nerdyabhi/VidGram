import { db } from "@/db";
import { users, videos, videoSelectSchema, videoUpdateSchema, videoViews } from "@/db/schema";
import { z } from "zod";
import { DEFAULT_LIMIT } from "@/constants";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { mux } from "@/lib/mux";
import { and, eq, getTableColumns } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
import { VideoViews } from "@mux/mux-node/resources/data/video-views.mjs";

export const videosRouter = createTRPCRouter({

    getOne: baseProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {

            const [existingVideo] = await db
                .select({
                    ...getTableColumns(videos),
                    user: {
                        ...getTableColumns(users),
                    },
                    viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id))
                })
                .from(videos)
                .where(eq(videos.id, input.id))
                .innerJoin(users, eq(videos.userId, users.id));

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
                const utapi = UTApi();
                await utapi.deleteFile(existingVideo.thumbnailKey);
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