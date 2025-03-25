import { VideoGetOneOutput } from "../../types";
import { VideoDescription } from "./video-description";
import { VideoMenu } from "./video-menu";
import { VideoOwner } from "./video-owner";
import { VideoReactions } from "./video-reactions";

interface VideoTopRowProps {
    video: VideoGetOneOutput;
}

export const VideoTopRow = ({ video }: VideoTopRowProps) => {
    return (
        <div className="flex flex-col gap-4 mt-4">
            <h1 className="text-xl font-semibold">{video.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <VideoOwner user={video.user} videoId={video.id} />


                <div className="flex overflow-x-auto sm:min-w-[calc(50%-6px]]  sm:justify-end sm:overflow-visible pb-2 mb-2 sm:pb-0 sm:mb-0 gap-2">
                    <VideoReactions />
                    <VideoMenu videoId={video.id} variant="secondary" />
                </div>
            </div>

            <VideoDescription
                compactViews='1.5k'
                expandedViews='1,523'
                compactDate='22/22/05'
                description={video.description} expandedDate={"12 Jan 2025"} />
        </div>
    )
} 