import { eq } from "drizzle-orm";
import {VideoAssetCreatedWebhookEvent , VideoAssetErroredWebhookEvent , VideoAssetReadyWebhookEvent, VideoAssetTrackReadyWebhookEvent} from '@mux/mux-node/resources/webhooks'
import { headers } from "next/headers";
import {mux} from '@/lib/mux'
import { db } from "@/db";
import { videos } from "@/db/schema";

const SIGNIN_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type WebhookEvent = VideoAssetCreatedWebhookEvent | VideoAssetErroredWebhookEvent | VideoAssetReadyWebhookEvent | VideoAssetTrackReadyWebhookEvent;

export const POST = async (request:Request)=>{
    if(!SIGNIN_SECRET){
        throw new Error("MUX Webhook secret is not set");
    }

    const headersPayload = await headers();
    const muxSignature = headersPayload.get("mux-signature");
    if(!muxSignature){
        return new Response("No Signature found" , {status:401});
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    mux.webhooks.verifySignature(
        body,
        {
            "mux-signature":muxSignature,
        },
        SIGNIN_SECRET,
    ); 

    switch(payload.type as WebhookEvent["type"]){
        case "video.asset.created":{
            const data = payload.data as VideoAssetCreatedWebhookEvent["data"];

            if(!data.upload_id){
               return new Response("NO upload Id found " , {status:400})
            }
            
            await db
            .update(videos)
            .set({
                muxAssetId:data.id,
                muxStatus:data.status,
            })
            .where(eq(videos.muxUploadId , data.upload_id));
            break;
        }



    }


    return new Response("Webhook recieved : " , {status:200});
}