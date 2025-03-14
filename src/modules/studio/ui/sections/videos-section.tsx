"use client"

import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { InfiniteScroll } from "@/components/infinite-scroll"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
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
                                <TableRow className="cursor-pointer text-center">
                                    <TableCell>
                                        {video.title}
                                    </TableCell>

                                    <TableCell>
                                        visibility
                                    </TableCell>

                                    <TableCell>
                                        status
                                    </TableCell>

                                    <TableCell>
                                        {Date.now().toLocaleString()}
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