"use client"

import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"
import { VideoRowCard } from "../components/video-row-card";

interface SuggestionSectionInterface {
    videoId: string;
}

export const SuggestionsSection = ({ videoId }: SuggestionSectionInterface) => {

    const [suggestions] = trpc.suggestions.getMany.useSuspenseInfiniteQuery({
        videoId,
        limit: DEFAULT_LIMIT
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })
    return (
        <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-semibold">Suggested videos</h2>
            <div className="space-y-4">
                {suggestions.pages.flatMap((page) => page.items.map((video) => (
                    <VideoRowCard key={video.id} data={video} size='default' />
                )))}
            </div>
        </div>
    )
}