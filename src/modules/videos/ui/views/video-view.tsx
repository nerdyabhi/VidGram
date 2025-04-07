import { CommentsSection } from "../section/comments-section"
import { SuggestionsSection } from "../section/suggestion-section"
import VideoSection from "../section/video-section"


interface VideoViewProps {
    videoId: string,
}

export const VideoView = ({ videoId }: VideoViewProps) => {

    return (
        <div className="flex flex-col max-w-[1700px] mx-auto pt-2.5 px-4 mb-10">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main content - video and comments */}
                <div className="flex-1 min-w-0">
                    <VideoSection videoId={videoId} />
                    <CommentsSection videoId={videoId} />
                </div>

                {/* Suggestions section - right side on desktop, below video on mobile */}
                <div className="w-full lg:w-[350px] xl:w-[380px] 2xl:w-[426px]">
                    <div className="">
                        <SuggestionsSection videoId={videoId} />
                    </div>
                </div>
            </div>
        </div>
    )
}