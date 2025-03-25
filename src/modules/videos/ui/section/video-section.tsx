"use client"
import { cn } from "@/lib/utils"
import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { VideoPlayer } from "../components/video-player"
import { VideoBanner } from "../components/video-banner"
import { VideoTopRow } from "../components/video-top-row"
interface VideoSectionProps {
    videoId: string,
}

const VideoSection = ({ videoId }: VideoSectionProps) => {
    return (
        <Suspense fallback={<p>LOading....</p>}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <VideoSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    )
}


const VideoSectionSuspense = ({ videoId }: VideoSectionProps) => {
    const [video] = trpc.vidoes.getOne.useSuspenseQuery({ id: videoId });

    return (
        <>
            <div className={cn(
                "aspect-video bg-black roundex-xl overflow-hidden",
                video.muxStatus !== 'ready' && 'rounded-b-none'
            )}>
                <VideoPlayer
                    autoPlay
                    onPlay={() => { }}
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                />
            </div>
            <VideoBanner status={video.muxStatus} />
            <VideoTopRow video={video} />
        </>
    )
}

export default VideoSection;