"use client"
import { cn } from "@/lib/utils"
import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { VideoPlayer, VideoPlayerSkeleton } from "../components/video-player"
import { VideoBanner } from "../components/video-banner"
import { VideoTopRow, VideoTopRowSkeleton } from "../components/video-top-row"
import { useAuth } from "@clerk/nextjs"
interface VideoSectionProps {
    videoId: string,
}

const VideoSection = ({ videoId }: VideoSectionProps) => {
    return (
        <Suspense fallback={<VideoSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error Occured</p>}>
                <VideoSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    )
}


const VideoSectionSkeleton = () => {
    return (
        <>
            <VideoPlayerSkeleton />
            <VideoTopRowSkeleton />
        </>
    )
}

const VideoSectionSuspense = ({ videoId }: VideoSectionProps) => {
    const { isSignedIn } = useAuth();
    const utils = trpc.useUtils();
    const [video] = trpc.vidoes.getOne.useSuspenseQuery({ id: videoId });
    const createView = trpc.videoViews.create.useMutation({
        onSuccess: () => {
            utils.vidoes.getOne.invalidate({ id: videoId });
        },

    });

    const handlePlay = () => {
        if (!isSignedIn) return;
        createView.mutate({ videoId })
    }
    return (
        <>
            <div className={cn(
                "aspect-video bg-black roundex-xl overflow-hidden",
                video.muxStatus !== 'ready' && 'rounded-b-none'
            )}>
                <VideoPlayer
                    autoPlay
                    onPlay={handlePlay}
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