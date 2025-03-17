import { eq } from "drizzle-orm";
import { VideoAssetCreatedWebhookEvent, VideoAssetDeletedWebhookEvent, VideoAssetErroredWebhookEvent, VideoAssetReadyWebhookEvent, VideoAssetTrackReadyWebhookEvent } from '@mux/mux-node/resources/webhooks'
import { headers } from "next/headers";
import { mux } from '@/lib/mux'
import { db } from "@/db";
import { videos } from "@/db/schema";

const SIGNIN_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type WebhookEvent = VideoAssetCreatedWebhookEvent | VideoAssetErroredWebhookEvent | VideoAssetReadyWebhookEvent | VideoAssetTrackReadyWebhookEvent | VideoAssetDeletedWebhookEvent;

export const POST = async (request: Request) => {
    if (!SIGNIN_SECRET) {
        throw new Error("MUX Webhook secret is not set");
    }

    const headersPayload = await headers();
    const muxSignature = headersPayload.get("mux-signature");
    if (!muxSignature) {
        return new Response("No Signature found", { status: 401 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    mux.webhooks.verifySignature(
        body,
        {
            "mux-signature": muxSignature,
        },
        SIGNIN_SECRET,
    );

    switch (payload.type as WebhookEvent["type"]) {
        case "video.asset.created": {
            const data = payload.data as VideoAssetCreatedWebhookEvent["data"];


            if (!data.upload_id) {
                return new Response("NO upload Id found ", { status: 400 })
            }

            await db
                .update(videos)
                .set({
                    muxAssetId: data.id,
                    muxStatus: data.status,
                    // duration: data.duration,
                })
                .where(eq(videos.muxUploadId, data.upload_id));
            break;
        }

        case "video.asset.ready": {
            const data = payload.data as VideoAssetReadyWebhookEvent["data"];

            const playbackId = data.playback_ids?.[0].id;

            if (!playbackId) {
                return new Response("Missing Playback id", { status: 400 });
            }

            if (!data.upload_id) {
                return new Response("Missing Upload id", { status: 400 });
            }


            const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
            const preview_url = `https://image.mux.com/${playbackId}/animated.gif`
            const duration = data.duration ? Math.round(data.duration) : 0;

            await db
                .update(videos)
                .set({
                    muxStatus: data.status,
                    muxPlaybackId: playbackId,
                    muxAssetId: data.id,
                    thumbnailUrl,
                    previewUrl: preview_url,
                    duration,

                })
                .where(eq(videos.muxUploadId, data.upload_id));

            break;

        }

        case "video.asset.errored": {
            const data = payload.data as VideoAssetErroredWebhookEvent["data"];

            if (!data.upload_id) {
                return new Response("Missing Upload id", { status: 400 });
            }

            await db
                .update(videos)
                .set({
                    muxStatus: data.status
                })
                .where(eq(videos.muxUploadId, data.upload_id));
            break;
        }

        case "video.asset.deleted": {
            const data = payload.data as VideoAssetDeletedWebhookEvent["data"];

            if (!data.upload_id) {
                return new Response("Missing upload id", { status: 400 });
            }

            await db
                .delete(videos)
                .where(eq(videos.muxUploadId, data.upload_id));
            break;
        }

        case "video.asset.track.ready": {
            const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
                asset_id: string;
            }
            console.log("Track Ready! ");

            const assetId = data.asset_id;
            const trackId = data.id;
            const status = data.status;

            if (!assetId) {
                return new Response("Missing Asset id : ", { status: 400 });
            }

            await db.update(videos).set({
                muxTrackId: trackId,
                muxTrackStatus: status,
            })


        }


    }


    return new Response("Webhook recieved : ", { status: 200 });
}