"use client"

import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { InfiniteScroll } from "@/components/infinite-scroll"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnail"
import { snakeCaseToTitle } from "@/lib/utils"
import { format } from 'date-fns'
import { Globe2Icon, LockIcon } from "lucide-react"


export const VideosSection = () => {

    return (
        <Suspense fallback={<p>Loading something...</p>}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <VideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}
export const VideosSectionSuspense = () => {
    const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
        { limit: 5 },
        { getNextPageParam: (lastPage) => lastPage.nextCursor });

    return (

        <div className="">
            <div className="border-y">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6 w-[510px]">Video</TableHead>
                            <TableHead className="pl-6 w-[510px]">Visibility</TableHead>
                            <TableHead className="pl-6 w-[510px]">Status</TableHead>
                            <TableHead className="pl-6 w-[510px]">Date</TableHead>
                            <TableHead className="pl-6 w-[510px]">Views</TableHead>
                            <TableHead className="pl-6 w-[510px]">Comments</TableHead>
                            <TableHead className="pl-6 w-[510px]">Like</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.pages.flatMap((page) => page.items).map((video) => (
                            <Link href={`/studio/videos/${video.id}`} key={video.id} legacyBehavior>
                                <TableRow className="cursor-pointer ">
                                    <TableCell>
                                        {/* Video Thumbnail */}
                                        <div className="flex items-center gap-4">
                                            <div className="relative aspect-video w-36 shrink-0">
                                                <VideoThumbnail imageUrl={video?.thumbnailUrl || '/placeholder.svg'} previewUrl={video?.previewUrl} duration={video?.duration || 0} />
                                            </div>
                                            {/* Video Title */}
                                            <div className="flex flex-col overflow-hidden gap-y-1">
                                                <span className="text-sm line-clamp-1">{video.title}</span>
                                                <span className="text-xs text-muted-foreground line-clamp-1">{video.description || "No Description"}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center">
                                            {video.visibility === "private" ? (
                                                <LockIcon className="size-4 mr-2" />
                                            ) :
                                                <Globe2Icon className="size-4 mr-2" />
                                            }

                                            {snakeCaseToTitle(video.visibility)}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center">
                                            {snakeCaseToTitle(video?.muxStatus || "Error")}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        {format(new Date(video.createdAt), 'dd MMM  yy')}
                                    </TableCell>

                                    <TableCell>
                                        views
                                    </TableCell>

                                    <TableCell>
                                        comments
                                    </TableCell>

                                    <TableCell>
                                        Likes
                                    </TableCell>


                                </TableRow>
                            </Link>
                        ))}
                    </TableBody>


                </Table>
            </div>
            <div className="">
                <InfiniteScroll
                    hasNextPage={query.hasNextPage}
                    isFetchingNextPage={query.isFetchingNextPage}
                    fetchNextPage={query.fetchNextPage}
                />
            </div>
        </div>
    )
}